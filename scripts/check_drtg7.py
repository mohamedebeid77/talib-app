import urllib.request
import json

url = "https://archive.org/metadata/drtg7"
req = urllib.request.Request(url, headers={"User-Agent": "Talib/1.0"})
try:
    with urllib.request.urlopen(req, timeout=10) as r:
        data = json.loads(r.read().decode())
        meta = data.get("metadata", {})
        print("Title:", meta.get("title"))
        print("Description:", meta.get("description"))
except Exception as e:
    print("Err:", e)
