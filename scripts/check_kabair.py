import urllib.request
import urllib.parse
import json

url = "https://archive.org/metadata/20200130_20200130_1147"
req = urllib.request.Request(url, headers={"User-Agent": "Talib/1.0"})
try:
    with urllib.request.urlopen(req, timeout=10) as r:
        data = json.loads(r.read().decode())
        server = data.get("server")
        d1 = data.get("dir")
        for f in data.get("files", []):
            if f.get("name", "").endswith(".pdf"):
                name = f.get("name")
                print("Kabair PDF:", repr(name))
                encoded = urllib.parse.quote(name)
                print("URL:", f"https://{server}{d1}/{encoded}")
except Exception as e:
    print("Err:", e)
