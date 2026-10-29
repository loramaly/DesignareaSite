#!/bin/zsh
# Rebuilds case-critera/critera-demo/ from the real Critera site source.
# Only the public pages go in (home, about, blog) - see main.tsx. The source
# project is read, never changed: everything is staged in a temp folder.
set -e
M=~/Documents/critera/CriteraMarket/market
HERE=${0:A:h}
# DEMO_LANG=en builds the English copy into critera-demo-en/ (see i18n.ts); DEMO_LANG=extract refreshes en.json only
OUT=${HERE:h:h}/case-critera/critera-demo
if [[ "$DEMO_LANG" == en ]]; then OUT=${HERE:h:h}/case-critera/critera-demo-en; fi
W=$(mktemp -d)
cp "$HERE/main.tsx" "$HERE/vite.config.ts" "$HERE/i18n.ts" "$HERE/ParticleNetwork.tsx" "$HERE/embed.css" "$HERE/blog-en.ts" "$W/"
if [[ -f "$HERE/en.json" ]]; then cp "$HERE/en.json" "$W/"; fi
if [[ -f "$HERE/en-own.json" ]]; then cp "$HERE/en-own.json" "$W/"; fi
ln -s "$M/node_modules" "$W/node_modules"
python3 - "$M" "$W" "$DEMO_LANG" <<'PY'
import sys, re
M, W, LANG = sys.argv[1], sys.argv[2], sys.argv[3]
h = open(M + '/index.html', encoding='utf-8').read()
h = h.replace('href="/favicon.svg"', 'href="./favicon.svg"').replace('src="/src/main.tsx"', 'src="./main.tsx"')
h = h.replace('content="index, follow, max-image-preview:large"', 'content="noindex, nofollow"')
h = re.sub(r'\s*<link rel="canonical"[^>]*>', '', h)
# the site's analytics (js/analytics.js): counted only when the demo is opened as its own page, never as a piece of the case
h = re.sub(r'<head>\n?', '<head>\n<script src="../../js/analytics.js?v=1"></script>\n', h, 1)
if LANG == 'en':
    h = re.sub(r'<html[^>]*>', '<html lang="en" dir="ltr">', h, 1)
open(W + '/index.html', 'w', encoding='utf-8').write(h)
# Tailwind scans from the build folder by default - point it at the real source
c = open(M + '/src/index.css', encoding='utf-8').read()
# mid-merge the file carries conflict markers: take the site's own side from before the merge (git's stage 2), read-only
if '\n<<<<<<< ' in c:
    import subprocess
    c = subprocess.run(['git', '-C', M, 'show', ':2:src/index.css'], capture_output=True, text=True, check=True).stdout
    print('note: src/index.css is mid-merge, built from its pre-merge side')
c = c.replace('@import "tailwindcss";', '@import "tailwindcss";\n@source "%s/src";' % M, 1)
open(W + '/demo-index.css', 'w', encoding='utf-8').write(c)
PY
(cd "$W" && ./node_modules/.bin/vite build)
if [[ "$DEMO_LANG" == extract ]]; then cp "$W/en.json" "$HERE/en.json"; echo "en.json refreshed"; exit 0; fi
rsync -a --delete --exclude robots.txt --exclude sitemap.xml --exclude llms.txt --exclude favicon.old.svg "$W/dist/" "$OUT/"
# the engine animation, in both languages (28.10.2026): it starts at once, without the site's 2s of empty dashed lines,
# and its clock runs 30% faster - in the case it is watched, not waited for
python3 - "$OUT" <<'PY'
import sys, glob
for f in glob.glob(sys.argv[1] + '/engine/critera-engine-section*.html'):
    s = open(f, encoding='utf-8').read()
    n = s.count('offset=reduced?DUR-1:0;') + s.count('offset=reduced?END:0;')
    if n != 1 or s.count('(performance.now()-t0)') != 1: sys.exit('engine clock changed in ' + f + ' - update build.sh')
    s = s.replace('offset=reduced?DUR-1:0;', 'offset=reduced?DUR-1:HOLD-300;').replace('offset=reduced?END:0;', 'offset=reduced?END:HOLD-300;')
    s = s.replace('(performance.now()-t0)', '(performance.now()-t0)*1.3')
    open(f, 'w', encoding='utf-8').write(s)
PY
# English: the files the bundler copies untouched (the engine pages, index.html, a CSS label) get their Hebrew swapped too
if [[ "$DEMO_LANG" == en ]]; then
cp "$HERE/en.css" "$OUT/en.css"
python3 - "$OUT" "$HERE/en-static.json" <<'PY'
import sys, json, glob, re
out, dpath = sys.argv[1], sys.argv[2]
d = json.load(open(dpath, encoding='utf-8'))
keys = sorted(d, key=len, reverse=True)
left = []
for f in glob.glob(out + '/engine/*.html') + [out + '/index.html'] + glob.glob(out + '/assets/*.css'):
    s = open(f, encoding='utf-8').read()
    for k in keys:
        s = s.replace(k, d[k])
    s = s.replace('content:"עמוד "', 'content:"Page "')
    s = s.replace('<title>Critera — ', '<title>Critera - ')  # a short hyphen in English, never a long dash
    if '/engine/' in f:
        # the engine drawings are laid out right to left: in English the whole drawing is mirrored, and each label and
        # check mark turned back on its own spot, so it reads (and runs) left to right; the Financials chart too, so it still climbs
        s = s.replace('</head>', '<style>#critera-engine{direction:ltr}#critera-engine #svg{scale:-1 1}#svg text{transform-box:fill-box;transform-origin:center;scale:-1 1}#svg .chk{scale:-1 1}#svg .tick,#svg .done-lbl path{transform-box:fill-box;transform-origin:center;scale:-1 1}#svg text[font-size="17"]{font-size:15.5px}</style>\n</head>', 1)
        # the stage bars grow to the right from their own x; mirrored, that is right to left. Flip each bar about its track,
        # so in English it fills left to right (the track's x differs per drawing: 442 desktop and tablet, 52 phone)
        # the Financials chart is turned back too, inside its own 100px box (a CSS scale about its fill-box moved it off its
        # place - the box is measured before the group's own translate), so in English it still climbs to the right
        s = re.sub(r'(<g id="finChart" transform="[^"]*)"', r'\1 matrix(-1,0,0,1,100,0)"', s, count=1)
        tx = re.search(r'class="track" x="(\d+)" y="-2" width="60"', s)
        if tx:
            s = s.replace('</head>', '<style>#svg .stg .fill{transform:matrix(-1,0,0,1,%d,0)}</style>\n</head>' % (2 * int(tx.group(1)) + 60), 1)
    if f.endswith('/index.html'):
        s = s.replace('</head>', '<link rel="stylesheet" href="./en.css?v=59">\n</head>', 1)
    s = re.sub(r'<html lang="he"', '<html lang="en"', s)
    # the site's structured data stays out of the English copy (it is Hebrew, and the demo is not for search)
    s = re.sub(r'\s*<script type="application/ld\+json">[\s\S]*?</script>', '', s)
    open(f, 'w', encoding='utf-8').write(s)
    t = re.sub(r'<!--[\s\S]*?-->', '', s)
    if re.search(r'[\u0590-\u05FF]', t): left.append(f.split('/')[-1])
print('English static files done' + (', Hebrew left in: ' + ', '.join(left) if left else ''))
PY
fi
echo "demo updated: $OUT"
