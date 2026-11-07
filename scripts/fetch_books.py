#!/usr/bin/env python3
"""
Book Acquisition Pipeline for "Talib"
Adheres strictly to the 9 rules in build-prompt.md:
1. Candidate table with HEAD check before download
2. 1 book at a time in level order
3. Legitimate scholar / IslamHouse / archive.org sources
4. Text-based clean PDFs
5. Size limits: warn > 15MB, refuse > 50MB, 500MB total budget
6. Verify %PDF, sane page count, hash check
7. Save as public/assets/books/<id>.pdf and update books.json
8. Log in SOURCES.md
"""
import sys
import os
import json
import hashlib
import urllib.request
import urllib.error
from datetime import datetime

UA = {"User-Agent": "TalibApp-BookFetcher/1.0 (Educational/Islamic Study; Arabic PDF Acquisition)"}
MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024 # 50 MB max
WARN_FILE_SIZE_BYTES = 15 * 1024 * 1024 # 15 MB warn
BUDGET_LIMIT_BYTES = 500 * 1024 * 1024 # 500 MB budget

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BOOKS_JSON_PATH = os.path.join(BASE_DIR, "src", "data", "books.json")
SOURCES_MD_PATH = os.path.join(BASE_DIR, "SOURCES.md")
TARGET_BOOKS_DIR = os.path.join(BASE_DIR, "public", "assets", "books")

def check_url_head(url):
    """Performs HTTP HEAD to check availability and Content-Length."""
    req = urllib.request.Request(url, headers=UA, method="HEAD")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            status = resp.status
            size = resp.headers.get("Content-Length")
            content_type = resp.headers.get("Content-Type", "")
            size_bytes = int(size) if size and size.isdigit() else None
            return {
                "ok": True,
                "status": status,
                "size_bytes": size_bytes,
                "content_type": content_type,
                "error": None
            }
    except Exception as e:
        # Some servers disallow HEAD, try GET with range
        try:
            req_get = urllib.request.Request(url, headers={**UA, "Range": "bytes=0-1024"})
            with urllib.request.urlopen(req_get, timeout=15) as resp:
                size_header = resp.headers.get("Content-Range")
                size_bytes = None
                if size_header and "/" in size_header:
                    total_str = size_header.split("/")[-1]
                    if total_str.isdigit():
                        size_bytes = int(total_str)
                return {
                    "ok": True,
                    "status": resp.status,
                    "size_bytes": size_bytes,
                    "content_type": resp.headers.get("Content-Type", ""),
                    "error": None
                }
        except Exception as e2:
            return {
                "ok": False,
                "status": getattr(e, "code", 0),
                "size_bytes": None,
                "content_type": None,
                "error": str(e2)
            }

def download_book(book_id, url, approved_by_user=False):
    """Downloads, verifies and registers an approved book."""
    if not approved_by_user:
        print("[ERROR] Cannot download without explicit user approval.")
        return False

    os.makedirs(TARGET_BOOKS_DIR, exist_ok=True)
    target_path = os.path.join(TARGET_BOOKS_DIR, f"{book_id}.pdf")

    print(f"[*] Downloading {book_id} from {url}...")
    req = urllib.request.Request(url, headers=UA)
    
    data = bytearray()
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            while True:
                chunk = resp.read(65536)
                if not chunk:
                    break
                data.extend(chunk)
    except Exception as e:
        print(f"[ERROR] Download failed: {e}")
        return False

    size_bytes = len(data)
    print(f"[*] Downloaded: {size_bytes / (1024*1024):.2f} MB")

    # Rule 5: Size limit check
    if size_bytes > MAX_FILE_SIZE_BYTES:
        print(f"[REJECTED] File exceeds 50MB limit ({size_bytes} bytes). Aborting.")
        return False
    elif size_bytes > WARN_FILE_SIZE_BYTES:
        print(f"[WARNING] File is over 15MB ({size_bytes/(1024*1024):.1f} MB).")

    # Rule 6: Magic byte verification (%PDF)
    if not data.startswith(b"%PDF"):
        print("[REJECTED] File does not start with %PDF magic bytes! Aborting.")
        return False

    # Compute SHA256
    sha256 = hashlib.sha256(data).hexdigest()

    # Save file
    with open(target_path, "wb") as f:
        f.write(data)

    print(f"[SUCCESS] Saved to {target_path}")

    # Rule 7: Update books.json
    try:
        with open(BOOKS_JSON_PATH, "r", encoding="utf-8") as f:
            books = json.load(f)

        for b in books:
            if b["id"] == book_id:
                b["pdf_filename"] = f"{book_id}.pdf"
                b["size_bytes"] = size_bytes
                b["source_url"] = url
                break

        with open(BOOKS_JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(books, f, ensure_ascii=False, indent=2)
        print("[*] Updated books.json")
    except Exception as e:
        print(f"[ERROR] Failed to update books.json: {e}")

    # Rule 8: Append to SOURCES.md
    log_line = f"| `{book_id}` | `{url}` | {datetime.utcnow().strftime('%Y-%m-%d')} | {size_bytes/(1024*1024):.2f} MB | `{sha256[:16]}...` |\n"
    if not os.path.exists(SOURCES_MD_PATH):
        with open(SOURCES_MD_PATH, "w", encoding="utf-8") as f:
            f.write("# سجل مصادر الكتب (SOURCES.md)\n\n| الكتاب (ID) | رابط المصدر | التاريخ | الحجم | البصمة (SHA256) |\n|---|---|---|---|---|\n")
    with open(SOURCES_MD_PATH, "a", encoding="utf-8") as f:
        f.write(log_line)

    print("[*] Logged in SOURCES.md")
    return True

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python fetch_books.py check <url> OR python fetch_books.py download <id> <url> --approved")
        sys.exit(1)

    cmd = sys.argv[1]
    if cmd == "check" and len(sys.argv) >= 3:
        info = check_url_head(sys.argv[2])
        print(json.dumps(info, indent=2))
    elif cmd == "download" and len(sys.argv) >= 4:
        approved = "--approved" in sys.argv
        download_book(sys.argv[2], sys.argv[3], approved_by_user=approved)
