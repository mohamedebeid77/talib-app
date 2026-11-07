import urllib.request
import json

url = "https://archive.org/metadata/4349015330305083150"
req = urllib.request.Request(url, headers={"User-Agent": "Talib/1.0"})
try:
    with urllib.request.urlopen(req, timeout=10) as r:
        data = json.loads(r.read().decode())
        server = data.get("server")
        d1 = data.get("dir")
        files = data.get("files", [])
        print(f"Server: {server}, dir: {d1}")
        for f in files:
            if f.get("name", "").endswith(".pdf"):
                name = f.get("name")
                sz = int(f.get("size", 0)) / 1024
                d_url = f"https://archive.org/download/4349015330305083150/{name}"
                print(f"PDF File: {name} ({sz:.1f} KB) -> {d_url}")
except Exception as e:
    print("Archive meta err:", e)
