import urllib.request
import json
import urllib.parse

def test_head(u):
    try:
        r = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'}, method='HEAD')
        with urllib.request.urlopen(r, timeout=5) as resp:
            return resp.status, int(resp.headers.get('Content-Length', 0))
    except Exception:
        return None, 0

# Search qasas al-anbiya
q = "qasas al-anbiya ibn kathir"
url = f"https://archive.org/advancedsearch.php?q={urllib.parse.quote(q)}+AND+mediatype:texts&fl[]=identifier,title,downloads&sort[]=downloads+desc&rows=10&page=1&output=json"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    docs = json.loads(resp.read().decode('utf-8'))['response']['docs']

for d in docs:
    ident = d['identifier']
    try:
        with urllib.request.urlopen(f"https://archive.org/metadata/{ident}", timeout=5) as m:
            meta = json.loads(m.read().decode('utf-8'))
        srv = meta.get('server')
        dr = meta.get('dir')
        for f in meta.get('files', []):
            name = f.get('name', '')
            sz = int(f.get('size', 0))
            if name.lower().endswith('.pdf') and not name.lower().endswith('_text.pdf'):
                if 2_000_000 < sz < 35_000_000:
                    cand = f"https://{srv}{dr}/{urllib.parse.quote(name)}"
                    st, sl = test_head(cand)
                    if st == 200:
                        print(f"FOUND QASAS ANBIYA: {ident} | {sz/(1024*1024):.2f}MB | {name}")
                        print(f"URL: {cand}")
                        break
        else:
            continue
        break
    except Exception:
        pass
