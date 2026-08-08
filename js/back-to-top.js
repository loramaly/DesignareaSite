(() => {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  const footer = document.querySelector('footer');

  /* Resting offset comes from the stylesheet (it differs per breakpoint and
     carries the safe-area inset), so it is read from the computed style with
     any inline value cleared first. */
  let rest = 28;
  const readRest = () => {
    btn.style.bottom = '';
    rest = parseFloat(getComputedStyle(btn).bottom) || 28;
  };

  /* The button rides above the footer instead of covering its icons: once the
     footer enters the viewport it keeps a 16px gap above its top edge. */
  const place = () => {
    if (!footer) return;
    const lift = innerHeight - footer.getBoundingClientRect().top + 16;
    btn.style.bottom = lift > rest ? lift + 'px' : '';
  };

  const onScroll = () => {
    btn.classList.toggle('show', window.scrollY > 480);
    place();
  };

  readRest();
  addEventListener('scroll', onScroll, {passive:true});
  addEventListener('resize', () => { readRest(); onScroll(); });
  onScroll();
  btn.addEventListener('click', () => scrollTo({top:0, behavior:'smooth'}));
})();
