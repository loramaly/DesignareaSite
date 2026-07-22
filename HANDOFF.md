# HANDOFF - Lora Maly Portfolio

Everything you (or Claude Code) need to keep working on this project safely.
Read this once before making changes.

---

## 1. What this site is

A one-page portfolio (`index.html`) plus a resume page (`resume.html`), sharing one
visual language: deep purple, `Nunito` body font, `Luxurious Script` for the "Hello",
2px framed panels with 6px rounded corners.

The centerpiece is a **scripted chat** ("Ask me anything"). Visitors type or tap a
question; a pre-written answer is typed back in Lora's voice, beside a small avatar.
No backend, no live AI, no data leaves the browser.

## 2. File map and what lives where

- `index.html` - structure only: hero, chat shell, selected-works cards, nav, footer.
- `css/styles.css` - every style for the main page (hero responsiveness, chat,
  cards, animations, controls). The background texture is referenced here as
  `url('../assets/images/bg-texture.webp')`.
- `js/chat.js` - the whole engine (see section 4). The avatar path is set at the top:
  `const AVATAR='assets/images/avatar.webp'`.
- `resume.html` + `css/resume.css` + `js/resume.js` - the resume page and its mobile menu.
- `assets/images/` - all six images, meaningfully named.
- `assets/LarisaMaly_Resume_2026.pdf` - linked by the resume page's Download button.
- `docs/CHAT-ANSWERS-MASTER.txt` - the source of truth for every chat answer, numbered.

## 3. Locked content rules (do not break these)

These were agreed carefully. Every word must be defensible in a real interview.

- **The 50% metric is always written** `an estimated ~50% faster task assignment`.
  Never drop "estimated", never drop the "~", never change the number. It is one
  metric, used consistently.
- **Short hyphens only** (`-`). No em-dashes or en-dashes anywhere - in text, code,
  comments, or docs.
- **Chat language is English only** right now. Hebrew/Russian/other input is detected
  and answered with a redirect (see engine below), but the answer bank is English.
- **Persona: there is no "chat", there is Lora.** Every answer is first person.
  The only answer that may mention the mechanism is "are you a bot?", and even that
  says "Every answer here was written by me in advance."
- **Agentic / dispatch AI work is presented as designed/conceptual work**, not as a
  shipped production claim. Keep that framing.
- **Never invent** a fact, quote, number, employer, or date. If something is missing
  it stays a placeholder.
- **Name:** "Larisa" is the official name, "Lora" is the familiar one. Both are
  intentional; the site uses "Lora", the resume uses "Larisa Maly".

## 4. How the chat engine works (`js/chat.js`)

The knowledge base is one array, `const KB = [...]`, ~60 entries. Each entry:

```js
{
  chip: 'What is your methodology?' | null,   // null = typed-only, no visible button
  keys: ['methodology','process','ux',...],   // trigger words (whole-word match)
  text: 'the answer...',                       // supports **bold** and \n line breaks
  more: 'optional deeper layer...',            // if present, a "Tell me more" button appears
  tags: ['a small pill under the answer'],     // optional
  link: {href:'...', label:'...'}              // optional arrow-link under the answer
}
```

**Answer resolution order** (in `ask()`):
1. `hasProfanity()` -> one calm, non-escalating reply (`RUDE`).
2. Language detection: Hebrew -> real answer with a Hebrew intro if a topic matches,
   else Hebrew redirect. Cyrillic -> Russian redirect. Other non-Latin scripts
   (Arabic, CJK, Korean, Thai, Devanagari) -> polite English redirect.
3. `match()` -> whole-word keyword scoring across `keys`; highest score wins.
4. If no match: `isGibberish()` -> "didn't catch that", else a random `FALLBACK`.

**Rendering:** answers type out live with `**bold**` and line breaks already formatted
(via `fmt()`), a blinking caret during typing. Long answers split into two bubbles at
the first sentence, unless the text contains `\n` (structured answers stay whole). The
view scrolls so each new bubble's **top** is aligned, so you read from the start.

**Humanity layer:** avatar beside the first bubble; think-delay scales with length;
emoji is deliberate and minimal - `:)` in a few feel-good replies, one purple heart in
the compliment reply, one checkmark in the `sudo` easter egg. Professional and skeptic
answers stay clean.

**Extras:** the "Surprise me" firework button draws from `SURPRISES` (15 facts, no
repeats). Chat controls: a square +/- collapses the question chips; a refresh icon
(shown only once a conversation exists) clears the thread; a drag handle under the
thread resizes it, with the clipped edges fading so the handle explains itself.

**To add or edit an answer:** edit `docs/CHAT-ANSWERS-MASTER.txt` first, then mirror
the change into the matching `KB` entry. Keep `keys` distinctive to avoid collisions.
After editing, sanity-check by loading the page and firing a few questions.

## 5. Known open items (nothing here is a bug - all intentional placeholders)

- `index.html`: `[CASE-2-URL]`, `[CASE-3-URL]`, `[CASE 2 TITLE]`, `[CASE 3 TITLE]`,
  `[CASE 2/3 ONE-LINER]`, `[CASE 2/3 METRIC]` - fill when cases 2 and 3 are ready.
- `[PORTFOLIO-URL]` on the Portfolio button in the works panel.
- Nav "Recommendations" links to `#recommendations`, which does not exist yet - a
  recommendations section is planned (Lora is collecting real quotes with names).
- `case-timeline.html` is referenced by the dashboards answer's link but is not in
  this folder yet.
- Resume answer bank references two named referees (Erez Mizrachi, Ronen Chen) that
  are in the master doc but not yet surfaced in the chat - pending more references.

## 6. Things to preserve when refactoring

- Don't inline the images back into HTML/CSS - keeping them as files is the point.
- Don't introduce `localStorage`/`sessionStorage` - the site intentionally keeps no
  state between visits.
- Keep the `prefers-reduced-motion` handling - all animations are disabled for users
  who ask for reduced motion.
- Keep everything static - no framework or build step is required to ship this.
