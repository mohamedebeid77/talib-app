#!/usr/bin/env python3
"""Scan the packed Electron app.asar for skill-discovery path strings."""
import re
import sys

ASAR = r"C:\Users\DELL\AppData\Local\Programs\MiniMax Code\resources\app.asar"
NEEDLES = [
    b"builtin-skills",
    b".agents/skills",
    b".agents" + b"/" + b"skills",
    b".claude/skills",
    b"SKILL.md",
    b"skillsDir",
    b"skillPaths",
]

seen = set()
hits = {}

with open(ASAR, "rb") as fh:
    data = fh.read()

print(f"asar size: {len(data)/1024/1024:.1f} MB")
for needle in NEEDLES:
    start = 0
    n = 0
    while True:
        i = data.find(needle, start)
        if i < 0:
            break
        start = i + 1
        n += 1
        if n > 400:
            break
        lo = max(0, i - 160)
        hi = min(len(data), i + len(needle) + 160)
        chunk = data[lo:hi]
        try:
            text = chunk.decode("utf-8", errors="replace")
        except Exception:
            continue
        # keep only printable-ish context
        text = re.sub(r"[^\x20-\x7E\u4e00-\u9fff/.:{}\[\]\-_]+", " ", text)
        text = re.sub(r"\s{2,}", " ", text).strip()
        if text not in seen:
            seen.add(text)
            hits.setdefault(needle.decode(), []).append(text)
    print(f"\n### {needle.decode()}: {n} raw hits")

for name, lst in hits.items():
    print(f"\n===== {name} =====")
    for t in lst[:25]:
        print("  -", t[:300])
