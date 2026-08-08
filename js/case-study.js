(function(){
  const nav = document.getElementById('caseNav');
  const sentinel = document.getElementById('caseHeadSentinel');
  // only the in-page items take part in scrollspy and smooth scrolling - the
  // Live Demo item is a real link to another document and must behave like one
  const navItems = [...document.querySelectorAll('.case-nav-item[href^="#"]')];
  const sections = navItems.map(a => document.getElementById(a.getAttribute('href').slice(1))).filter(Boolean);

  // give the floating nav a background + shadow only once it's actually stuck to the top
  if (sentinel && nav) {
    const stuckIO = new IntersectionObserver(([entry]) => {
      nav.classList.toggle('is-stuck', !entry.isIntersecting);
    }, { rootMargin: '0px 0px 0px 0px', threshold: 0 });
    stuckIO.observe(sentinel);
  }

  // secondary nav is horizontally scrollable once the items stop fitting.
  // Fade whichever edge still has items behind it, so it's visible there's more.
  const navScroller = document.querySelector('.case-nav-items');
  if (nav && navScroller) {
    const updateFades = () => {
      const max = navScroller.scrollWidth - navScroller.clientWidth;
      const x = navScroller.scrollLeft;
      // items no longer fit -> the bar is pinned to the full frame width
      nav.classList.toggle('is-full', max > 1);
      nav.classList.toggle('can-scroll-left', max > 1 && x > 1);
      nav.classList.toggle('can-scroll-right', max > 1 && x < max - 1);
    };
    navScroller.addEventListener('scroll', updateFades, { passive: true });
    addEventListener('resize', updateFades);
    addEventListener('load', updateFades);
    updateFades();
  }

  // scrollspy: highlight the nav item for the section currently in view.
  // Every nav item maps to a real section (the first one, About, is the hero),
  // so the highlight is always correct - including at the very top of the page.
  if (sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navItems.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(s => spy.observe(s));
  }

  // smooth scroll that lands exactly at the section heading, offset for the sticky nav height
  navItems.forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = nav ? nav.offsetHeight : 0;
      const y = target.getBoundingClientRect().top + window.scrollY - navH - 24;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });

  // reveal-on-scroll
  const revealEls = [...document.querySelectorAll('.cs-reveal, .cs-reveal-group')];
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
    });
  }, { threshold: .12 });
  revealEls.forEach(el => revealIO.observe(el));

  // hamburger / side menu (mirrors js/chat.js so this page works standalone)
  const burger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');
  const navOverlay = document.getElementById('navOverlay');
  if (burger && mainNav && navOverlay) {
    function setMenu(open) {
      burger.classList.toggle('open', open);
      mainNav.classList.toggle('open', open);
      navOverlay.classList.toggle('show', open);
      burger.setAttribute('aria-expanded', open);
      document.body.classList.toggle('menu-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', () => setMenu(!mainNav.classList.contains('open')));
    navOverlay.addEventListener('click', () => setMenu(false));
    mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  }

  // click-to-zoom lightbox for content images
  const lightbox = document.getElementById('csLightbox');
  const lightboxImg = document.getElementById('csLightboxImg');
  const lightboxClose = document.getElementById('csLightboxClose');
  const zoomables = [...document.querySelectorAll('.cs-zoomable')];
  if (lightbox && lightboxImg && zoomables.length) {
    function openLightbox(img) {
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt || '';
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    zoomables.forEach(img => img.addEventListener('click', () => openLightbox(img)));
    lightbox.addEventListener('click', closeLightbox);
    lightboxClose.addEventListener('click', (e) => { e.stopPropagation(); closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
    });
  }
})();
