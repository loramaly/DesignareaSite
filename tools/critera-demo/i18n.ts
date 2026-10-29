// The English demo. The real site is Hebrew only, so the English copy lives here, in en.json:
// every Hebrew string of the site's source (string literals, template literals, JSX text) mapped to its English.
//   DEMO_LANG=extract  - build as usual and write every Hebrew string the demo bundles into en.json
//                        (new ones get an empty translation; existing translations are kept)
//   DEMO_LANG=en       - build with the English: each Hebrew string swapped for its translation.
//                        A Hebrew string with no translation stops the build, so nothing ships half done.
// The source project is only read, never changed.
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import type { Plugin } from 'vite'
import { parse } from '/Users/loramaly/Documents/critera/CriteraMarket/market/node_modules/@babel/parser/lib/index.js'
import MagicString from '/Users/loramaly/Documents/critera/CriteraMarket/market/node_modules/magic-string/dist/magic-string.es.mjs'

const HE = /[֐-׿]/
const DICT = __dirname + '/en.json'
// English written for one file (the hero, the three doors - her own copy, 2026-10-28): per file, it wins over
// en.json there only, since some of the same Hebrew phrases read differently elsewhere on the site
const OWN_DICT = __dirname + '/en-own.json'

type Node = { type: string; start: number; end: number; [k: string]: any }

// every Hebrew-bearing piece of text in a module, with what to put back in its place
function pieces(code: string) {
  const ast = parse(code, { sourceType: 'module', plugins: ['typescript', 'jsx'], errorRecovery: true })
  const out: { start: number; end: number; key: string; wrap: (en: string) => string }[] = []
  const walk = (n: any, parent?: any) => {
    if (!n || typeof n.type !== 'string') return
    if (n.type === 'StringLiteral' && HE.test(n.value)) {
      const inJsxAttr = parent && parent.type === 'JSXAttribute'
      out.push({ start: n.start, end: n.end, key: n.value, wrap: (en) => (inJsxAttr ? '{' + JSON.stringify(en) + '}' : JSON.stringify(en)) })
      return
    }
    if (n.type === 'TemplateLiteral' && n.quasis.some((q: any) => HE.test(q.value.cooked ?? ''))) {
      // the whole template is one sentence: its expressions stand in as {0}, {1}...
      const key = n.quasis.map((q: any, i: number) => (q.value.cooked ?? '') + (i < n.expressions.length ? '{' + i + '}' : '')).join('')
      const exprs = n.expressions.map((e: any) => code.slice(e.start, e.end))
      out.push({
        start: n.start, end: n.end, key,
        wrap: (en) => '`' + en.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${').replace(/\{(\d+)\}/g, (_, i) => '${' + exprs[+i] + '}') + '`',
      })
      return
    }
    if (n.type === 'JSXText' && HE.test(n.value)) {
      const m = n.value.match(/^(\s*)([\s\S]*?)(\s*)$/)
      const key = m[2].replace(/\s+/g, ' ')
      out.push({ start: n.start, end: n.end, key, wrap: (en) => m[1] + en.replace(/[{}<>]/g, (c) => `{'${c}'}`) + m[3] })
      return
    }
    for (const k of Object.keys(n)) {
      if (k === 'loc' || k === 'start' || k === 'end' || k === 'extra' || k === 'leadingComments' || k === 'trailingComments' || k === 'innerComments') continue
      const v = n[k]
      if (Array.isArray(v)) v.forEach((c) => walk(c, n))
      else if (v && typeof v === 'object') walk(v, n)
    }
  }
  walk(ast.program)
  return out
}

export function i18n(root: string): Plugin | null {
  const mode = process.env.DEMO_LANG
  if (mode !== 'extract' && mode !== 'en') return null
  const dict: Record<string, string> = existsSync(DICT) ? JSON.parse(readFileSync(DICT, 'utf-8')) : {}
  const ownDict: Record<string, Record<string, string>> = existsSync(OWN_DICT) ? JSON.parse(readFileSync(OWN_DICT, 'utf-8')) : {}
  const seen = new Set<string>()
  return {
    name: 'critera-demo-i18n',
    enforce: 'pre',
    transform(code, id) {
      if (!id.startsWith(root + '/src/') || !/\.(tsx?|jsx?)$/.test(id) || (!HE.test(code) && !(mode === 'en' && id.endsWith('/pages/home/v3/OrbitArenas.tsx')))) return
      // a few lines are split into one word per line on the site: in English they get whole phrases of their own
      if (mode === 'en' && id.endsWith('/components/about/LenderStairs.tsx')) {
        const he = "const LENDERS: string[][] = [['בנק'], ['קרן', 'אשראי'], ['גוף', 'מוסדי'], ['חוץ-', 'בנקאי'], ['משקיעים', 'כשירים']];"
        if (!code.includes(he)) this.error('LenderStairs: the lenders line changed - update i18n.ts')
        code = code.replace(he, "const LENDERS: string[][] = [['Bank'], ['Credit', 'fund'], ['Pension', 'funds'], ['Non-bank'], ['Qualified', 'investors']];")
        // the English names are wider than the Hebrew: wider bars, 8 apart, from the scene's left edge, and the names
        // lifted off the rounded foot, so each sits inside its bar with air on every side (Larisa, 28.10.2026)
        const geo: [string, string][] = [
          ['const BAR_W = 8.4 * S;', 'const BAR_W = 84;'],
          ['const X0 = 44;', 'const X0 = 4;'],
          ['const pitch = PITCH + spread;', 'const pitch = BAR_W + 8 + 0 * (PITCH + spread);'],
          ['const base = b.bottom - 22 - (lines.length - 1) * 17;', 'const base = b.bottom - 42 - (lines.length - 1) * 18;'],
          ["dy={k === 0 ? 0 : 17}", "dy={k === 0 ? 0 : 18}"],
        ]
        for (const [a, b] of geo) {
          if (!code.includes(a)) this.error(`LenderStairs: "${a}" changed - update i18n.ts`)
          code = code.replace(a, b)
        }
      }
      // the wider English bars put the request's centre at 230 of the scene's 460 units, so the road meets it there
      if (mode === 'en' && id.endsWith('/pages/about/v2/AboutV2Idea14.tsx')) {
        const he = 'const REQ_X = 250 / 460;'
        if (!code.includes(he)) this.error('AboutV2Idea14: REQ_X changed - update i18n.ts')
        code = code.replace(he, 'const REQ_X = 230 / 460;')
        // the hero's fan is mirrored in English (en.css), and the road is drawn mirrored too: its lanes start from where
        // the dots really stand, so each dot is taken at its mirror place inside the road's own frame
        const from = 'const from = ROAD_DOTS.map((i) => at(dots[i])); // top to bottom'
        if (!code.includes(from)) this.error('AboutV2Idea14: the road\'s start dots changed - update i18n.ts')
        code = code.replace(from, 'const from = ROAD_DOTS.map((i) => { const p = at(dots[i]); return { ...p, x: box.offsetWidth - p.x }; });')
      }
      // English reads "Finally, a Marketplace / for Business Financing and Investment.": the underlined word moves up
      // to the first line, and the rest of the sentence follows it
      if (mode === 'en' && id.endsWith('/components/landing/HeroSection.tsx')) {
        // phones: the English deal card is not always the height it was when the wires were laid, so a wire could end
        // in the air under it. Lay them again whenever the card changes size or ends a move
        const boot = '    fit();\n    initWires();\n'
        if (!code.includes(boot)) this.error('HeroSection: the boot changed - update i18n.ts')
        code = code.replace(boot, boot + "    const relay = () => { if (alive && phone && beams.some((b) => b.active)) layoutWires(); };\n    const dealRo = new ResizeObserver(relay); dealRo.observe(deal);\n    dealwrap.addEventListener('transitionend', relay);\n")
        const bye = '    return () => {\n      alive = false;\n'
        if (!code.includes(bye)) this.error('HeroSection: the cleanup changed - update i18n.ts')
        code = code.replace(bye, bye + '      dealRo.disconnect();\n')
        const he = /(\{HERO_HEADLINE\.first\}\{' '\}\s*)<br className="hero-br" \/>\s*\{HERO_HEADLINE\.second\}\{' '\}\s*(<span className="accent">[\s\S]*?<\/span>)/
        if (!he.test(code)) this.error('HeroSection: the headline markup changed - update i18n.ts')
        // and the rest in two lines of its own (" / " marks the break in en-own.json): three lines in all
        code = code.replace(he, "$1$2{' '}<br className=\"hero-br\" />{HERO_HEADLINE.second.split(' / ').flatMap((l, k) => (k ? [<br key={k} className=\"hero-br\" />, ' ' + l] : [l]))}")
        // the offer cards in the scene keep only their terms in English, without the amount, so they stay narrow
        const amount = /\u200f(?:עד )?<bdi dir="ltr">\d+ M<\/bdi> ₪ · /g
        if ((code.match(amount) || []).length !== 4) this.error('HeroSection: the offer terms changed - update i18n.ts')
        code = code.replace(amount, '')
      }
      // the first door's English has no asterisk: its condition note comes off (the other two keep theirs)
      if (mode === 'en' && id.endsWith('/pages/home/v3/content.ts')) {
        const he = /(q: \['מגייסים מימון או השקעה'[^\n]*?עם סגירת העסקה)\*', note: '\*בכפוף להסכם שירות\.',/
        if (!he.test(code)) this.error('content.ts: the first door changed - update i18n.ts')
        code = code.replace(he, "$1',")
        // "Independent by Design" is one short line: the fairness title loses its two-line split (it reads bold, as a last line does)
        const fair = /(export const FAIR_V3 = \{\n  title: '([^']+)',\n  titleLines: )\[[^\]]*\]/
        if (!fair.test(code)) this.error('content.ts: the fairness title changed - update i18n.ts')
        code = code.replace(fair, "$1['$2']")
        // the arenas carry her English labels (the Hebrew site dropped its chips on 16.10.2026; the cards still draw them)
        for (const [arena, tag] of [['portfolio', "{ label: 'Exclusive', accent: true }"], ['syndication', "{ label: 'Exclusive', accent: true }"], ['capital', "{ label: 'New', cta: true }"]]) {
          const at = `href: '/register?arena=${arena}-arena' }`
          if (!code.includes(at)) this.error(`content.ts: the ${arena} arena changed - update i18n.ts`)
          code = code.replace(at, `href: '/register?arena=${arena}-arena', tags: [${tag}] }`)
        }
      }
      // her rule for every English text: a short hyphen, never a long dash - the numbers' "2-6 weeks" too
      // (the counter's prefix '2–' stays as it is: it is only read for its digits)
      if (mode === 'en' && id.endsWith('/pages/home/v3/HomeV3Live.tsx')) {
        if (!code.includes('<span className="range">–</span>')) this.error('HomeV3Live: the range dash changed - update i18n.ts')
        code = code.replace('<span className="range">–</span>', '<span className="range">-</span>')
        // the contact section: her line under the title, and the panel left to right
        const contact = '<SectionHead kicker="יצירת קשר" title="נשמח לדבר" />'
        const contactDir = "<div style={{ direction: 'rtl' }}>\n          <ContactPanel bare light />"
        if (!code.includes(contact) || !code.includes(contactDir)) this.error('HomeV3Live: the contact section changed - update i18n.ts')
        code = code.replace(contact, contact.replace(' />', ` sub={${JSON.stringify("Have a question about financing, investment, or working with Critera? Get in touch. We'll be happy to help.")}} />`))
        code = code.replace(contactDir, contactDir.replace("'rtl'", "'ltr'"))
        // the numbers' plus goes before the figure in English: "+30%", "+20"
        const numSfx = "{n}<span className=\"sfx\">{s.suffix.split('+').flatMap((part, k) => (k ? [<span key={k} className=\"plus\">+</span>, part] : [part]))}</span>"
        if (!code.includes(numSfx)) this.error('HomeV3Live: the numbers figure changed - update i18n.ts')
        code = code.replace(numSfx, "{s.suffix.includes('+') && <span className=\"plus\">+</span>}{n}<span className=\"sfx\">{s.suffix.replace('+', '')}</span>")
        const numText = '<p ref={text}>{s.text}</p>'
        if (!code.includes(numText)) this.error('HomeV3Live: the numbers row changed - update i18n.ts')
        code = code.replace(numText, '<div className="v11-num-txt">{\'label\' in s && <h3 className="v11-num-lbl">{s.label as string}</h3>}<p ref={text}>{s.text}</p></div>')
        // the engine section: her paragraph under the title, and the steps numbered 01-04
        const head = '<SectionHead kicker="הטכנולוגיה שלנו" title={e.title} lines={e.titleLines} />'
        const num = '<span className="n" aria-hidden="true">{i + 1}</span>'
        if (!code.includes(head) || !code.includes(num)) this.error('HomeV3Live: the engine section changed - update i18n.ts')
        code = code.replace(head, head.replace(' />', ` sub={${JSON.stringify("Critera's AI turns complex financial data into a structured credit package or investor presentation, helping you spend less time preparing documents and more time moving deals forward.")}} />`))
        code = code.replace(num, '<span className="n" aria-hidden="true">{String(i + 1).padStart(2, \'0\')}</span>')
      }
      if (mode === 'en' && id.endsWith('/pages/home/v3/content.ts')) {
        code = code.replace("value: '2–6'", "value: '2-6'")
        // How It Works: her second sentence is long, so it gets two lines of its own (three lines in all, the first bold)
        const how = /(export const HOW_V3 = \{\n  title: '[^']+',\n  titleLines: )\[[^\]]*\]/
        if (!how.test(code)) this.error('content.ts: the How It Works title changed - update i18n.ts')
        code = code.replace(how, "$1['From Request to Funding. Step by Step.', 'From registration to closing your deal,', 'everything happens in one place.']")
        // the partner program: her copy is paragraphs, not the site's bullet points, so each door's points are swapped whole
        const doorPoints = [
          ["question: 'ברוקרים", ["Get a professional credit package or investor presentation within 24 hours, connect with relevant lenders and investors, and manage your clients in one place. Your clients remain associated with you, with client protection and non-compete terms set out in your agreement.", 'No platform fees for partners, subject to a service agreement.']],
          ["question: 'עורכי דין", ['Lawyers, accountants, appraisers, and other professionals can refer clients to Critera and apply to join our directory of recommended service providers.']],
        ] as const
        for (const [q, en] of doorPoints) {
          const at = code.indexOf(q)
          const from = code.indexOf('points: [', at), to = code.indexOf('],', from)
          if (at < 0 || from < 0 || to < 0 || from - at > 200) this.error('content.ts: the partner doors changed - update i18n.ts')
          code = code.slice(0, from) + 'points: ' + JSON.stringify(en) + code.slice(to + 1)
        }
        // the numbers: each figure gets her short title, shown over its sentence (NumRow below)
        for (const [t, label] of [[6, 'Estimated Time to Close'], [30, 'Potential Cost Savings for Lenders'], [10, 'Potential Savings on Financing'], [20, 'Lending Institutions']] as const) {
          const at = new RegExp(`(\\{ value: '[^']*', unit: '[^']*', target: ${t},)`)
          if (!at.test(code)) this.error(`content.ts: the ${t} figure changed - update i18n.ts`)
          code = code.replace(at, `$1 label: ${JSON.stringify(label)},`)
        }
      }
      // the orbit: the fourth arena's column made wide enough for "Equity, Partnerships & M&A" on one line
      if (mode === 'en' && id.endsWith('/pages/home/v3/OrbitArenas.tsx')) {
        const he = 'const WIDTHS = [300, 280, 290, 260];'
        if (!code.includes(he)) this.error('OrbitArenas: the column widths changed - update i18n.ts')
        code = code.replace(he, 'const WIDTHS = [350, 280, 290, 340];')
        // and the whole orbit sits left of centre: in English each card's words hang to the right of its bar (the site's +54 was for words hanging left)
        if (!code.includes('const cx = w / 2 + shift')) this.error('OrbitArenas: the orbit centre changed - update i18n.ts')
        code = code.replace('const cx = w / 2 + shift', 'const cx = w / 2 - Math.round(154 * (rx / RX_MAX))')
        // the white slab behind is mirrored in English (left end up), so the orbit and the tablet frame tilt the same way
        const tilt = 'const TILT_DEG = -7,'
        const frame = "path.setAttribute('transform', `translate(${L} ${T - (R - cx) * tan})`);\n      cards.forEach((card, i) => { card.style.top = `${-(c[i].x - cx) * tan}px`; });"
        if (!code.includes(tilt) || !code.includes(frame)) this.error('OrbitArenas: the tilt changed - update i18n.ts')
        code = code.replace(tilt, 'const TILT_DEG = 7,')
        code = code.replace(frame, "path.setAttribute('transform', `translate(${L + W} ${T - (cx - L) * tan}) scale(-1 1)`);\n      cards.forEach((card, i) => { card.style.top = `${(c[i].x - cx) * tan}px`; });")
      }
      // the contact panel (the homepage's and the modal's): left to right, and a "Direct Contacts" line over the people,
      // the twin of the form's own "Contact Form" line, on the page only
      if (mode === 'en' && id.endsWith('/components/landing/ContactModal.tsx')) {
        const dir = "style={{ direction: 'rtl' }}"
        const people = '{PEOPLE.map((p) => ('
        if (!code.includes(dir) || code.indexOf(people) < 0) this.error('ContactModal: the panel changed - update i18n.ts')
        code = code.replace(dir, "style={{ direction: 'ltr' }}")
        const at = code.lastIndexOf('<div', code.indexOf(people))
        code = code.slice(0, at) + '{bare && onLight && <p className="font-heebo text-lg leading-relaxed text-surface-dark/80">Direct Contacts</p>}\n        ' + code.slice(at)
      }
      // the FAQ title: its column is 340px, so the English goes in three short lines of its own, not two long ones that break into four
      if (mode === 'en' && id.endsWith('/components/landing/FaqSection.tsx')) {
        const he = /כל מה שרצית\s*<br \/>\s*לדעת עלינו\./
        if (!he.test(code)) this.error('FaqSection: the title changed - update i18n.ts')
        code = code.replace(he, 'Everything you<br />wanted to know<br />about us.')
      }
      // the sticky bar at the bottom: her line ends on the bold sentence, no "now is the time to join" after it
      if (mode === 'en' && id.endsWith('/components/landing/FloatingCTA.tsx')) {
        if (!code.includes(": 'זה הרגע להצטרף!'}")) this.error('FloatingCTA: the bar changed - update i18n.ts')
        code = code.replace(": 'זה הרגע להצטרף!'}", ": ''}")
      }
      // no country in the English demo: the scene's shekel signs (plain symbols, not Hebrew, so en.json never sees them) become dollars
      if (mode === 'en' && (id.endsWith('/components/landing/HeroSection.tsx') || id.endsWith('/pages/home/v3/HomeV3Live.tsx'))) code = code.replace(/₪/g, '$').replace("'ממיליון $'", "'ממיליון ₪'") // that chip has its own English (en-own.json)
      const own = (mode === 'en' && ownDict[id.slice(root.length + 5)]) || {}
      const list = pieces(code)
      if (mode === 'extract') { list.forEach((p) => seen.add(p.key)); return }
      const s = new MagicString(code)
      const missing: string[] = []
      for (const p of list) {
        const en = own[p.key] ?? dict[p.key]
        if (!en) { missing.push(p.key); continue }
        s.overwrite(p.start, p.end, p.wrap(en))
      }
      if (missing.length) this.error(`en.json has no English for ${missing.length} string(s) in ${id.slice(root.length)}, e.g. ${JSON.stringify(missing[0]).slice(0, 120)}`)
      return { code: s.toString(), map: s.generateMap({ hires: true }) }
    },
    buildEnd() {
      if (mode !== 'extract') return
      const next: Record<string, string> = {}
      for (const k of [...seen].sort()) next[k] = dict[k] ?? ''
      writeFileSync(DICT, JSON.stringify(next, null, 1) + '\n')
      console.log(`en.json: ${seen.size} strings, ${Object.values(next).filter((v) => !v).length} without English`)
    },
  }
}
