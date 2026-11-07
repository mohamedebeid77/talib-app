import urllib.request
import json

url = "https://archive.org/metadata/abuyaala_kotobenkayim_1757"
with urllib.request.urlopen(url) as r:
    m = json.loads(r.read().decode('utf-8'))

srv = m.get('server')
dr = m.get('dir')

with open("scripts/ibn_qayyim_files.txt", "w", encoding="utf-8") as out:
    for f in m.get('files', []):
        name = f.get('name', '')
        sz = int(f.get('size', 0))
        if name.endswith('.pdf') and not name.endswith('_text.pdf'):
            out.write(f"{sz/(1024*1024):.2f} MB | {name} | https://{srv}{dr}/{name}\n")
print("Saved ibn_qayyim_files.txt")
