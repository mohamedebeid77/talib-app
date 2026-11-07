import urllib.request
import json
import urllib.parse

queries = [
    ("taysir-karim-rahman", "تيسير الكريم الرحمن تفسير السعدي"),
    ("tuhfat-atfal", "تحفة الاطفال الجمزوري"),
    ("raheeq-makhtum", "الرحيق المختوم المباركفوري"),
    ("qasas-anbiya", "قصص الانبياء ابن كثير"),
    ("siyar-khulafa", "سيرة الخلفاء الراشدين"),
    ("hiqbah-tarikh", "حقبة من التاريخ عثمان الخميس"),
    ("al-fawaid", "الفوائد ابن القيم"),
    ("madarij-salikin", "تهذيب مدارج السالكين ابن القيم"),
    ("al-da-wal-dawa", "الداء والدواء ابن القيم الجواب الكافي"),
]

print("Searching archive.org for Extras books...")
results = {}

for book_id, q in queries:
    url = f"https://archive.org/advancedsearch.php?q={urllib.parse.quote(q)}+AND+mediatype:texts&fl[]=identifier,title,downloads&sort[]=downloads+desc&rows=6&page=1&output=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            docs = data.get('response', {}).get('docs', [])
            candidates = []
            for doc in docs:
                ident = doc['identifier']
                # get files from metadata API
                meta_url = f"https://archive.org/metadata/{ident}"
                m_req = urllib.request.Request(meta_url, headers={'User-Agent': 'Mozilla/5.0'})
                try:
                    with urllib.request.urlopen(m_req, timeout=10) as m_resp:
                        meta = json.loads(m_resp.read().decode('utf-8'))
                        server = meta.get('server')
                        dir_path = meta.get('dir')
                        files = meta.get('files', [])
                        for f in files:
                            name = f.get('name', '')
                            size = int(f.get('size', 0))
                            if name.lower().endswith('.pdf') and not name.lower().endswith('_text.pdf'):
                                if 100_000 < size < 45_000_000: # 100KB to 45MB
                                    dl_url = f"https://{server}{dir_path}/{urllib.parse.quote(name)}"
                                    candidates.append({
                                        'identifier': ident,
                                        'file': name,
                                        'size_mb': round(size / (1024*1024), 2),
                                        'url': dl_url
                                    })
                                    break
                except Exception as ex:
                    pass
                if candidates:
                    break
            results[book_id] = candidates
            print(f"[{book_id}] found {len(candidates)} candidate(s)")
            if candidates:
                print(f"   -> {candidates[0]['size_mb']} MB: {candidates[0]['url'][:80]}...")
    except Exception as e:
        print(f"[{book_id}] error: {e}")

with open("scripts/extras_candidates.json", "w", encoding="utf-8") as out:
    json.dump(results, out, ensure_ascii=False, indent=2)
print("Saved candidates to scripts/extras_candidates.json")
