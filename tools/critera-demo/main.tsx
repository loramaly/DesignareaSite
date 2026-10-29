import { StrictMode, lazy, Suspense, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom'
import ToastProvider from '/Users/loramaly/Documents/critera/CriteraMarket/market/src/components/ToastProvider'
import WhatsAppFab from '/Users/loramaly/Documents/critera/CriteraMarket/market/src/components/shared/WhatsAppFab'
import ScrollTopButton from '/Users/loramaly/Documents/critera/CriteraMarket/market/src/components/shared/ScrollTopButton'
import './demo-index.css'
import HomeLivePage from '/Users/loramaly/Documents/critera/CriteraMarket/market/src/pages/live/HomeLivePage'
import BlogPage from '/Users/loramaly/Documents/critera/CriteraMarket/market/src/pages/blog/BlogPage'
import BlogArticlePage from '/Users/loramaly/Documents/critera/CriteraMarket/market/src/pages/blog/BlogArticlePage'
const AboutLivePage = lazy(() => import('/Users/loramaly/Documents/critera/CriteraMarket/market/src/pages/live/AboutLivePage'))
import HeroSection from '/Users/loramaly/Documents/critera/CriteraMarket/market/src/components/landing/HeroSection'
import LogoAnimated from '/Users/loramaly/Documents/critera/CriteraMarket/market/src/components/shared/LogoAnimated'
import '/Users/loramaly/Documents/critera/CriteraMarket/market/src/pages/home/v3/v3-live.css'
import { EmbedHow, EmbedPartners } from '/Users/loramaly/Documents/critera/CriteraMarket/market/src/pages/home/v3/HomeV3Live'
import OrbitArenas from '/Users/loramaly/Documents/critera/CriteraMarket/market/src/pages/home/v3/OrbitArenas'
import LenderStairs from '/Users/loramaly/Documents/critera/CriteraMarket/market/src/components/about/LenderStairs'
import { getArticle, RENAMED_SLUGS } from '/Users/loramaly/Documents/critera/CriteraMarket/market/src/content/blog'
import './embed.css'

// A refresh starts at the top: the browser must not put the old scroll back once the page has grown under it
// (on a phone it did, landing mid-page). The home page sets this too, but only after it mounts - too late for that.
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

// The site's own scroll handling lives inside App.tsx, which this demo leaves out:
// top of page on every route change, or the #section when the link names one.
// the home page doesn't set its own tab title (the site's SeoManager does, and it is left
// out because it would also rewrite canonical/robots) - so restore the one from index.html
const HOME_TITLE = document.title
function ScrollToSection() {
  const { pathname, hash } = useLocation()
  useEffect(() => { if (pathname === '/') document.title = HOME_TITLE }, [pathname])
  useEffect(() => {
    if (!hash) { window.scrollTo({ top: 0, behavior: 'instant' }); return }
    let tries = 0, timer = 0
    const seek = () => {
      const el = document.querySelector(hash)
      // the home page lands its sections by their eyebrow line and hands that helper over once mounted
      const eyebrow = (window as unknown as { __eyebrowAnchor?: (el: Element) => boolean }).__eyebrowAnchor
      if (el && el.closest('.v11') && !eyebrow && tries++ < 20) { timer = window.setTimeout(seek, 50); return }
      if (el && eyebrow && eyebrow(el)) return
      if (el) {
        const smooth = document.visibilityState === 'visible' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: smooth ? 'smooth' : 'instant' })
      } else if (tries++ < 40) timer = window.setTimeout(seek, 50)
    }
    seek()
    return () => window.clearTimeout(timer)
  }, [pathname, hash])
  return null
}

// Only these routes exist in the demo. A link anywhere else (sign-in, sign-up,
// terms, privacy...) simply does nothing when clicked, and no form sends anything.
const OPEN = /^#\/(about|blog(\/[^#?]*)?)?(#.*)?$/
document.addEventListener('click', (e) => {
  const a = (e.target as Element | null)?.closest?.('a')
  const href = a?.getAttribute('href')
  // a link to an article the demo doesn't carry (the English blog has four) does nothing either
  const slug = href?.match(/^#\/blog\/([^#?/]+)/)?.[1]
  const known = !slug || !!getArticle(slug) || !!RENAMED_SLUGS[slug]
  if (!href || !href.startsWith('#/') || (OPEN.test(href) && known)) return
  e.preventDefault()
  e.stopPropagation()
}, true)
document.addEventListener('submit', (e) => { e.preventDefault(); e.stopPropagation() }, true)

// The site's WhatsApp card and back-to-top button (App.tsx mounts both on every public page; the demo leaves App out):
// on the demo's pages, never inside the case's small embedded frames.
// On a phone the WhatsApp card starts folded, its icon only: the screen's foot was too busy (Larisa, 28.10.2026)
try { if (window.matchMedia('(max-width: 767px)').matches) localStorage.setItem('critera-wa-fab-folded', '1') } catch { /* private window */ }
function WhatsApp() {
  const { pathname } = useLocation()
  return pathname.startsWith('/embed') ? null : <><ScrollTopButton /><WhatsAppFab /></>
}

// Pieces of the real site for the portfolio case to show in small frames:
// #/embed/hero - the homepage hero alone (the case crops the deal animation out of it);
// #/embed/hero-copy - the same hero, its copy only: the dark sky filled edge to edge, the deal animation hidden;
// #/embed/stairs - the About page's closing scene: the credit request wiring into the five lenders' bars, replayed;
// #/embed/partners - the partners section (the case crops it to the brokers' scene: the hand, the five roles, the flowing dots);
// #/embed/arenas - the four arenas orbiting the logo, live (hover stops it, the cards show their buttons);
// #/embed/timeline - the six-step timeline, clickable, without its heading;
// #/embed/logo-white, #/embed/logo-purple - the animated logo, replayed every few seconds.
function Embed() {
  const { what = '' } = useParams()
  const [round, setRound] = useState(0)
  useEffect(() => {
    document.documentElement.classList.add('embed', 'embed-' + what)
    if (!what.startsWith('logo') && what !== 'stairs') return
    const id = window.setInterval(() => setRound((r) => r + 1), what === 'stairs' ? 7000 : 5200)
    return () => window.clearInterval(id)
  }, [what])
  if (what === 'hero' || what === 'hero-copy') return <div className="hm-root ab-root v3 v11"><HeroSection airy /></div>
  if (what === 'stairs') return <div className="embed-stairs"><LenderStairs key={round} id={'cs' + round} rtlNames tint="#8c7eee" /></div>
  if (what === 'partners') return <div className="hm-root ab-root v3 v11 embed-partners"><EmbedPartners /></div>
  if (what === 'arenas') return <div className="hm-root ab-root v3 v11 embed-arenas"><section id="arenas" className="relative"><div className="relative max-w-7xl mx-auto px-6"><OrbitArenas /></div></section></div>
  if (what === 'timeline') return <div className="hm-root ab-root v3 v11 embed-timeline"><EmbedHow /></div>
  if (what === 'logo-white' || what === 'logo-purple')
    return <div className="embed-logo"><LogoAnimated key={round} ink={what === 'logo-white' ? 'white' : 'purple'} className="embed-logo-svg" /></div>
  return null
}

// Portfolio demo: the public marketing pages only - home, about, blog.
// Anything else (sign-in, registration, the platform) falls back to home.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <ToastProvider>
        <ScrollToSection />
        <WhatsApp />
        <Routes>
          <Route path="/" element={<HomeLivePage />} />
          <Route path="/about" element={<Suspense fallback={null}><AboutLivePage /></Suspense>} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogArticlePage />} />
          <Route path="/embed/:what" element={<Embed />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ToastProvider>
    </HashRouter>
  </StrictMode>,
)
