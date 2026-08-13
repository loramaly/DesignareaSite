/* nav-back.js - make the back button behave inside the site on a phone or tablet.

   Two things were breaking it:

   1. A demo opened with target="_blank" lands in a brand new tab, and a new tab
      starts with an empty history. Android's back button then has nothing to go
      back to and drops the visitor out of the site altogether. iOS has no back
      button at all - Safari greys its back chevron and its edge-swipe out for
      the same reason - so the only way back is the tab switcher, which nobody
      looks for. On a touch device our own links therefore open in the same tab,
      and back walks the site the way it should. A mouse still gets the new tab.

   2. When something floats on top of the page - the side menu, a zoomed image,
      the coming-soon dialog, a demo overlay - back used to leave the page while
      that layer was still open. It now closes the topmost layer instead, one
      press per layer, and only leaves once nothing is open.

   Nothing else has to call into this file. It finds the layers it knows about
   and closes them exactly the way a tap on the backdrop or the X would, so each
   page keeps its own closing animation, focus return and scroll unlock.
   A page with its own layers can add one: navBack.add(el, isOpen, close). */
(function () {
  'use strict';

  /* a coarse pointer or no hover means a finger, which means a back button or a
     back gesture rather than a second tab the visitor can find their way out of */
  var touch = matchMedia('(hover: none)').matches || matchMedia('(pointer: coarse)').matches;
  if (!touch) return;

  /* ---------- 1. our own pages stay in one tab ---------- */

  var links = document.querySelectorAll('a[target="_blank"]');
  for (var i = 0; i < links.length; i++) {
    var a = links[i];
    if (a.hasAttribute('download')) continue;                        // the resume PDF wants its own tab
    if (a.protocol !== 'http:' && a.protocol !== 'https:') continue; // mailto:, tel:, and friends
    if (a.host !== location.host) continue;                          // someone else's site stays outside
    a.removeAttribute('target');
    var note = a.querySelector('.sr-only');
    if (note && /new tab/i.test(note.textContent)) note.remove();    // the promise is no longer true
  }

  /* "To portfolio" at the foot of a demo: once the demo is in the same tab,
     stepping back returns the visitor to the exact card they came from instead
     of dumping them at the top of the home page. The AFT demo already does this
     for itself, so it is excluded here - two handlers would step back twice. */
  var out = document.querySelector('a.disc-back:not(#backPortfolio)');
  if (out) {
    out.addEventListener('click', function (e) {
      if (history.length < 2 || !document.referrer) return;
      var from;
      try { from = new URL(document.referrer).host; } catch (err) { return; }
      if (from !== location.host) return;   // arrived from outside - the href is the only way home
      e.preventDefault();
      history.back();
    });
  }

  /* ---------- 2. back closes what floats on top ---------- */

  var layers = [];
  var tick = 0;
  var guarded = false;   // a sentinel entry of ours is sitting on the history stack
  var selfPop = false;   // the next popstate is one we asked for, not the visitor

  /* a stale sentinel from a reload would eat the first back press - drop it
     without navigating anywhere */
  if (history.state && history.state.navBack) history.replaceState({}, '');

  function add(el, isOpen, close) {
    if (!el) return;
    var layer = { rank: 0, stuck: false, isOpen: function () { return isOpen(el); }, close: function () { close(el); } };
    layers.push(layer);
    new MutationObserver(sync).observe(el, { attributes: true, attributeFilter: ['class', 'hidden', 'aria-hidden'] });
  }

  function openLayers() {
    var open = [];
    layers.forEach(function (l) {
      if (l.isOpen()) { if (!l.rank) l.rank = ++tick; if (!l.stuck) open.push(l); }
      else { l.rank = 0; l.stuck = false; }
    });
    return open.sort(function (x, y) { return x.rank - y.rank; });   // oldest first, topmost last
  }

  function sync() {
    var open = openLayers().length;
    if (open && !guarded) {
      try { history.pushState({ navBack: true }, ''); guarded = true; } catch (err) { /* nothing to do */ }
    } else if (!open && guarded) {
      guarded = false;
      /* only ever step back over an entry we put there - never over a real page */
      if (history.state && history.state.navBack) { selfPop = true; history.back(); }
    }
  }

  addEventListener('popstate', function () {
    if (selfPop) { selfPop = false; return; }
    guarded = false;                        // the entry we pushed has just been used up
    var open = openLayers();
    if (!open.length) return;               // nothing on top, so the visitor really is leaving
    var top = open[open.length - 1];
    top.close();                            // the topmost layer only - one press, one layer
    /* if that layer did not actually close, stop guarding it - a back button
       that swallows every press and never leaves the page is far worse than a
       layer that stays up */
    setTimeout(function () { if (top.isOpen()) top.stuck = true; sync(); }, 0);
  });

  /* Safari restores a page from its back-forward cache with our variables
     intact, so what we believe about the stack has to be re-checked */
  addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    guarded = !!(history.state && history.state.navBack);
    sync();
  });

  /* ---------- the layers themselves ---------- */

  var byId = function (id) { return document.getElementById(id); };
  var hasClass = function (cls) { return function (el) { return el.classList.contains(cls); }; };
  var click = function (el) { if (el) el.dispatchEvent(new MouseEvent('click', { bubbles: true })); };
  var clickIn = function (sel) { return function (el) { click(el.querySelector(sel)); }; };

  /* the side menu - its own close lives on the backdrop */
  add(byId('mainNav'), hasClass('open'), function () { click(byId('navOverlay')); });

  /* a zoomed case-study image - a tap anywhere on the lightbox closes it */
  add(byId('csLightbox'), hasClass('open'), click);

  /* the coming-soon dialog */
  add(byId('comingSoon'), hasClass('is-open'), clickIn('.cs-modal-close'));

  /* demo overlays - each closes on a click that lands on the overlay itself */
  add(byId('detailOv'), hasClass('open'), click);
  add(byId('taskOv'), hasClass('open'), click);

  sync();

  window.navBack = { add: add };
})();
