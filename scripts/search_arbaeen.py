import urllib.request
import urllib.parse
import json

q = 'title:"الأربعون النووية" AND mediatype:texts'
url = f"https://archive.org/advancedsearch.php?q={urllib.parse.quote(q)}&fl[]=identifier,title,downloads&sort[]=downloads+desc&rows=6&output=json"

req = urllib.request.Request(url, headers={"User-Agent": "TalibApp/1.0"})
try:
    with urllib.request.urlopen(req, timeout=10) as r:
        res = json.loads(r.read().decode())
        docs = res.get("response", {}).get("docs", [])
        for d in docs:
            ident = d.get("identifier")
            meta_url = f"https://archive.org/metadata/{ident}"
            try:
                with urllib.request.urlopen(urllib.request.Request(meta_url, headers={"User-Agent": "Talib/1.0"}), timeout=5) as mr:
                    mdata = json.loads(mr.read().decode())
                    server = mdata.get("server")
                    d1 = mdata.get("dir")
                    files = [f for f in mdata.get("files", []) if f.get("name", "").endswith(".pdf")]
                    if files:
                        f0 = files[0]
                        sz_kb = int(f0.get("size", 0)) / 1024
                        print(f"[{ident}] {f0.get('name')} ({sz_kb:.1f} KB) -> https://{server}{d1}/{f0.get('name')}")
            except Exception as me:
                pass
except Exception as e:
    print("Search err:", e)
