import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { i18n } from './i18n'

const M = '/Users/loramaly/Documents/critera/CriteraMarket/market'

// Larisa is not listed on the portfolio copy of the site: her card, name and
// photo come out of the team lists here, at build time, so the real source stays
// as it is. The build stops if the name is still anywhere in the site's code.
const NAME = 'לריסה מאלי'
function withoutLarisa(): Plugin {
  return {
    name: 'critera-demo-without-larisa',
    enforce: 'pre',
    transform(code, id) {
      if (!id.startsWith(M + '/src/') || !code.includes(NAME)) return
      let out = code
        .replace(/^import larisaPhoto from .*\n/m, '')                        // content/about.ts
        .replace(/\n\s*\{\s*\n\s*initials: 'למ',[\s\S]*?\n\s*\},/, '')        // FOUNDERS entry
        .replace(new RegExp(`\\n\\s*\\{ name: '${NAME}'.*\\},?(?=\\n)`, 'g'), '') // one-line people entries
      if (out.includes(NAME)) this.error(`${NAME} is still in ${id.slice(M.length)} - update the rule in vite.config.ts`)
      return out
    },
  }
}

// The header's sign-up button reads "join" on the portfolio copy, since nothing behind it opens here.
function joinLabel(): Plugin {
  return {
    name: 'critera-demo-join-label',
    enforce: 'pre',
    transform(code, id) {
      if (id !== M + '/src/components/landing/Header.tsx') return
      const out = code.replace(/^(\s*)הרשמה$/gm, '$1הצטרפות')
      // the site itself says 'הצטרפות' since 16.10.2026: nothing left to swap is fine, only a stray 'הרשמה' would be
      return out
    },
  }
}

// The hero's star network: the demo uses the fixed copy beside this file (see its header) in place of the
// site's own, until the same fix lands in the real source.
function fixedStars(): Plugin {
  const own = M + '/src/components/landing/ParticleNetwork'
  return {
    name: 'critera-demo-fixed-stars',
    enforce: 'pre',
    async resolveId(source, importer) {
      if (!importer || !/ParticleNetwork(\.tsx)?$/.test(source)) return
      const r = await this.resolve(source, importer, { skipSelf: true })
      if (r && r.id.replace(/\.tsx$/, '') === own) return __dirname + '/ParticleNetwork.tsx'
    },
  }
}

// The case also shows the live timeline on its own: the homepage keeps that section private to its file,
// so the demo build exports it under a second name (nothing else in the file changes).
function exportTimeline(): Plugin {
  return {
    name: 'critera-demo-export-timeline',
    enforce: 'pre',
    transform(code, id) {
      if (id !== M + '/src/pages/home/v3/HomeV3Live.tsx') return
      if (!/\nfunction How\(\)/.test(code)) this.error('the timeline section (function How) moved - update exportTimeline() in vite.config.ts')
      if (!/\nfunction Partners\(\)/.test(code)) this.error('the partners section (function Partners) moved - update exportTimeline() in vite.config.ts')
      return code + '\nexport { How as EmbedHow, Partners as EmbedPartners };\n'
    },
  }
}

// The English demo's blog is its own four-article English edition (blog-en.ts): the site's article list is
// swapped for it there, so the other articles never reach the English copy. The Hebrew demo keeps them all.
function englishBlog(): Plugin | null {
  if (process.env.DEMO_LANG !== 'en') return null
  const own = M + '/src/content/blog/index.ts'
  return {
    name: 'critera-demo-english-blog',
    enforce: 'pre',
    async resolveId(source, importer) {
      if (!importer || !/content\/blog(\/index(\.ts)?)?$/.test(source)) return
      const r = await this.resolve(source, importer, { skipSelf: true })
      if (r && r.id === own) return __dirname + '/blog-en.ts'
    },
  }
}

// The bottom bar and the back-to-top button wait for the dark hero to go: on a phone the hero is far taller than the
// site's fixed 600px, and they came up over the animation. They show once the hero's lower edge has passed the middle
// of the screen (still never before 600px). Both languages; on pages without the hero the 600px rule stands.
function afterHero(): Plugin {
  const files = [M + '/src/components/landing/FloatingCTA.tsx', M + '/src/components/shared/ScrollTopButton.tsx']
  return {
    name: 'critera-demo-after-hero',
    enforce: 'pre',
    transform(code, id) {
      if (!files.includes(id)) return
      if (!code.includes('window.scrollY > 600')) this.error('the 600px scroll rule moved in ' + id + ' - update afterHero() in vite.config.ts')
      return code.replace('window.scrollY > 600', "(window.scrollY > 600 && (document.querySelector('.chero')?.getBoundingClientRect().bottom ?? -1) < window.innerHeight / 2)")
    },
  }
}

export default defineConfig({
  root: __dirname,
  base: './',
  publicDir: M + '/public',
  plugins: [englishBlog(), afterHero(), exportTimeline(), withoutLarisa(), joinLabel(), i18n(M), fixedStars(), react(), tailwindcss()],
  build: { outDir: 'dist', emptyOutDir: true },
  server: { fs: { allow: [M, __dirname] } },
})
