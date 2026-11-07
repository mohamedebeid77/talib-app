import urllib.request
import re

url = "https://www.ktobati.com/book/%D9%83%D8%AA%D8%A7%D8%A8-%D8%A7%D9%84%D8%A3%D8%B5%D9%88%D9%84-%D8%A7%D9%84%D8%AB%D9%84%D8%A7%D8%AB%D8%A9"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

req = urllib.request.Request(url, headers=headers)
with urllib.request.urlopen(req, timeout=15) as resp:
    html = resp.read().decode("utf-8", "ignore")

# Find all <a> tags with text containing تحميل or قراءة or all <a> tags with href
links = re.findall(r'<a\s+[^>]*href=["\']([^"\']+)["\'][^>]*>(.*?)</a>', html, re.DOTALL)
for href, text in links:
    clean_text = re.sub(r'<[^>]+>', '', text).strip()
    if any(k in clean_text for k in ["تحميل", "قراءة", "تنزيل", "PDF", "pdf", "الكتاب"]):
        print(f"Text: '{clean_text}' -> Href: '{href}'")
