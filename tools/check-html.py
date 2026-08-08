#!/usr/bin/env python3
"""Guard for the site's pages and stylesheets.

Two things it protects against:

1. Styling written into the markup. An inline style can't be inherited by the
   next page, so every one of them is a value that has to be re-tuned by hand.

2. Dead links. Every page, image, script and stylesheet reference is resolved
   from the file that points at it - so moving a case into its own folder can
   never silently break it.

Run:  python3 tools/check-html.py
Exits 1 and lists every offender.
"""
import re
import sys
from pathlib import Path
from urllib.parse import unquote, urldefrag

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {".git", "node_modules", "docs", "tools"}

TAG = re.compile(r"<[a-zA-Z][^>]*>", re.S)
REF = re.compile(r"""\b(?:href|src|poster)\s*=\s*["']([^"']+)["']""")
SRCSET = re.compile(r"""\bsrcset\s*=\s*["']([^"']+)["']""")
CSS_URL = re.compile(r"""url\(\s*["']?([^"')]+)["']?\s*\)""")
ID_ATTR = re.compile(r"""\bid\s*=\s*["']([^"']+)["']""")

EXTERNAL = ("http://", "https://", "//", "data:", "mailto:", "tel:", "javascript:")

TAG_CHECKS = (
    ("inline style attribute", lambda t: 'style="' in t or "style='" in t),
    ("duplicate class attribute", lambda t: len(re.findall(r"\bclass\s*=", t)) > 1),
    ("duplicate id attribute", lambda t: len(re.findall(r"\bid\s*=", t)) > 1),
)

# Interactive prototypes build their markup in JS and position elements from
# live values (style="left:${x}px"), which can't live in a stylesheet. They are
# still link-checked - only the markup-hygiene rules are skipped.
def _is_prototype(rel):
    """Interactive prototypes build markup in JS and position from live values."""
    return "demo" in rel.rsplit("/", 1)[-1].lower()

# Templates are meant to be copied, not served: their paths are relative to a
# case folder and their hrefs are [PLACEHOLDER]s. Markup hygiene is still checked.
LINK_CHECK_EXEMPT = {
    "_case-template.html",
}


def line_of(text, index):
    return text.count("\n", 0, index) + 1


def files(suffix):
    for path in sorted(ROOT.rglob(f"*{suffix}")):
        # "_"-prefixed folders are scratch//staging (e.g. _to_delete) - not shipped
        if any(part in SKIP_DIRS or part.startswith((".", "_"))
               for part in path.relative_to(ROOT).parts[:-1]):
            continue
        yield path


def refs_in(text):
    """Yield (raw_reference, char_offset) for everything the file points at."""
    for m in REF.finditer(text):
        yield m.group(1), m.start()
    for m in SRCSET.finditer(text):
        for candidate in m.group(1).split(","):
            candidate = candidate.strip().split()[0] if candidate.strip() else ""
            if candidate:
                yield candidate, m.start()


def check_refs(path, text, ids, fail):
    """Resolve every local reference relative to the file that contains it."""
    rel = path.relative_to(ROOT)
    for raw, offset in refs_in(text):
        raw = raw.strip()
        if not raw or raw.startswith(EXTERNAL):
            continue

        target, fragment = urldefrag(raw)

        # same-page anchor
        if not target:
            if fragment and fragment not in ids:
                fail(rel, line_of(text, offset), "anchor has no matching id", raw)
            continue

        resolved = (path.parent / unquote(target)).resolve()
        if not resolved.exists():
            fail(rel, line_of(text, offset), "reference does not exist", raw)


def main():
    failures = []

    def fail(name, line, label, snippet):
        failures.append((str(name), line, label, snippet))

    pages = list(files(".html"))
    sheets = list(files(".css"))
    if not pages:
        print("no .html files found - is the path right?")
        return 1

    for path in pages:
        text = path.read_text(encoding="utf-8")
        rel = path.relative_to(ROOT)
        ids = set(ID_ATTR.findall(text))

        if not _is_prototype(rel.as_posix()):
            for match in TAG.finditer(text):
                tag = match.group(0)
                for label, hit in TAG_CHECKS:
                    if hit(tag):
                        fail(rel, line_of(text, match.start()), label, " ".join(tag.split())[:110])

        if rel.as_posix() not in LINK_CHECK_EXEMPT:
            check_refs(path, text, ids, fail)

    for path in sheets:
        text = path.read_text(encoding="utf-8")
        rel = path.relative_to(ROOT)
        for m in CSS_URL.finditer(text):
            raw = m.group(1).strip()
            if raw.startswith(EXTERNAL):
                continue
            target = urldefrag(raw)[0]
            if target and not (path.parent / unquote(target)).resolve().exists():
                fail(rel, line_of(text, m.start()), "reference does not exist", raw)

    if failures:
        print(f"FAIL - {len(failures)} problem(s):\n")
        for name, line, label, snippet in failures:
            print(f"  {name}:{line}  {label}")
            print(f"      {snippet}\n")
        return 1

    print(f"OK - {len(pages)} page(s) + {len(sheets)} stylesheet(s) clean")
    for p in pages:
        print(f"     {p.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
