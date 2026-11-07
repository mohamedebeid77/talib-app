import urllib.request
import urllib.parse
import json

books_l2 = [
    ("kitab-tawhid", 'title:"كتاب التوحيد" AND creator:"محمد بن عبد الوهاب" AND mediatype:texts'),
    ("shurut-salah", 'title:"شروط الصلاة وأركانها" AND mediatype:texts'),
    ("al-kabair", 'title:"الكبائر" AND creator:"الذهبي" AND mediatype:texts'),
    ("riyad-salihin", 'title:"رياض الصالحين" AND creator:"النووي" AND mediatype:texts'),
]

for b_id, q in books_l2:
    url = f"https://archive.org/advancedsearch.php?q={urllib.parse.quote(q)}&fl[]=identifier,title,downloads&sort[]=downloads+desc&rows=3&output=json"
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
                            # find smallest pdf
                            files_sorted = sorted(files, key=lambda x: int(x.get("size", 999999999)))
                            f0 = files_sorted[0]
                            sz_mb = int(f0.get("size", 0)) / (1024 * 1024)
                            name = f0.get("name")
                            print(f"[FOUND {b_id}] {ident} -> {name} ({sz_mb:.2f} MB): https://{server}{d1}/{name}")
                            break
                except Exception:
                    pass
    except Exception as e:
        print(f"Err {b_id}: {e}")
