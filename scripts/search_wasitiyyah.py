import urllib.request
import json

identifiers = ["1436AlAqeedahAlWasitiyyah", "Matn-Al-Aqeedah-Al-Wasitiyyah", "aqidah-wasitiyah-pdf", "al-aqidah-al-wasitiyyah"]
for ident in identifiers:
    try:
        url = f"https://archive.org/metadata/{ident}"
        req = urllib.request.Request(url, headers={"User-Agent": "Talib/1.0"})
        with urllib.request.urlopen(req, timeout=5) as r:
            data = json.loads(r.read().decode())
            server = data.get("server")
            d1 = data.get("dir")
            files = [f for f in data.get("files", []) if f.get("name", "").endswith(".pdf")]
            if files:
                f0 = files[0]
                sz = int(f0.get("size", 0)) / (1024 * 1024)
                print(f"[WASITIYYAH] {ident}: {f0.get('name')} ({sz:.2f} MB)")
    except Exception:
        pass
