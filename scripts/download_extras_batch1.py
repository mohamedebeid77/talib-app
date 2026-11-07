import sys
import subprocess

extras_batch1 = [
    ("siyar-khulafa", "https://ia800900.us.archive.org/15/items/27_20210716/00.pdf"),
    ("al-fawaid", "https://ia601005.us.archive.org/17/items/alfawaidibnalqayyim_202101/AlFawaidIbnAlQayyim.pdf"),
    ("hiqbah-tarikh", "https://ia803105.us.archive.org/33/items/history00076/History-00076.pdf"),
    ("raheeq-makhtum", "https://ia800505.us.archive.org/31/items/sealed_nectar/sealed_nectar.pdf"),
    ("taysir-karim-rahman", "https://ia600103.us.archive.org/29/items/tasfeerse/taafq.pdf"),
]

for b_id, url in extras_batch1:
    print(f"=== Downloading Extras Book: {b_id} ===", flush=True)
    cmd = [sys.executable, "scripts/fetch_books.py", "download", b_id, url, "--approved"]
    res = subprocess.run(cmd)
    if res.returncode != 0:
        print(f"[WARN] Failed to download {b_id}", flush=True)
