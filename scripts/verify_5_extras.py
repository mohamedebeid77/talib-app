import urllib.request

urls = [
    ("taysir-karim-rahman", "https://ia600103.us.archive.org/29/items/tasfeerse/taafq.pdf"),
    ("raheeq-makhtum", "https://ia800505.us.archive.org/31/items/sealed_nectar/sealed_nectar.pdf"),
    ("siyar-khulafa", "https://ia800900.us.archive.org/15/items/27_20210716/00.pdf"),
    ("hiqbah-tarikh", "https://ia803105.us.archive.org/33/items/history00076/History-00076.pdf"),
    ("al-fawaid", "https://ia601005.us.archive.org/17/items/alfawaidibnalqayyim_202101/AlFawaidIbnAlQayyim.pdf"),
]

for b_id, u in urls:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'}, method='HEAD')
        with urllib.request.urlopen(req, timeout=5) as r:
            sz = int(r.headers.get('Content-Length', 0))
            print(f"[{b_id}] OK: {r.status}, size: {sz/(1024*1024):.2f}MB")
    except Exception as e:
        print(f"[{b_id}] ERR: {e}")
