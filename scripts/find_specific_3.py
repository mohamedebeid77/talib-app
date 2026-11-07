import urllib.request
import json
import urllib.parse

def find_specific(ident_query):
    q_enc = urllib.parse.quote(ident_query)
    url = f"https://archive.org/advancedsearch.php?q={q_enc}+AND+mediatype:texts&fl[]=identifier,title,downloads&sort[]=downloads+desc&rows=5&page=1&output=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=5) as r:
            docs = json.loads(r.read().decode('utf-8'))['response']['docs']
            for d in docs:
                ident = d['identifier']
                with urllib.request.urlopen(f"https://archive.org/metadata/{ident}", timeout=5) as m:
                    meta = json.loads(m.read().decode('utf-8'))
                srv = meta.get('server')
                dr = meta.get('dir')
                for f in meta.get('files', []):
                    name = f.get('name', '')
                    sz = int(f.get('size', 0))
                    if name.lower().endswith('.pdf') and not name.lower().endswith('_text.pdf'):
                        if 50_000 < sz < 30_000_000:
                            dl = f"https://{srv}{dr}/{urllib.parse.quote(name)}"
                            print(f"{ident} | {sz/(1024*1024):.2f} MB | {name}")
                            print(f"URL: {dl}")
                            return dl
    except Exception as e:
        print(f"Err {ident_query}: {e}")
    return None

print("--- Searching Tohfat Atfal ---")
find_specific("title:(تحفة الاطفال)")

print("--- Searching Qasas Anbiya ---")
find_specific("title:(قصص الانبياء) AND creator:(ابن كثير)")

print("--- Searching Muqaddima Tafsir ---")
find_specific("title:(مقدمة في اصول التفسير)")
