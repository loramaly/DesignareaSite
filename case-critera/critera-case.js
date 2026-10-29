/* Critera case - the two behaviours this page has beyond the shared case script.

   1. The numbers, as on the live Critera site: the row nearest the middle of the
      screen is lit and the rest sit back; each figure counts up whenever its row
      comes on screen, both ways. The slab gets the site's few twinkling stars.
   2. The ad videos: still until pressed, and only one plays at a time. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- stars: a handful of soft dots at random, twinkling out of step ---- */
  var sky = document.querySelector('.cr-stars');
  if (sky) {
    for (var i = 0; i < 26; i++) {
      var s = document.createElement('span');
      var size = 1.5 + Math.random() * 2;
      s.style.width = s.style.height = size + 'px';
      s.style.top = Math.random() * 100 + '%';
      s.style.left = Math.random() * 100 + '%';
      s.style.animationDelay = (Math.random() * 5).toFixed(2) + 's';
      sky.appendChild(s);
    }
  }

  /* ---- spotlight: light the row nearest the middle of the screen ---- */
  var rows = Array.prototype.slice.call(document.querySelectorAll('.cr-num'));
  if (rows.length) {
    var raf = 0;
    var light = function () {
      raf = 0;
      var mid = window.innerHeight / 2, best = 0, bestD = Infinity;
      rows.forEach(function (r, i) {
        var b = r.getBoundingClientRect();
        var d = Math.abs(b.top + b.height / 2 - mid);
        if (d < bestD) { bestD = d; best = i; }
      });
      rows.forEach(function (r, i) { r.classList.toggle('focus', i === best); });
    };
    var schedule = function () { if (!raf) raf = requestAnimationFrame(light); };
    light();
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule);

    /* ---- count up from 0 each time a row comes on screen ---- */
    var count = function (el) {
      var to = +el.getAttribute('data-to');
      if (reduce) { el.textContent = to; return; }
      var t0 = performance.now(), dur = 1400;
      var step = function (now) {
        var k = Math.min(1, (now - t0) / dur);
        el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))); // ease-out
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) count(e.target.querySelector('.n')); });
      }, { threshold: 0.5 });
      rows.forEach(function (r) { io.observe(r); });
    }
  }

  /* ---- the live hero, cropped: the frame runs the real hero at 1440x900 and is
         scaled and shifted so one part of it (data-x/y/w/h, in hero pixels) fills the box ---- */
  Array.prototype.forEach.call(document.querySelectorAll('.cr-crop'), function (box) {
    var f = box.querySelector('iframe');
    var x = +box.getAttribute('data-x'), y = +box.getAttribute('data-y');
    var w = +box.getAttribute('data-w'), h = +box.getAttribute('data-h');
    // the frame's own canvas: the hero runs at 1440x900, the engine at its native 1490x490
    f.style.width = (+box.getAttribute('data-fw') || 1440) + 'px';
    f.style.height = (+box.getAttribute('data-fh') || 900) + 'px';
    box.style.aspectRatio = w + ' / ' + h;
    var fit = function () {
      var k = box.clientWidth / w;
      f.style.transform = 'scale(' + k + ') translate(' + -x + 'px,' + -y + 'px)';
    };
    fit();
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(box);
  });

  /* ---- live sections of the site (same origin): the frame takes its content's height,
         and follows it when a step opens or the width changes ---- */
  Array.prototype.forEach.call(document.querySelectorAll('.cr-live'), function (f) {
    var follow = function () {
      var d = f.contentDocument;
      if (!d || !d.body) return;
      var fit = function () {
        var root = d.querySelector('.v11-tl');
        f.style.height = Math.ceil(root ? root.getBoundingClientRect().bottom + 24 : d.documentElement.scrollHeight) + 'px';
      };
      fit();
      if ('ResizeObserver' in window) new ResizeObserver(fit).observe(d.body);
      setTimeout(fit, 600); setTimeout(fit, 1600);
    };
    f.addEventListener('load', follow);
  });

  /* ---- pictures that slide in from the right when they reach the screen ---- */
  var slides = document.querySelectorAll('.cr-slide-in, .cr-rainbow');  // the logo bars build in the same way
  if ('IntersectionObserver' in window) {
    // they come in each time they reach the screen, from above or below: once fully off it they reset, ready to come in again
    var slideIo = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.intersectionRatio >= 0.25) e.target.classList.add('in');
        else if (!e.isIntersecting) e.target.classList.remove('in');
      });
    }, { threshold: [0, 0.25] });
    Array.prototype.forEach.call(slides, function (s) { slideIo.observe(s); });
  } else Array.prototype.forEach.call(slides, function (s) { s.classList.add('in'); });

  /* ---- phones: the small orbit - the four bars ride the site's slab-shaped track round the logo, as on the site ---- */
  var orb = document.querySelector('.cr-orbit');
  if (orb) {
    var oSvg = orb.querySelector('svg'), oPath = orb.querySelector('path');
    var oBars = Array.prototype.slice.call(orb.querySelectorAll('.cr-orbit-bar'));
    var TILT = -7, tilt = TILT * Math.PI / 180, ang = -Math.PI / 2, oLast = 0, oRaf = 0;
    var oPlace = function () {
      var w = orb.clientWidth, h = orb.clientHeight;
      if (!w) return;
      var rx = w * 0.38, ry = rx * 0.526, r = ry * 0.97, cx = w / 2, cy = h / 2;
      oSvg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      // the same track as the site: a rounded rectangle whose corners are almost its whole short side
      oPath.setAttribute('d', 'M ' + (-rx + r) + ' ' + -ry + ' H ' + (rx - r) + ' A ' + r + ' ' + r + ' 0 0 1 ' + rx + ' ' + (-ry + r) + ' V ' + (ry - r)
        + ' A ' + r + ' ' + r + ' 0 0 1 ' + (rx - r) + ' ' + ry + ' H ' + (-rx + r) + ' A ' + r + ' ' + r + ' 0 0 1 ' + -rx + ' ' + (ry - r)
        + ' V ' + (-ry + r) + ' A ' + r + ' ' + r + ' 0 0 1 ' + (-rx + r) + ' ' + -ry + ' Z');
      oPath.setAttribute('transform', 'translate(' + cx + ' ' + cy + ') rotate(' + TILT + ')');
      var L = oPath.getTotalLength();
      oBars.forEach(function (b, i) {
        var t = ang + i * Math.PI / 2, u = (((t + Math.PI / 2) / (2 * Math.PI)) % 1 + 1) % 1;
        var p = oPath.getPointAtLength(u * L);
        var x = cx + p.x * Math.cos(tilt) - p.y * Math.sin(tilt), y = cy + p.x * Math.sin(tilt) + p.y * Math.cos(tilt);
        var depth = (p.y / ry + 1) / 2;
        b.style.transform = 'translate(' + (x - b.offsetWidth / 2) + 'px,' + (y - b.offsetHeight / 2) + 'px) scale(' + (0.9 + depth * 0.1) + ')';
        b.style.zIndex = 10 + Math.round(depth * 10);
      });
    };
    var oTick = function (now) {
      if (oLast && !oHold) ang += (now - oLast) / 36000 * Math.PI * 2; // one turn in 36 seconds; the pointer on it holds it, as on the site
      oLast = now; oPlace(); oRaf = requestAnimationFrame(oTick);
    };
    var oHold = false;
    orb.addEventListener('mouseenter', function () { oHold = true; });
    orb.addEventListener('mouseleave', function () { oHold = false; });
    oPlace();
    if ('ResizeObserver' in window) new ResizeObserver(oPlace).observe(orb);
    // it turns only while it is on screen (and never with reduced motion)
    if (!reduce && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { if (!oRaf) { oLast = 0; oRaf = requestAnimationFrame(oTick); } }
        else { cancelAnimationFrame(oRaf); oRaf = 0; }
      }).observe(orb);
    }
  }

  /* ---- the phone deck: the pointer fans it out (CSS); a tap does it where there is no pointer ---- */
  Array.prototype.forEach.call(document.querySelectorAll('.cr-deck'), function (deck) {
    // with a mouse the deck fans out on hover and a click zooms the screen (the case's lightbox);
    // on a touch screen the first tap fans it out, the next tap on a screen zooms it
    deck.addEventListener('click', function (e) {
      if (window.matchMedia('(hover: hover)').matches || deck.classList.contains('is-open')) return;
      e.stopPropagation(); e.preventDefault();
      deck.classList.add('is-open');
    }, true);
  });

  /* ---- a stretch of the About page: everything but its road hidden, scrolled to the stretch to show ---- */
  Array.prototype.forEach.call(document.querySelectorAll('.cr-about-crop iframe'), function (f) {
    var y = +f.parentNode.getAttribute('data-scroll') || 0;
    f.addEventListener('load', function () {
      var tries = 0;
      (function ready() {
        var d = f.contentDocument, w = f.contentWindow;
        if (!d || !d.querySelector('.b14-road')) { if (tries++ < 60) setTimeout(ready, 100); return; }
        var s = d.createElement('style');
        s.textContent = 'html,body{background:#fff!important;overflow:hidden!important} body *{visibility:hidden!important}'
          + ' .b14-road,.b14-road *{visibility:visible!important} section,main,[class*=bg-]{background:transparent!important}'
          // the road drawn in full from the start (on the About page it draws itself as you scroll) - the lenders keep their own build
          + ' .b14-road > svg [clip-path]{clip-path:none!important} .b14-road > svg path{stroke-dashoffset:0!important;opacity:1!important}'
          + ' .b14-station,.b14-join-coin,.b14-line-name,.b14-station *{opacity:1!important;transform:none!important}';
        d.head.appendChild(s);
        w.scrollTo(0, y);
      })();
    });
  });

  /* ---- the three doors: rise in on screen; a white panel glides to the hovered door ---- */
  var doors = document.querySelector('.cr-doors');
  if (doors) {
    if ('IntersectionObserver' in window) {
      var doorIo = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { doors.classList.add('is-in'); doorIo.disconnect(); }
      }, { threshold: 0.3 });
      doorIo.observe(doors);
    } else doors.classList.add('is-in');

    var glow = doors.querySelector('.cr-door-glow'), lit = null;
    var enter = function (d) {
      // the door's place in the layout, not on screen: while the doors still rise in (translateY) the screen box sat the
      // panel lower than its door - more room above the text than below
      // the first door lights in place; after that the panel glides from door to door
      glow.classList.toggle('glide', lit !== null && !reduce);
      glow.style.width = d.offsetWidth + 'px';
      glow.style.height = d.offsetHeight + 'px';
      glow.style.transform = 'translate(' + d.offsetLeft + 'px,' + d.offsetTop + 'px)';
      glow.style.opacity = 1;
      if (lit) lit.classList.remove('hot');
      d.classList.add('hot'); lit = d;
      doors.classList.add('is-hot');
    };
    var leave = function () {
      glow.style.opacity = 0;
      if (lit) lit.classList.remove('hot');
      lit = null;
      doors.classList.remove('is-hot');
    };
    Array.prototype.forEach.call(doors.querySelectorAll('.cr-door'), function (d) {
      d.addEventListener('mouseenter', function () { enter(d); });
      d.addEventListener('focus', function () { enter(d); });
      d.addEventListener('blur', leave);
    });
    doors.addEventListener('mouseleave', leave);
  }

  /* ---- the short clips of the site: play while on screen, rest when not.
         With reduced motion they never start on their own - they get controls. ---- */
  var clips = Array.prototype.slice.call(document.querySelectorAll('.cr-clip'));
  if (reduce) {
    clips.forEach(function (c) { c.removeAttribute('autoplay'); c.pause(); c.controls = true; });
  } else if ('IntersectionObserver' in window) {
    var clipIo = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { var p = e.target.play(); if (p && p.catch) p.catch(function () {}); }
        else e.target.pause();
      });
    }, { threshold: 0.35 });
    clips.forEach(function (c) { clipIo.observe(c); });
  }

  /* ---- the ads: pressing play on one pauses the others ---- */
  var vids = Array.prototype.slice.call(document.querySelectorAll('.cr-video video'));
  vids.forEach(function (v) {
    v.volume = 0.35; // the ads are mixed loud for social feeds - start them at a normal level; the slider still goes up
    v.addEventListener('play', function () {
      vids.forEach(function (o) { if (o !== v) o.pause(); });
    });
  });
})();
