import urllib.request
import re
import json

urls_to_test = [
    # Al-Bitaqa / IslamHouse / Shamela / Dorar / Archive
    ("Archive (Tashkeel Matn)", "https://archive.org/download/Matn-Thalathat-Al-Usool/Matn-Thalathat-Al-Usool.pdf"),
    ("IslamHouse (Three Principles)", "https://d1.islamhouse.com/data/ar/ih_books/single/ar_three_origins.pdf"),
    ("Alukah Matn", "https://alukah.net/library/0/13768/"),
    ("Dorar Matn", "https://dorar.net/files/al-osol.pdf"),
    ("Archive Matn Edition 2", "https://ia800302.us.archive.org/21/items/MatnAlOsoulAlThalatha/MatnAlOsoulAlThalatha.pdf"),
    ("Archive Matn Edition 3", "https://ia902804.us.archive.org/1/items/thlathat-alosol-pdf/thlathat-alosol.pdf")
]

for label, url in urls_to_test:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"}, method="HEAD")
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            sz = resp.headers.get("Content-Length")
            sz_kb = f"{int(sz)/1024:.1f} KB" if sz and sz.isdigit() else "unknown"
            print(f"[OK] {label}: status {resp.status}, size {sz_kb}, url: {url}")
    except Exception as e:
        print(f"[FAIL] {label}: {e}")
