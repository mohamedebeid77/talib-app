import urllib.request
import json
import re

url = "https://www.ktobati.com/reader/27c7f2b1-895e-4fb0-9d75-1fba3e5923e0"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}
req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        html = resp.read().decode("utf-8", "ignore")
        print("Reader Status:", resp.status)
        # Check if the PDF file path is embedded in reader HTML
        pdf_urls = re.findall(r'https?://[^\s"\'<>]+\.pdf[^\s"\'<>]*', html)
        print("PDF links in reader:", pdf_urls)
except Exception as e:
    print("Reader error:", e)
