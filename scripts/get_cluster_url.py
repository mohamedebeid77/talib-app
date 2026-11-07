import urllib.request
import json

url = "https://archive.org/metadata/1436AlQawaaidAlArbaaOsaimi"
req = urllib.request.Request(url, headers={"User-Agent": "Talib/1.0"})
try:
    with urllib.request.urlopen(req, timeout=10) as r:
        data = json.loads(r.read().decode())
        server = data.get("server")
        d1 = data.get("dir")
        print("Server:", server)
        print("Dir:", d1)
        for f in data.get("files", []):
            if f.get("name", "").endswith(".pdf"):
                name = f.get("name")
                direct_url = f"https://{server}{d1}/{name}"
                print("Direct cluster URL:", direct_url)
except Exception as e:
    print("Err:", e)
