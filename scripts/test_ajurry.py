import urllib.request

url = "https://www.ajurry.com/vb/attachment.php?id=3811&d=1332073698"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
try:
    with urllib.request.urlopen(req, timeout=10) as r:
        data = r.read()
        print("Status:", r.status)
        print("Size:", len(data) / 1024, "KB")
        print("Starts with %PDF:", data.startswith(b"%PDF"))
except Exception as e:
    print("Error:", e)
