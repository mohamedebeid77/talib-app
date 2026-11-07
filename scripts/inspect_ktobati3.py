import urllib.request
import re

target_url = "https://www.ktobati.com/book/%D9%83%D8%AA%D8%A7%D8%A8-%D8%A7%D9%84%D8%A3%D8%B5%D9%88%D9%84-%D8%A7%D9%84%D8%AB%D9%84%D8%A7%D8%AB%D8%A9-%D9%88-%D8%A3%D8%AF%D9%84%D8%AA%D9%87%D8%A7-%D9%86%D8%B3%D8%AE%D9%87-%D9%85%D8%AC%D8%AF%D8%AF%D8%A9-%D9%88-%D9%85%D9%84%D9%88%D9%86%D8%A9"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

req = urllib.request.Request(target_url, headers=headers)
with urllib.request.urlopen(req, timeout=15) as resp:
    html = resp.read().decode("utf-8", "ignore")

# Let's search for sections that contain details or buttons
for m in re.finditer(r'تحميل|قراءة|تنزيل|pdf', html, re.I):
    start = max(0, m.start() - 100)
    end = min(len(html), m.end() + 200)
    print("--- MATCH ---")
    print(html[start:end])
