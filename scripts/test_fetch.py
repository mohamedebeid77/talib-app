import urllib.request
import re

url = "https://www.alukah.net/library/0/13768/"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode("utf-8", "ignore")
        # search for any download or file links
        links = re.findall(r'href=["\']([^"\']*(?:download|file|book|pdf)[^"\']*)["\']', html, re.I)
        print("Matching links:")
        for l in links[:15]:
            print(" -", l)
except Exception as e:
    print("Error:", e)
