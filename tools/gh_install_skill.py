#!/usr/bin/env python3
"""
Recursively install a Claude-Code-style skill from a GitHub repo folder into
the local MCode skills directory.

Usage:
  python gh_install_skill.py <repo> <path-in-repo> <target-dir-name> [--ref main]

Example:
  python gh_install_skill.py nextlevelbuilder/ui-ux-pro-max-skill \
      .claude/skills/ui-ux-pro-max ui-ux-pro-max
"""
import io
import json
import os
import sys
import urllib.error
import urllib.request

UA = {"User-Agent": "talib-skill-installer", "Accept": "application/vnd.github+json"}


def api(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as resp:
        return json.loads(resp.read().decode("utf-8"))


def raw(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA["User-Agent"]})
    with urllib.request.urlopen(req, timeout=120) as resp:
        return resp.read()


def walk(repo, path, ref, dest, stats):
    url = f"https://api.github.com/repos/{repo}/contents/{path}?ref={ref}"
    items = api(url)
    if isinstance(items, dict):
        items = [items]
    for it in items:
        if it["type"] == "dir":
            if it["name"] in {".git", "node_modules", "__pycache__"}:
                continue
            walk(repo, it["path"], ref, dest, stats)
            continue
        target = os.path.join(dest, it["path"].split("/")[-1])
        # preserve relative structure under the skill folder
        rel = it["path"].split("/")
        # drop the leading path segments that belong to the requested folder
        base_parts = path.strip("/").split("/")
        keep = rel[len(base_parts):]
        target = os.path.join(dest, *keep) if keep else os.path.join(dest, it["name"])
        os.makedirs(os.path.dirname(target), exist_ok=True)
        data = raw(it["download_url"]) if it.get("download_url") else api(it["url"])["content"]
        if not it.get("download_url"):
            import base64
            data = base64.b64decode(data)
        with io.open(target, "wb") as fh:
            fh.write(data)
        stats["files"] += 1
        stats["bytes"] += len(data)
        print(f"  + {os.path.relpath(target, dest)}  ({len(data)/1024:.1f} KB)")


def main():
    if len(sys.argv) < 4:
        print(__doc__)
        return 1
    repo, path, name = sys.argv[1], sys.argv[2], sys.argv[3]
    ref = "main"
    if "--ref" in sys.argv:
        ref = sys.argv[sys.argv.index("--ref") + 1]

    skills_root = os.path.join(os.path.expanduser("~"), ".minimax", "skills")
    dest = os.path.join(skills_root, name)
    os.makedirs(dest, exist_ok=True)

    print(f"installing {repo}/{path} -> {dest}")
    stats = {"files": 0, "bytes": 0}
    walk(repo, path, ref, dest, stats)
    print(f"\ndone: {stats['files']} files, {stats['bytes']/1024/1024:.2f} MB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
