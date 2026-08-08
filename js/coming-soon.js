/* Coming-soon dialog for the portfolio download.
   Opens on any [data-coming-soon] control, closes on Esc, backdrop or the
   close button, and returns focus to whatever opened it. */
(function () {
  var dialog = document.getElementById('comingSoon');
  if (!dialog) return;

  var panel = dialog.querySelector('.cs-modal-panel');
  var closeBtn = dialog.querySelector('.cs-modal-close');
  var opener = null;
  var isOpen = false;
  var rafId = null;
  var timer = null;

  function open(trigger) {
    if (isOpen) return;
    isOpen = true;
    if (timer) { clearTimeout(timer); timer = null; }
    opener = trigger || null;
    dialog.hidden = false;
    dialog.setAttribute('aria-hidden', 'false');
    document.body.classList.add('has-modal');
    /* next frame, so the fade has a starting state to animate from */
    rafId = requestAnimationFrame(function () {
      rafId = null;
      if (isOpen) dialog.classList.add('is-open');
    });
    if (closeBtn) closeBtn.focus();
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    /* a pending open frame would otherwise put the class straight back */
    if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
    dialog.classList.remove('is-open');
    dialog.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('has-modal');
    /* a plain timer, not transitionend - that event never arrives if the
       transition is interrupted or motion is reduced */
    if (timer) clearTimeout(timer);
    timer = setTimeout(function () {
      timer = null;
      if (!isOpen) dialog.hidden = true;
      if (opener) { opener.focus(); opener = null; }
    }, 260);
  }

  document.addEventListener('click', function (e) {
    var el = e.target instanceof Element ? e.target : null;
    if (!el) return;
    var trigger = el.closest('[data-coming-soon]');
    if (trigger) { e.preventDefault(); open(trigger); return; }
    if (isOpen && (el === dialog || el.closest('.cs-modal-close') || el.closest('.cs-modal-cta'))) close();
  });

  document.addEventListener('keydown', function (e) {
    if (!isOpen) return;
    if (e.key === 'Escape') { close(); return; }
    /* keep tabbing inside the panel while it is open */
    if (e.key === 'Tab') {
      var f = panel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
})();
