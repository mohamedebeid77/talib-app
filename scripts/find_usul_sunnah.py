import urllib.request
import json
import urllib.parse

# Search for usul sunnah
query = "اصول السنة احمد بن حنبل"
url = f"https://archive.org/advancedsearch.php?q={urllib.parse.quote(query)}+AND+mediatype:texts&fl[]=identifier,title,downloads&sort[]=downloads+desc&rows=10&page=1&output=json"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    data = json.loads(resp.read().decode('utf-8'))

docs = data.get('response', {}).get('docs', [])
print(f"Found {len(docs)} items:")
for doc in docs:
    ident = doc['identifier']
    meta_url = f"https://archive.org/metadata/{ident}"
    try:
        with urllib.request.urlopen(meta_url, timeout=5) as m_resp:
            meta = json.loads(m_resp.read().decode('utf-8'))
            server = meta.get('server')
            dir_p = meta.get('dir')
            for f in meta.get('files', []):
                name = f.get('name', '')
                size = int(f.get('size', 0))
                if name.endswith('.pdf') and not name.endswith('_text.pdf') and size < 15_000_000:
                    print(f"IDENT: {ident} | FILE: {name} | SIZE: {size/(1024*1024):.2f}MB")
                    print(f"URL: https://{server}{dir_p}/{urllib.parse.quote(name)}")
                    break
    except Exception as e:
        pass
