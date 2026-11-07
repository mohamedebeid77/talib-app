import urllib.request
import re

target_url = "https://www.ktobati.com/book/%D9%83%D8%AA%D8%A7%D8%A8-%D8%A7%D9%84%D8%A3%D8%B5%D9%88%D9%84-%D8%A7%D9%84%D8%AB%D9%84%D8%A7%D8%AB%D8%A9-%D9%88-%D8%A3%D8%AF%D9%84%D8%AA%D9%87%D8%A7-%D9%86%D8%B3%D8%AE%D9%87-%D9%85%D8%AC%D8%AF%D8%AF%D8%A9-%D9%88-%D9%85%D9%84%D9%88%D9%86%D8%A9"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

req = urllib.request.Request(target_url, headers=headers)
with urllib.request.urlopen(req, timeout=15) as resp:
    html = resp.read().decode("utf-8", "ignore")

modal_idx = html.find('id="downloadModal"')
if modal_idx != -1:
    modal_html = html[modal_idx:modal_idx+4000]
    with open("scripts/modal.html", "w", encoding="utf-8") as f:
        f.write(modal_html)
    print("Found downloadModal, saved to scripts/modal.html")
else:
    print("downloadModal not found")

# Also check for reader url pattern: ktobati often uses /reader/{uuid}
reader_match = re.search(r'data-read-id=["\']([a-f0-9-]+)["\']', html)
if reader_match:
    print("Read ID found:", reader_match.group(1))
