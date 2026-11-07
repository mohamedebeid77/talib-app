import sys
import subprocess

final_batch = [
    ("muqaddima-tafsir", "https://ia803209.us.archive.org/22/items/01000-pdf/01000%20%D9%83%D8%AA%D8%A7%D8%A8%20%20%20%20%20pdf%20%20%D8%A7%D9%84%D8%B4%D9%8A%D8%AE%20%D8%B5%D8%A7%D9%84%D8%AD%20%20%D8%A7%D9%84%20%D8%A2%D9%84%20%D8%A7%D9%84%D8%B4%D9%8A%D8%AE%20%20%D9%85%D9%82%D8%AF%D9%85%D8%A9%20%D9%81%D9%8A%20%D8%A7%D8%B5%D9%88%D9%84%20%D8%A7%D9%84%D8%AA%D9%81%D8%B3%D9%8A%D8%B1.pdf"),
    ("al-da-wal-dawa", "https://ia803204.us.archive.org/6/items/abuyaala_kotobenkayim_1757/%D8%A7%D9%84%D8%AF%D8%A7%D8%A1%20%D9%88%D8%A7%D9%84%D8%AF%D9%88%D8%A7%D8%A1%20%D8%B7%20%D8%A7%D9%84%D9%85%D8%AC%D9%85%D8%B9.pdf"),
    ("tuhfat-atfal", "https://ia801804.us.archive.org/35/items/jazaria_tohfa_zo3bi/jazaria_tohfa_zo3bi.pdf"),
    ("qasas-anbiya", "https://ia600904.us.archive.org/33/items/20190901_20190901_0952/%D9%82%D8%B5%D8%B5%20%D8%A7%D9%84%D8%A3%D9%86%D8%A8%D9%8A%D8%A7%D8%A1%20%D8%A7%D8%A8%D9%86%20%D9%83%D8%AB%D9%8A%D8%B1.pdf"),
    ("madarij-salikin", "https://ia803204.us.archive.org/6/items/abuyaala_kotobenkayim_1757/%D9%85%D8%AF%D8%A7%D8%B1%D8%AC%20%D8%A7%D9%84%D8%B3%D8%A7%D9%84%D9%83%D9%8A%D9%86%20%D8%B7%20%D8%A7%D9%84%D8%B1%D8%B3%D8%A7%D9%84%D8%A9.pdf"),
]

for b_id, url in final_batch:
    print(f"=== Downloading Book: {b_id} ===", flush=True)
    cmd = [sys.executable, "scripts/fetch_books.py", "download", b_id, url, "--approved"]
    res = subprocess.run(cmd)
    if res.returncode != 0:
        print(f"[WARN] Failed to download {b_id}", flush=True)

print("=== ALL REMAINING BOOKS COMPLETED ===", flush=True)
