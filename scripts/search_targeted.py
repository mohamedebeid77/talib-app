import urllib.request
import json
import urllib.parse

def search_clean_pdf(q, max_mb=30):
    url = f"https://archive.org/advancedsearch.php?q={urllib.parse.quote(q)}+AND+mediatype:texts&fl[]=identifier,title,downloads&sort[]=downloads+desc&rows=15&page=1&output=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            docs = json.loads(r.read().decode('utf-8'))['response']['docs']
        for d in docs:
            ident = d['identifier']
            with urllib.request.urlopen(f"https://archive.org/metadata/{ident}", timeout=5) as m:
                meta = json.loads(m.read().decode('utf-8'))
            server = meta.get('server')
            dir_p = meta.get('dir')
            for f in meta.get('files', []):
                fn = f.get('name', '')
                sz = int(f.get('size', 0))
                if fn.lower().endswith('.pdf') and not fn.lower().endswith('_text.pdf'):
                    if 100_000 < sz < max_mb * 1024 * 1024:
                        dl = f"https://{server}{dir_p}/{urllib.parse.quote(fn)}"
                        # test head
                        try:
                            hreq = urllib.request.Request(dl, headers={'User-Agent': 'Mozilla/5.0'}, method='HEAD')
                            with urllib.request.urlopen(hreq, timeout=5) as hr:
                                if hr.status == 200:
                                    return dl, round(sz/(1024*1024), 2), ident, fn
                        except Exception:
                            pass
    except Exception as e:
        print(f"Error searching {q}: {e}")
    return None

needed = [
    ("muqaddima-tafsir", "مقدمة اصول التفسير ابن تيمية"),
    ("tuhfat-atfal", "متن تحفة الاطفال الجمزوري"),
    ("qasas-anbiya", "كتاب قصص الانبياء ابن كثير"),
    ("al-da-wal-dawa", "الداء والدواء ابن القيم الجواب الكافي"),
    ("madarij-salikin", "مختصر مدارج السالكين ابن القيم"),
]

for b_id, query in needed:
    print(f"Searching for {b_id} ({query})...")
    res = search_clean_pdf(query)
    if res:
        dl, sz, ident, fn = res
        print(f"FOUND: {b_id} -> {sz} MB: {dl}")
    else:
        print(f"NOT FOUND: {b_id}")
