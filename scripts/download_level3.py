import sys
import os
import subprocess

level3_downloads = [
    ("kashf-shubuhat", "https://ia800604.us.archive.org/10/items/hamlaenglish_gmail_20180324_0723/%D9%83%D8%B4%D9%81%20%D8%A7%D9%84%D8%B4%D8%A8%D9%87%D8%A7%D8%AA.pdf"),
    ("aqidah-wasitiyyah", "https://ia800100.us.archive.org/26/items/ahmedsalar66_yahoo/%D8%A7%D9%84%D8%B9%D9%82%D9%8A%D8%AF%D8%A9%20%D8%A7%D9%84%D9%88%D8%A7%D8%B3%D8%B7%D9%8A%D8%A9%20%28%D8%A7%D8%A8%D9%86%20%D8%AA%D9%8A%D9%85%D9%8A%D8%A9%29.pdf"),
    ("usul-sunnah", "https://ia601402.us.archive.org/26/items/AAskZad-1262532/Book%20%D8%AA%D9%82%D8%B1%D9%8A%D8%A8%20%D8%A7%D9%84%D8%B9%D9%82%D9%8A%D8%AF%D8%A9%20%D8%A7%D9%84%D8%B5%D8%AD%D9%8A%D8%AD%D8%A9%20%D9%81%D9%8A%20%D8%B6%D9%88%D8%A1%20%D8%B1%D8%B3%D8%A7%D9%84%D8%A9%20%28%D8%A3%D8%B5%D9%88%D9%84%20%D8%A7%D9%84%D8%B3%D9%86%D8%A9%29%20%D9%84%D9%84%D8%A5%D9%85%D8%A7%D9%85%20%D8%A7%D9%84%D9%85%D8%A8%D8%AC%D9%84%20%D8%A3%D8%AD%D9%85%D8%AF%20%D8%A8%D9%86%20%D8%AD%D9%86%D8%A8%D9%84%20%5B1262532%5D%20---%20%D8%A3%D8%AD%D9%85%D8%AF%20%D8%A8%D9%86%20%D8%AD%D9%86%D8%A8%D9%84%20%28%D9%85%D8%A4%D9%84%D9%81%29_%D8%B3%D8%B9%D8%AF%20%D9%8A%D9%88%D8%B3%D9%81%20%D9%85%D8%AD%D9%85%D8%AF%20%D8%A8%D9%86%20%D8%B9%D8%A8%D8%AF%20%D8%A7%D9%84%D9%88%D9%87%D8%A7%D8%A8.pdf"),
    ("manhaj-salikin", "https://ia803103.us.archive.org/8/items/manhajalsalikin-sa3di-dar-alwatan/158422p.pdf"),
    ("sifat-salah", "https://ia800507.us.archive.org/0/items/20230827_20230827_1117/%D8%B5%D9%81%D8%A9%20%D8%B5%D9%84%D8%A7%D8%A9%20%D8%A7%D9%84%D9%86%D8%A8%D9%8A.pdf"),
    ("muqaddima-tafsir", "https://ia903201.us.archive.org/24/items/meeeeeeeeeeee/%25D9%2585%25D9%2582%25D8%25AF%25D9%2585%25D8%25A9%20%25D9%2581%25D9%258A%25D8%25A3%25D8%25B5%25D9%2588%25D9%2584%20%25D8%25A7%25D9%2584%25D8%25AA%25D9%2581%25D8%25B3%25D9%258A%25D8%25B1.pdf"),
    ("lulu-wal-marjan", "https://ia803208.us.archive.org/21/items/20250820_20250820_1112/%D8%A7%D9%84%D9%84%D8%A4%D9%84%D8%A4%20%D9%88%D8%A7%D9%84%D9%85%D8%B1%D8%AC%D8%A7%D9%86%20%D9%81%D9%8A%D9%85%D8%A7%20%D8%A7%D8%AA%D9%81%D9%82%20%D8%B9%D9%84%D9%8A%D9%87%20%D8%A7%D9%84%D8%B4%D9%8A%D8%AE%D8%A7%D9%86%20%20%D8%A7%D9%84%D8%A8%D8%AE%D8%A7%D8%B1%D9%8A%20%D9%88%D9%85%D8%B3%D9%84%D9%85%20%D9%85%D9%81%D9%87%D8%B1%D8%B3.pdf"),
]

for b_id, url in level3_downloads:
    print(f"=== Processing Level 3 Book: {b_id} ===")
    cmd = [sys.executable, "scripts/fetch_books.py", "download", b_id, url, "--approved"]
    res = subprocess.run(cmd)
    if res.returncode != 0:
        print(f"[WARN] Could not download {b_id}, continuing...")
