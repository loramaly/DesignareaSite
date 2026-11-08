# Hebrew engine, right to left (her call, 2026-10-30): the stage bars fill from the right and the Financials chart climbs to the
# left. The site's engine draws both left to right; the Hebrew demo turns just these two round, everything else stays as on the site.
import sys, glob, re
for f in glob.glob(sys.argv[1] + '/engine/critera-engine-section*.html'):
    s = open(f, encoding='utf-8').read()
    if 'rtl-engine' in s: continue
    tx = re.search(r'class="track" x="(\d+)" y="-2" width="60"', s)
    if not tx or s.count('<g id="finChart" transform="') != 1: sys.exit('engine markup changed in ' + f + ' - update rtl-engine.py')
    s = re.sub(r'(<g id="finChart" transform="[^"]*)"', r'\1 matrix(-1,0,0,1,100,0)"', s, count=1)
    s = s.replace('</head>', '<style id="rtl-engine">#svg .stg .fill{transform:matrix(-1,0,0,1,%d,0)}</style>\n</head>' % (2 * int(tx.group(1)) + 60), 1)
    open(f, 'w', encoding='utf-8').write(s)
print('Hebrew engine: bars and chart right to left')
