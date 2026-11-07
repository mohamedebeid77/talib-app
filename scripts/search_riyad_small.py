import urllib.request
import urllib.parse
import json

q = 'title:"رياض الصالحين" AND mediatype:texts'
url = f"https://archive.org/advancedsearch.php?q={urllib.parse.quote(q)}&fl[]=identifier,title,downloads&sort[]=downloads+desc&rows=15&output=json"

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
                    for f in files:
                        sz_mb = int(f.get("size", 0)) / (1024 * 1024)
                        if 1.0 <= sz_mb <= 14.0: # under 15MB warning threshold!
                            print(f"[CANDIDATE RIYAD] {ident} -> {f.get('name')} ({sz_mb:.2f} MB): https://{server}{d1}/{urllib.parse.quote(f.get('name'))}")
                            break
            except Exception:
                pass
except Exception as e:
    print("Err:", e)
