import urllib.request
import re
import urllib.parse

target_url = "https://www.ktobati.com/book/%D9%83%D8%AA%D8%A7%D8%A8-%D8%A7%D9%84%D8%A3%D8%B5%D9%88%D9%84-%D8%A7%D9%84%D8%AB%D9%84%D8%A7%D8%AB%D8%A9-%D9%88-%D8%A3%D8%AF%D9%84%D8%AA%D9%87%D8%A7-%D9%86%D8%B3%D8%AE%D9%87-%D9%85%D8%AC%D8%AF%D8%AF%D8%A9-%D9%88-%D9%85%D9%84%D9%88%D9%86%D8%A9"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

req = urllib.request.Request(target_url, headers=headers)
try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        html = resp.read().decode("utf-8", "ignore")
        print("Page HTML size:", len(html))
        # Look for forms, inputs, scripts or links
        forms = re.findall(r'<form\s+[^>]*action=["\']([^"\']*)["\'][^>]*>(.*?)</form>', html, re.DOTALL)
        print(f"Found {len(forms)} forms:")
        for action, content in forms:
            print(" Form Action:", action)
            inputs = re.findall(r'<input\s+[^>]*name=["\']([^"\']*)["\'][^>]*value=["\']([^"\']*)["\']', content)
            print("  Inputs:", inputs)

        # Look for direct links containing reader or download or pdf
        all_hrefs = re.findall(r'href=["\']([^"\']+)["\']', html)
        print("\nInteresting hrefs:")
        for h in set(all_hrefs):
            if any(k in h.lower() for k in ["pdf", "download", "read", "viewer", "file"]):
                print(" -", h)

        # Check script variables or embedded pdf url
        scripts = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
        for s in scripts:
            if "pdf" in s.lower():
                print("\nScript snippet mentioning pdf:")
                print(s[:500])
except Exception as e:
    print("Error:", e)
