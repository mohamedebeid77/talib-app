import urllib.request
import json

url = "https://archive.org/metadata/1436AlQawaaidAlArbaaOsaimi"
req = urllib.request.Request(url, headers={"User-Agent": "Talib/1.0"})
try:
    with urllib.request.urlopen(req, timeout=10) as r:
        data = json.loads(r.read().decode())
        server = data.get("server")
        d1 = data.get("dir")
        for f in data.get("files", []):
            if f.get("name", "").endswith(".pdf"):
                name = f.get("name")
                sz = int(f.get("size", 0)) / 1024
                print(f"File: {name} ({sz:.1f} KB) -> https://archive.org/download/1436AlQawaaidAlArbaaOsaimi/{name}")
except Exception as e:
    print("Err:", e)
