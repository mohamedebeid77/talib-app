import urllib.request
import json
import urllib.parse

ident = "meeeeeeeeeeee"
url = f"https://archive.org/metadata/{ident}"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp:
    meta = json.loads(resp.read().decode('utf-8'))
server = meta.get('server')
dir_p = meta.get('dir')
print(f"Server: {server}, Dir: {dir_p}")
for f in meta.get('files', []):
    name = f.get('name', '')
    if name.endswith('.pdf'):
        print(f"File: {name}, Size: {int(f.get('size',0))/(1024*1024):.2f}MB")
        print(f"URL: https://{server}{dir_p}/{urllib.parse.quote(name)}")
