# Lora Maly - Portfolio Site

A single-page portfolio for Lora (Larisa) Maly, Senior Product Designer, with a
scripted "Ask me anything" chat engine, an animated hero, a case-study section,
and a matching resume page.

The chat is **fully scripted** - every answer was written in advance. There is no
live AI or backend. It runs entirely in the browser.

---

## Folder structure

```
larisa-portfolio/
├── index.html              # main page (hero + chat + selected works)
├── resume.html             # resume page (same site chrome)
├── css/
│   ├── styles.css          # all styles for index.html
│   └── resume.css          # all styles for resume.html
├── js/
│   ├── chat.js             # the chat engine + all animations for index.html
│   └── resume.js           # hamburger / mobile menu for resume.html
├── assets/
│   ├── images/
│   │   ├── portrait.png         # hero portrait
│   │   ├── bg-texture.webp      # background texture
│   │   ├── avatar.webp          # small chat avatar (96x96)
│   │   ├── case-timeline.webp   # case 1 - AFT Timeline
│   │   ├── case-dashboard.webp  # case 2 - dashboard
│   │   └── case-gantt.webp      # case 3 - gantt
│   └── LarisaMaly_Resume_2026.pdf   # downloadable resume
└── docs/
    ├── HANDOFF.md               # full project summary - READ THIS FIRST
    ├── CHAT-ANSWERS-MASTER.txt  # single source of truth for every chat answer
    └── WRITING-CHAT-BRIEF.txt   # prompt for the separate writing/editing chat
```

## Run locally

It's static - no build step. Serve the folder with any static server, for example:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly also works, but a local server avoids browser
restrictions on some fonts/paths.

## Deploy

Push the folder to a GitHub repository and enable GitHub Pages (or drag the folder
into Netlify / Vercel). No configuration needed - it's plain HTML/CSS/JS.

## Editing the chat answers

**Never edit answer text directly in `js/chat.js` by hand as your source of truth.**
`docs/CHAT-ANSWERS-MASTER.txt` is the master. Each answer is numbered (`#01`-`#60`).
Change the master, then update the matching entry in the `KB` array in `js/chat.js`.
See `docs/HANDOFF.md` for how the engine is structured.

## Open items (see HANDOFF.md for the full list)

- `[CASE-2-URL]`, `[CASE-3-URL]`, `[CASE 2/3 TITLE]` placeholders in `index.html`
- `[PORTFOLIO-URL]` on the Portfolio button
- The Recommendations nav link has no target section yet
- `case-timeline.html` is not included yet (the dashboards answer links to it)
