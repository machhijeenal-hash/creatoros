#!/usr/bin/env python3
"""
build_page.py -- inline zeta.js and data.json into a single self-contained page.

    python3 build_page.py      ->  riemann.html

Kept as a build step so the page's inputs stay readable (and testable) instead
of living inside a 200 kB HTML blob.
"""
from pathlib import Path
import json
import re

HERE = Path(__file__).resolve().parent

template = (HERE / "page.template.html").read_text()
zeta = (HERE / "zeta.js").read_text()

# drop the node-only export stub
zeta = re.sub(
    r'\nif \(typeof module !== "undefined" && module\.exports\) \{.*?\n\}\n',
    "\n",
    zeta,
    flags=re.S,
)

data = json.loads((HERE / "data.json").read_text())
# the full explicit curve is only needed for the plot's shape; keep it
payload = json.dumps(data, separators=(",", ":"))

out = template.replace("__DATA__", payload).replace("__ZETA_JS__", zeta)
assert "__DATA__" not in out and "__ZETA_JS__" not in out

target = HERE / "riemann.html"
target.write_text(out)
print(f"wrote {target} ({target.stat().st_size / 1024:.0f} kB)")
