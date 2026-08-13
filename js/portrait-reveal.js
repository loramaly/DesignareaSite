/* Portrait robot reveal
   ---------------------
   The hero has two perfectly-aligned portraits: the original (.portrait) and
   an android version (.portrait-robot). The robot layer is hidden behind a
   circular radial-gradient mask whose center (--lx/--ly) and radius (--lr)
   live as CSS variables on .portrait-robot.

   This file only does one thing: it moves those three variables.

   - Desktop (real mouse): the lens chases the cursor. Values are LERPed
     (linear interpolation) every animation frame, so the lens has a little
     "weight" and glides instead of teleporting - that easing is what makes
     the effect feel premium.
   - Touch devices (no hover): the lens drifts on its own in a slow, organic
     path over the portrait, so phone visitors see the effect too.
   - prefers-reduced-motion: the effect stays off entirely.

   If assets/images/portraitRobot.png is missing or fails to load, the layer
   removes itself and the page behaves exactly as before. */
(function () {
  'use strict';

  const robot = document.getElementById('portraitRobot');
  if (!robot) return;

  /* the user asked the OS for less motion - honor it and do nothing */
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    robot.remove();
    return;
  }

  const img = robot.querySelector('.portrait-robot-reveal img');
  let ready = img.complete && img.naturalWidth > 0;
  img.addEventListener('load', () => { ready = true; });
  img.addEventListener('error', () => { robot.remove(); stop(); });

  /* current (c*) vs target (t*) lens state - the frame loop pulls current
     toward target a percentage per frame; that IS the easing */
  let cx = 0, cy = 0, cr = 0;   // where the lens is now
  let tx = 0, ty = 0, tr = 0;   // where it wants to be
  let raf = null;
  let stopped = false;

  const POS_EASE = 0.16;  // how fast the lens follows (higher = snappier)
  const R_EASE   = 0.10;  // how fast it opens/closes (slower = more cinematic)

  /* lens radius scales with the portrait so it feels right at every breakpoint */
  function maxRadius(rect) { return Math.max(64, rect.height * 0.40); }

  function frame(now) {
    if (stopped) { raf = null; return; }

    if (auto) autoTarget(now);      // touch mode: targets come from a clock

    cx += (tx - cx) * POS_EASE;
    cy += (ty - cy) * POS_EASE;
    cr += (tr - cr) * R_EASE;

    robot.style.setProperty('--lx', cx.toFixed(1) + 'px');
    robot.style.setProperty('--ly', cy.toFixed(1) + 'px');
    robot.style.setProperty('--lr', Math.max(0, cr).toFixed(1) + 'px');
    robot.classList.toggle('is-on', cr > 8);

    /* fully closed and nothing to chase -> sleep until the next mousemove */
    const settled = Math.abs(tx - cx) < 0.3 && Math.abs(ty - cy) < 0.3 && Math.abs(tr - cr) < 0.3;
    if (settled && tr === 0 && !auto) { raf = null; return; }
    raf = requestAnimationFrame(frame);
  }
  function wake() { if (!raf && !stopped) raf = requestAnimationFrame(frame); }
  function stop() { stopped = true; }

  /* ---------- desktop: the lens chases the mouse ---------- */
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  let auto = !finePointer;

  if (finePointer) {
    const PAD = 34; /* the lens starts opening a touch before the cursor enters */
    addEventListener('mousemove', (e) => {
      if (!ready) return;
      const r = robot.getBoundingClientRect();
      const inside =
        e.clientX > r.left - PAD && e.clientX < r.right + PAD &&
        e.clientY > r.top  - PAD && e.clientY < r.bottom + PAD;
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      tr = inside ? maxRadius(r) : 0;
      wake();
    }, { passive: true });

    /* cursor left the window entirely - close the lens */
    document.documentElement.addEventListener('mouseleave', () => { tr = 0; wake(); });
  }

  /* ---------- touch: a slow autonomous scan while the hero is visible ---------- */
  let visible = false;
  if (auto) {
    const io = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) wake(); /* frame loop stops itself via autoTarget when hidden */
    }, { threshold: 0.2 });
    io.observe(robot);
  }
  function autoTarget(now) {
    if (!visible || !ready) { tr = 0; return; }
    const t = now / 1000;
    const r = robot.getBoundingClientRect();
    /* two out-of-phase sine waves = a natural, non-repeating-looking drift */
    tx = r.width  * (0.50 + 0.26 * Math.sin(t * 0.55));
    ty = r.height * (0.40 + 0.20 * Math.sin(t * 0.83 + 1.7));
    tr = maxRadius(r) * (0.62 + 0.14 * Math.sin(t * 0.37));
  }

  /* first paint: park the lens in the middle of the portrait, closed */
  addEventListener('load', () => {
    const r = robot.getBoundingClientRect();
    cx = tx = r.width / 2;
    cy = ty = r.height / 2;
    if (auto) wake();
  });
})();
