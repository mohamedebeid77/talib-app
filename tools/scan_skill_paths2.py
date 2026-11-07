#!/usr/bin/env python3
"""Print context around skill-path resolution strings inside app.asar."""
import re

ASAR = r"C:\Users\DELL\AppData\Local\Programs\MiniMax Code\resources\app.asar"

with open(ASAR, "rb") as fh:
    data = fh.read()

def ctx(needle, limit=14, span=420):
    print(f"\n########## {needle!r} ##########")
    start = 0
    n = 0
    while n < limit:
        i = data.find(needle, start)
        if i < 0:
            break
        start = i + 1
        n += 1
        lo, hi = max(0, i - span), min(len(data), i + span)
        t = data[lo:hi].decode("utf-8", errors="replace")
        t = re.sub(r"[^\x20-\x7E\u4e00-\u9fff/.:{}\[\]\-_*?]+", " ", t)
        t = re.sub(r"\s{2,}", " ", t).strip()
        print(f"  [{n}] ...{t}...\n")

for needle in [
    b"skillPaths",
    b"config.skills",
    b"resolveSkillPaths",
    b"extraSkillDirs",
    b"skillDirs",
]:
    ctx(needle)
