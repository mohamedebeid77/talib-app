#!/usr/bin/env python3
"""Write a BOM-free JSON copy of a source file (the editor writes UTF-8 with BOM,
which the connector's --args-file parser rejects)."""
import io
import json
import os
import sys

src = sys.argv[1]
dst = sys.argv[2]

with io.open(src, "r", encoding="utf-8-sig") as fh:
    data = json.load(fh)

with io.open(dst, "w", encoding="utf-8", newline="\n") as fh:
    json.dump(data, fh, ensure_ascii=False)

print(f"{dst}: {os.path.getsize(dst)} bytes, {len(data.get('requests', []))} requests")
