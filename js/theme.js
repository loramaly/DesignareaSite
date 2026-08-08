/* Theme switch - dark (default) <-> light.
   The <html data-theme> attribute is set as early as possible by the inline
   snippet in each page's <head>, so the first paint is already correct and the
   page never flashes the wrong theme. This file only wires the button. */
(function () {
  const KEY = 'lm-theme-v2';
  const root = document.documentElement;

  function apply(theme, remember) {
    root.setAttribute('data-theme', theme);
    // only an explicit click is remembered - otherwise dark stays the default
    if (remember) { try { localStorage.setItem(KEY, theme); } catch (e) {} }
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      const light = theme === 'light';
      btn.setAttribute('aria-pressed', String(light));
      // the label names what the button will DO, not the state it is in
      btn.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
      btn.setAttribute('title', light ? 'Switch to dark theme' : 'Switch to light theme');
    });
  }

  const current = () => root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => apply(current() === 'light' ? 'dark' : 'light', true));
  });

  apply(current(), false);
})();
