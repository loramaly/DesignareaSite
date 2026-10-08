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
   - Touch devices (no hover): the finger is the cursor - drag over the portrait
     and the lens follows it, lift and it closes. Because a phone visitor cannot
     discover a hover affordance, the first time the hero scrolls into view the
     lens runs ONE slow sweep across her face and closes again. After that it
     only ever opens under a finger.
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

  /* The android layer is either a pair of <video> decks or a still <img>.
     Whichever is in the markup is what we wait on before letting the lens open. */
  const vids = Array.from(robot.querySelectorAll('.robot-vid'));
  const vid = vids[0] || null;
  let img = robot.querySelector('.portrait-robot-reveal img');
  let ready = false;

  /* which deck is currently the visible one, and how long they overlap */
  let deck = 0;
  const FADE = 0.5;             // seconds

  function watchImg() {
    ready = img.complete && img.naturalWidth > 0;
    img.addEventListener('load', () => { ready = true; });
    img.addEventListener('error', () => { robot.remove(); stop(); });
  }

  if (vid) {
    ready = vid.readyState >= 2;              /* HAVE_CURRENT_DATA */
    vid.addEventListener('loadeddata', () => { ready = true; });
    /* Only now, once the clip is known to be unplayable, is the still worth
       fetching - see the note on the <video> in index.html. */
    /* Falling back is a one-way door - once the still is in, the clip is gone
       for that visit - so it must not happen on a transient hiccup. Two retries
       first; only a clip that fails three times is treated as genuinely broken.
       (A single-threaded dev server serving Range requests trips this regularly,
       and a visitor on a flaky connection would too.) */
    let tries = 0;
    vid.addEventListener('error', () => {
      /* capture:true also catches the <source> element's own error events, which
         fire during normal source negotiation and do NOT mean the clip failed.
         vid.error is only set when the element itself has given up. */
      if (img || !vid.error) return;
      if (++tries <= 2) { setTimeout(() => { try { vid.load(); } catch (e) {} }, 400 * tries); return; }
      img = document.createElement('img');
      img.alt = ''; img.draggable = false;
      img.src = vid.dataset.fallback || 'assets/images/portraitRobot.png';
      /* both decks go, not just the one that reported the error */
      vids.forEach((v, i) => { if (i === 0) v.replaceWith(img); else v.remove(); });
      vids.length = 0;
      watchImg();
    }, true);
  } else if (img) {
    watchImg();
  }

  /* current (c*) vs target (t*) lens state - the frame loop pulls current
     toward target a percentage per frame; that IS the easing */
  let cx = 0, cy = 0, cr = 0;   // where the lens is now (cr = reveal radius)
  let crr = 0;                  // the ring's radius, eased faster than cr
  let tx = 0, ty = 0, tr = 0;   // where it wants to be
  let raf = null;
  let stopped = false;
  let playing = false;          // mirrors the video's play state

  const POS_EASE   = 0.16;  // how fast the lens follows (higher = snappier)
  const R_EASE     = 0.065; // the REVEAL - slow, so it fades up rather than pops
  const R_EASE_RING = 0.24; // the RING - quick, so it gets there first

  /* Those two rates are the "circle first, then the reveal" behaviour: both
     chase the same target radius, the ring just catches it about three times
     faster. The ring lands, and the android fades up inside it a beat later. */

  /* lens radius scales with the portrait so it feels right at every breakpoint.
     0.175 of the height is an eye plus the cheekbone under it - wide enough to
     read a piece of the android, still nowhere near a whole face. */
  function maxRadius(rect) { return Math.max(38, rect.height * 0.175); }

  /* ---------- the trail ----------
     Five blobs strung between the head and a "lag" point that chases the head
     more slowly than the head chases the cursor. The head-to-lag distance is
     therefore literally how fast you are moving: whip across and the blobs
     string out into a comet, stop and the lag catches up, they all pile onto
     the head, and the shape collapses back to one small circle.

     Spacing them along that vector (rather than sampling positions over time)
     is what guarantees they always overlap - time-sampled points tear apart
     into separate dots on a fast flick, and the union stops reading as one
     organic shape. The distance is clamped for the same reason. */
  const TRAIL   = 5;
  const TRAIL_F = [0.78, 0.60, 0.45, 0.32, 0.21];
  const LAG_EASE = 0.075;       // slower than POS_EASE - that gap IS the trail
  const LAG_MAX  = 2.3;         // in head radii, so the comet cannot detach
  let lagX = 0, lagY = 0;

  /* the lens does not jump to full size - it opens to about half and then
     creeps to full while the pointer stays on her, so moving across the
     portrait keeps uncovering a little more */
  let inside = false;
  let grow = 0;
  let baseR = 40;               // refreshed from the rect on every pointer event
  const GROW_EASE = 0.028;      // ~1.5s from half open to full

  function frame(now) {
    if (stopped) { raf = null; return; }

    const prevX = cx, prevY = cy;
    cx += (tx - cx) * POS_EASE;
    cy += (ty - cy) * POS_EASE;

    grow += ((inside ? 1 : 0) - grow) * GROW_EASE;
    /* a little extra while the pointer is actually moving, so the lens breathes
       with the gesture instead of sitting at a fixed size */
    const speed = Math.min(1, Math.hypot(cx - prevX, cy - prevY) / 11);
    tr = inside ? baseR * (0.60 + 0.28 * grow + 0.12 * speed) : 0;
    cr  += (tr - cr)  * R_EASE;
    crr += (tr - crr) * R_EASE_RING;
    const r = Math.max(0, cr);

    lagX += (cx - lagX) * LAG_EASE;
    lagY += (cy - lagY) * LAG_EASE;
    let dx = lagX - cx, dy = lagY - cy;
    const d = Math.hypot(dx, dy), cap = r * LAG_MAX;
    if (d > cap && d > 0) { const k = cap / d; dx *= k; dy *= k; }

    robot.style.setProperty('--lx', cx.toFixed(1) + 'px');
    robot.style.setProperty('--ly', cy.toFixed(1) + 'px');
    robot.style.setProperty('--lr', r.toFixed(1) + 'px');
    robot.style.setProperty('--lrr', Math.max(0, crr).toFixed(1) + 'px');
    for (let i = 0; i < TRAIL; i++) {
      const f = (i + 1) / TRAIL, n = i + 1;
      robot.style.setProperty('--x' + n, (cx + dx * f).toFixed(1) + 'px');
      robot.style.setProperty('--y' + n, (cy + dy * f).toFixed(1) + 'px');
      robot.style.setProperty('--r' + n, (r * TRAIL_F[i]).toFixed(1) + 'px');
    }
    /* keyed off the RING, not the reveal - that is what puts the circle on
       screen while the android underneath is still fading up */
    const on = crr > 5;
    robot.classList.toggle('is-on', on);

    /* the android is only ever visible under the lens, so there is no reason to
       decode video frames while it is shut */
    if (vids.length && on !== playing) {
      playing = on;
      if (on) {
        deck = 0;
        vids[0].currentTime = 0;
        const p = vids[0].play(); if (p) p.catch(() => {});
        /* deck 2 is preload="none" so it does not compete with deck 1 at page
           load; pull it in now, while there are still seconds before it is due */
        if (vids[1] && vids[1].preload === 'none') { vids[1].preload = 'auto'; vids[1].load(); }
        vids.forEach((v, i) => { v.style.opacity = i === 0 ? 1 : 0; });
      } else {
        vids.forEach((v, i) => { v.pause(); v.currentTime = 0; v.style.opacity = i === 0 ? 1 : 0; });
      }
    }
    if (on && vids.length > 1) crossfade();

    /* fully closed and nothing to chase -> sleep until the next pointer event */
    const settled = Math.abs(tx - cx) < 0.3 && Math.abs(ty - cy) < 0.3 &&
                    Math.abs(tr - cr) < 0.3 && Math.abs(tr - crr) < 0.3;
    /* reset grow too, so the next hover starts small again rather than
       resuming wherever the last one left off */
    if (settled && tr === 0) { lagX = cx; lagY = cy; grow = 0; raf = null; return; }
    raf = requestAnimationFrame(frame);
  }
  /* While the front deck is more than FADE from its end it is simply the
     picture. Inside that window the back deck is started from zero and the two
     are dissolved across, then they swap roles. The clip's mismatched join is
     therefore never a cut, and the face never freezes on a held frame. */
  function crossfade() {
    const a = vids[deck], b = vids[1 - deck];
    if (!a.duration) return;
    const left = a.duration - a.currentTime;
    if (left > FADE) { a.style.opacity = 1; b.style.opacity = 0; return; }
    if (b.paused) { b.currentTime = 0; const p = b.play(); if (p) p.catch(() => {}); }
    const t = Math.min(1, Math.max(0, (FADE - left) / FADE));
    a.style.opacity = 1 - t;
    b.style.opacity = t;
    if (left <= 0.05 || a.ended) {
      a.pause(); a.currentTime = 0; a.style.opacity = 0;
      b.style.opacity = 1;
      deck = 1 - deck;
    }
  }

  function wake() { if (!raf && !stopped) raf = requestAnimationFrame(frame); }
  function stop() { stopped = true; }

  /* ---------- desktop: the lens chases the mouse ---------- */
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (finePointer) {
    const PAD = 20; /* the lens starts opening a touch before the cursor enters */
    addEventListener('mousemove', (e) => {
      if (!ready) return;
      const r = robot.getBoundingClientRect();
      inside =
        e.clientX > r.left - PAD && e.clientX < r.right + PAD &&
        e.clientY > r.top  - PAD && e.clientY < r.bottom + PAD;
      baseR = maxRadius(r);
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      wake();
    }, { passive: true });

    /* cursor left the window entirely - close the lens */
    document.documentElement.addEventListener('mouseleave', () => { inside = false; wake(); });
  }

  /* ---------- touch: the lens parks on her eye ----------
     A phone has no hover, so the old behaviour - closed until a finger lands -
     meant most visitors never saw the effect at all. Here the lens instead sits
     open on her eye by default, which is also the most interesting frame of the
     clip. A finger still takes over and drags it anywhere; let go and it eases
     back to the eye.

     NOTE this is the one place the android IS left exposed. That was a
     deliberate exception, agreed for mobile only - desktop still opens under the
     cursor and closes when it leaves.

     Listeners are passive and on the document rather than the portrait, because
     .portrait-robot is pointer-events:none: dragging across it must still scroll
     the page. We only read coordinates. */

  /* her eye, as a fraction of the portrait box - measured off portrait.png
     (pupil at 674,350 of 1239x1005). Swap to 0.365 for the other eye. */
  const EYE_X = 0.544, EYE_Y = 0.348;
  const PARK_DELAY = 900;      // ms after the finger lifts before it drifts back
  let parked = false;          // true when the lens should rest on the eye
  let parkTimer = null;

  function parkOnEye() {
    if (!ready) return;
    const r = robot.getBoundingClientRect();
    if (!r.height) return;
    baseR = maxRadius(r);
    tx = r.width * EYE_X;
    ty = r.height * EYE_Y;
    inside = true;
    parked = true;
    wake();
  }

  if (!finePointer) {
    const PAD = 26;
    const track = (e) => {
      const t = e.touches && e.touches[0];
      if (!t || !ready) return;
      clearTimeout(parkTimer);
      parked = false;
      const r = robot.getBoundingClientRect();
      inside =
        t.clientX > r.left - PAD && t.clientX < r.right + PAD &&
        t.clientY > r.top  - PAD && t.clientY < r.bottom + PAD;
      baseR = maxRadius(r);
      tx = t.clientX - r.left;
      ty = t.clientY - r.top;
      wake();
    };
    addEventListener('touchstart', track, { passive: true });
    addEventListener('touchmove',  track, { passive: true });
    /* finger lifted - drift back to the eye rather than shutting */
    const release = () => {
      clearTimeout(parkTimer);
      parkTimer = setTimeout(parkOnEye, PARK_DELAY);
    };
    addEventListener('touchend', release, { passive: true });
    addEventListener('touchcancel', release, { passive: true });

    /* Only while the hero is actually on screen. Scrolled away it closes and
       the clip stops decoding - a lens that stayed open would otherwise play
       video down the whole page for no one. */
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) parkOnEye();
      else { inside = false; parked = false; clearTimeout(parkTimer); wake(); }
    }, { threshold: 0.35 });
    io.observe(robot);

    /* the box has no size until layout settles, so re-park once it does */
    addEventListener('load', () => { if (parked) parkOnEye(); });
    addEventListener('resize', () => { if (parked) parkOnEye(); }, { passive: true });
  }

  /* first paint: park the lens in the middle of the portrait, closed */
  addEventListener('load', () => {
    const r = robot.getBoundingClientRect();
    cx = tx = lagX = r.width / 2;
    cy = ty = lagY = r.height / 2;
  });
})();
