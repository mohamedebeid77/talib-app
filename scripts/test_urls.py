import urllib.request
import json
import urllib.parse

def test_url(u):
    req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, timeout=8) as r:
            return r.status, int(r.headers.get('Content-Length', 0))
    except Exception as e:
        return None, str(e)

# test usul sunnah
us_url = "https://ia800409.us.archive.org/15/items/Hdjhj_38g7jfsA/%D8%B4%D8%B1%D8%AD%20%D8%A7%D8%B5%D9%88%D9%84%20%D8%A7%D9%84%D8%B3%D9%86%D8%A9%20%D9%84%D9%84%D8%A7%D9%85%D8%A7%D9%85%20%D8%A7%D8%AD%D9%85%D8%AF%20%D8%A8%D9%86%20%D8%AD%D9%86%D8%A8%D9%84%20-%20%D8%B9%D8%A8%D8%AF%D8%A7%D9%84%D8%B9%D8%B2%D9%8A%D8%B2%20%D8%A7%D9%84%D8%B1%D8%A7%D8%AC%D8%AD%D9%8A.pdf"
print("Testing usul sunnah:", test_url(us_url))

# find another muqaddima tafsir
url = "https://archive.org/advancedsearch.php?q=muqaddima+tafsir+AND+mediatype:texts&fl[]=identifier,title,downloads&sort[]=downloads+desc&rows=10&output=json"
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
                fn = f.get('name', '')
                sz = int(f.get('size', 0))
                if fn.endswith('.pdf') and sz < 15_000_000:
                    cand = f"https://{srv}{dr}/{urllib.parse.quote(fn)}"
                    st, sl = test_url(cand)
                    if st == 200:
                        print(f"FOUND valid muqaddima: {ident} / {fn} ({sl/(1024*1024):.2f}MB)")
                        print("URL:", cand)
                        break
            else:
                continue
            break
    except Exception as e:
        pass
