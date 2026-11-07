import urllib.request
import json
import urllib.parse

# List files in abuyaala_kotobenkayim collection
for ident in ["abuyaala_kotobenkayim_1757", "abuyaala_kotobenkayim"]:
    try:
        url = f"https://archive.org/metadata/{ident}"
        with urllib.request.urlopen(url, timeout=6) as r:
            m = json.loads(r.read().decode('utf-8'))
            srv = m.get('server')
            dr = m.get('dir')
            for f in m.get('files', []):
                name = f.get('name', '')
                sz = int(f.get('size', 0))
                if name.endswith('.pdf'):
                    print(f"IDENT: {ident} | {name} | {sz/(1024*1024):.2f}MB")
    except Exception as e:
        print(f"Error {ident}: {e}")
