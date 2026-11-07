import urllib.request
import urllib.parse
import json

books_l3 = [
    ("kashf-shubuhat", 'title:"كشف الشبهات" AND creator:"محمد بن عبد الوهاب" AND mediatype:texts'),
    ("aqidah-wasitiyyah", 'title:"العقيدة الواسطية" AND creator:"ابن تيمية" AND mediatype:texts'),
    ("usul-sunnah", 'title:"أصول السنة" AND creator:"أحمد بن حنبل" AND mediatype:texts'),
    ("manhaj-salikin", 'title:"منهج السالكين" AND creator:"السعدي" AND mediatype:texts'),
    ("sifat-salah", 'title:"صفة صلاة النبي" AND creator:"الألباني" AND mediatype:texts'),
    ("muqaddima-tafsir", 'title:"مقدمة في أصول التفسير" AND creator:"ابن تيمية" AND mediatype:texts'),
    ("lulu-wal-marjan", 'title:"اللؤلؤ والمرجان" AND creator:"عبد الباقي" AND mediatype:texts'),
]

for b_id, q in books_l3:
    url = f"https://archive.org/advancedsearch.php?q={urllib.parse.quote(q)}&fl[]=identifier,title,downloads&sort[]=downloads+desc&rows=4&output=json"
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
                            files_sorted = sorted(files, key=lambda x: int(x.get("size", 999999999)))
                            f0 = files_sorted[0]
                            sz_mb = int(f0.get("size", 0)) / (1024 * 1024)
                            name = f0.get("name")
                            if sz_mb <= 25.0: # under reasonable limit
                                print(f"[FOUND {b_id}] {ident} -> {name} ({sz_mb:.2f} MB): https://{server}{d1}/{urllib.parse.quote(name)}")
                                break
                except Exception:
                    pass
    except Exception as e:
        print(f"Err {b_id}: {e}")
