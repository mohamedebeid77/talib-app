#!/usr/bin/env python3
"""Find the config schema for skills.external in app.asar."""
import re

ASAR = r"C:\Users\DELL\AppData\Local\Programs\MiniMax Code\resources\app.asar"
with open(ASAR, "rb") as fh:
    data = fh.read()


def show(needle, limit=6, span=700):
    print(f"\n########## {needle!r} ##########")
    start, n = 0, 0
    while n < limit:
        i = data.find(needle, start)
        if i < 0:
            break
        start, n = i + 1, n + 1
        lo, hi = max(0, i - span), min(len(data), i + span)
        t = data[lo:hi].decode("utf-8", errors="replace")
        t = re.sub(r"[^\x20-\x7E\u4e00-\u9fff/.:{}\[\]\-_*?]+", " ", t)
        t = re.sub(r"\s{2,}", " ", t).strip()
        print(f"  [{n}] ...{t}...\n")


for needle in [b"DEFAULT_SKILLS_CONFIG", b"externalSkillRoot", b"walkUp", b"skills:\n  external"]:
    show(needle)
