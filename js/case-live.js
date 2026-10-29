/* The homepage cards' live pictures (.case-live, styles in css/styles.css). Each picture is its screenshot in layers.
   While it is on screen: every piece arrives once, then the frame of the picture stays put (the fire, the sparkles,
   the timeline's phase bar, its line and grey phases), and the other pieces each keep their own rhythm - they leave
   and come back on their own clocks, never all at once, so the picture is always partly on the move.
   Offsets are in % of each piece's own size, so it all scales with the card. Reduced motion: nothing moves. */
(function () {
  var pics = document.querySelectorAll('.case-live');
  if (!pics.length) return;
  // the pieces are hidden by the stylesheet until a play reveals them; with no Web Animations, show the picture whole
  if (!('animate' in Element.prototype)) {
    Array.prototype.forEach.call(pics, function (p) { p.classList.add('cl-static'); });
    return;
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // every move starts slow and gathers speed to the end (Larisa, 15.10)
  var SOFT = 'cubic-bezier(.5,0,.85,.4)', BOUNCE = SOFT, EASE = SOFT;
  // [selector, how it arrives, at (ms), for (ms), from/away (translate), its own cycle (ms; 0 = it stays),
  //  when that cycle starts (ms from the start), cycle mode]. Everything is in place within about a second and a half,
  // so a quick scroll still sees the whole picture. A pin and the person beside it share one clock: they leave and come
  // back together, each on its own path.
  var PLAYS = {
    syncops: [
      ['.cl-fire',      'fade', 0,   500],
      ['.cl-spark-a',   'pop',  100, 500],
      ['.cl-spark-b',   'pop',  200, 500],
      ['.cl-pin-grey',  'drop', 100, 700, '0 -150%',     8200, 2600],
      ['.cl-av-a',      'fly',  250, 800, '-240% -140%', 8200, 2600],
      ['.cl-pin-blue',  'drop', 200, 700, '0 -150%',     9000, 3800],
      ['.cl-av-d',      'fly',  350, 800, '220% -160%',  9000, 3800],
      ['.cl-pin-cyan',  'drop', 300, 700, '0 -150%',     8000, 1700, 'pair'],
      ['.cl-av-c',      'fly',  450, 800, '40% 240%',    8000, 1700, 'pair'],
      ['.cl-route',     'draw', 900, 700, null,          8000, 1700, 'route'],
      ['.cl-pin-group', 'drop', 400, 800, '0 -130%',     9600, 5000],
      ['.cl-av-b',      'fly',  500, 800, '-320% 60%',   7600, 1400]
    ],
    // the AFT case cover: its frame (phase bar, line, grey phases, the screenshot) stays; the steps, the warning,
    // the diamond, the spark and the Magic Pro card each keep their own clock
    'aft-hero': [
      ['.cl-bar-44',    'grow', 150,  400, null,        7000, 1200, 'bar'],
      ['.cl-chip-44',   'fly',  400,  500, '0 -260%',   7000, 1200, 'chip'],
      ['.cl-bar-77',    'grow', 300,  400, null,        8000, 2000, 'bar'],
      ['.cl-chip-77',   'fly',  550,  500, '0 -260%',   8000, 2000, 'chip'],
      ['.cl-bar-1524',  'grow', 450,  500, null,        9000, 1600, 'bar'],
      ['.cl-chip-1524', 'fly',  700,  500, '0 -260%',   9000, 1600, 'chip'],
      ['.cl-missing',   'fly',  800,  500, '0 -70%',    7500, 1000],
      ['.cl-spark',     'pop',  1000, 500],  // it stays; it spins up and swells on its own (css)
      ['.cl-diamond',   'spin', 900,  600, '420% -380%', 8500, 2600],
      ['.cl-magic',     'fly',  600,  700, '0 18%']  // then it stays, drifting (css)
    ],
    aft: [
      // the frame of the timeline: in place at once, and it stays
      ['.cl-bar-main',  'grow', 0,    500],
      ['.cl-line',      'draw', 200,  600],
      ['.cl-bar-1524',  'grow', 450,  500, null,        9000, 1600, 'bar'],
      ['.cl-bar-2',     'grow', 500,  350],
      ['.cl-tail-a',    'draw', 700,  250],
      ['.cl-bar-3',     'grow', 850,  350],
      ['.cl-tail-b',    'draw', 1050, 250],
      // the steps on it come and go on their own short clocks, so there is always something gathering or parting
      ['.cl-bar-44',    'grow', 150,  400, null,        7000, 1200, 'bar'],
      ['.cl-chip-44',   'fly',  400,  500, '0 -260%',   7000, 1200, 'chip'],
      ['.cl-bar-77',    'grow', 300,  400, null,        8000, 2000, 'bar'],
      ['.cl-chip-77',   'fly',  550,  500, '0 -260%',   8000, 2000, 'chip'],
      ['.cl-chip-1524', 'fly',  700,  500, '0 -260%',   9000, 1600, 'chip'],
      // Missing Approvals does not fly: it closes into its arrow on the line and opens again (Larisa, 18.10)
      ['.cl-missing',   'unfold', 800, 1000, null,      7500, 1000, 'unfold'],
      ['.cl-diamond',   'spin', 900,  600, '420% -380%', 8500, 2600]
    ]
  };

  // the AFT case hero in code (js/live-aft.js, data-variant="hero"): the card's play, plus the Magic Pro card opening
  PLAYS['aft-code-hero'] = PLAYS.aft.concat([['.cl-magic', 'draw', 700, 900]]);

  // every picture (SyncOps and AFT): once everything has gathered, the pieces start to part almost at once - within about a second,
  // in their usual order (Larisa, 14.10: "the pause almost to nothing"). Only the first time - the cycles keep their
  // own rhythm after that.
  var QUICK_FIRST = { aft: true, 'aft-hero': true, 'aft-code-hero': true, syncops: true };
  // how far into each cycle a piece stays home before it starts to leave
  function holdOf(kind, mode) {
    return mode === 'route' ? .06 : mode === 'pair' ? .26 : mode === 'bar' ? .3 : mode === 'chip' ? .06 : .1;
  }

  // Missing Approvals in the code picture (Larisa, 18.10): on arrival the red mark comes out first - its arrow on
  // the line and a circle round its icon, the engine beside it (--tip) - then the frame opens (--open). After that
  // it only closes and opens again, the engine riding its edge; nothing leaves the screen. Both are registered in
  // css/live-aft.css with @property.
  function arrive(el, kind, at, dur, from) {
    var o = { delay: at, duration: dur, fill: 'both', easing: SOFT }, k;
    if (kind === 'drop') { k = [{ translate: from || '0 -160%', opacity: 0 }, { translate: '0 0', opacity: 1 }]; o.easing = BOUNCE; }
    else if (kind === 'fly') k = [{ translate: from, opacity: 0 }, { translate: '0 0', opacity: 1 }];
    else if (kind === 'spin') { k = [{ translate: from, rotate: '-200deg', opacity: 0 }, { translate: '0 0', rotate: '0deg', opacity: 1 }]; o.easing = BOUNCE; }
    else if (kind === 'pop') { k = [{ scale: '.4', opacity: 0 }, { scale: '1', opacity: 1 }]; o.easing = BOUNCE; }
    else if (kind === 'grow') { el.style.transformOrigin = '0 50%'; k = [{ scale: '0 1', opacity: .3 }, { scale: '1 1', opacity: 1 }]; }
    else if (kind === 'unfold') { k = [{ '--tip': 0, '--open': 0, opacity: 1 }, { '--tip': 1, '--open': 0, opacity: 1, offset: .4 },
                                       { '--tip': 1, '--open': 1, opacity: 1 }]; }
    else if (kind === 'draw') { k = [{ clipPath: 'inset(0 0 100% 0)', opacity: 1 }, { clipPath: 'inset(0 0 0% 0)', opacity: 1 }]; o.easing = EASE; }  // opacity: the piece starts hidden
    else k = [{ opacity: 0 }, { opacity: 1 }];
    return el.animate(k, o);
  }

  // its own rhythm, once it has arrived: short stays, long unhurried moves - most of each cycle is motion
  // its own rhythm, once it has arrived. The rest at home - the moment everything is together - is half what it was
  // (Larisa, 14.10); the time saved goes to the moves, so each cycle keeps its length.
  function cycle(el, kind, to, period, start, mode, skip) {
    var k, home = { translate: '0 0', opacity: 1 }, gone = { translate: to, opacity: 0 };
    var at = function (o, f) { return Object.assign({ offset: o }, f); };
    if (mode === 'route') { // it runs back into the pin, the pair leaves and returns, then it runs out again
      k = [{ clipPath: 'inset(0% 0 0% 0)', offset: 0 }, { clipPath: 'inset(0% 0 0% 0)', offset: .06 },
           { clipPath: 'inset(0% 0 100% 0)', offset: .26 }, { clipPath: 'inset(0% 0 100% 0)', offset: .62 },
           { clipPath: 'inset(0% 0 0% 0)', offset: .93 }, { clipPath: 'inset(0% 0 0% 0)', offset: 1 }];
    } else if (mode === 'pair') { // away only while the route is gone
      k = [at(0, home), at(.26, home), at(.38, gone), at(.48, gone), at(.6, home), at(1, home)];
    } else if (mode === 'bar') { // the bar shrinks away after its chip has left, and grows back before it returns
      k = [{ scale: '1 1', opacity: 1, offset: 0 }, { scale: '1 1', opacity: 1, offset: .3 }, { scale: '0 1', opacity: .3, offset: .42 },
           { scale: '0 1', opacity: 0, offset: .52 }, { scale: '1 1', opacity: 1, offset: .64 }, { scale: '1 1', opacity: 1, offset: 1 }];
    } else if (mode === 'unfold') { // its frame closes round its icon and opens again, in place
      // it never leaves the screen (Larisa, 18.10): only the frame closes and opens, the mark and the engine stay
      k = [{ '--open': 1, offset: 0 }, { '--open': 1, offset: .12 }, { '--open': 0, offset: .4 },
           { '--open': 0, offset: .55 }, { '--open': 1, offset: .85 }, { '--open': 1, offset: 1 }];
    } else if (mode === 'chip') {
      k = [at(0, home), at(.06, home), at(.28, gone), at(.66, gone), at(.94, home), at(1, home)];
    } else if (kind === 'spin') {
      k = [{ translate: '0 0', rotate: '0deg', opacity: 1, offset: 0 }, { translate: '0 0', rotate: '0deg', opacity: 1, offset: .1 },
           { translate: to, rotate: '200deg', opacity: 0, offset: .42 }, { translate: to, rotate: '-200deg', opacity: 0, offset: .52 },
           { translate: '0 0', rotate: '0deg', opacity: 1, offset: .9 }, { translate: '0 0', rotate: '0deg', opacity: 1, offset: 1 }];
    } else {
      k = [at(0, home), at(.1, home), at(.42, gone), at(.52, gone), at(.9, home), at(1, home)];
    }
    // The ease belongs to each move, not to the whole cycle: set on the options, it bent the cycle's clock itself -
    // the first part of every cycle crawled and the rest rushed, which is what held the picture still for seconds
    // after it gathered, whatever the offsets said. On the keyframes, each move eases and the clock stays even.
    k.forEach(function (f) { f.easing = EASE; });
    return el.animate(k, { delay: start, duration: period, iterations: Infinity, easing: 'linear', iterationStart: skip || 0 });
  }

  // the whole loop runs 5% slower than the numbers in PLAYS (Larisa, 14.10) - one place to tune the tempo
  var TEMPO = 1.05;

  function play(pic) {
    var spec = PLAYS[pic.dataset.play];
    if (!spec) return;
    spec = spec.map(function (s) {
      s = s.slice();
      s[2] *= TEMPO; s[3] *= TEMPO;
      if (s[5]) { s[5] *= TEMPO; s[6] = (s[6] || 0) * TEMPO; }
      return s;
    });
    stop(pic);
    pic._playing = true;
    // when the whole picture has gathered
    var gathered = spec.reduce(function (m, s) { return Math.max(m, s[2] + s[3]); }, 0);
    spec.forEach(function (s) {
      var el = pic.querySelector(s[0]);
      if (!el) return;
      pic._anims.push(arrive(el, s[1], s[2], s[3], s[4]));
      if (!s[5]) return;
      var start = s[6] || 0, skip = 0;
      if (QUICK_FIRST[pic.dataset.play]) {
        // the first leave moves halfway toward the moment of gathering; the cycle never starts before the
        // piece itself has arrived - it is entered part-way instead, so nothing jumps
        var hold = holdOf(s[1], s[7]) * s[5], leave = start + hold, landed = s[2] + s[3];
        // SOFT starts very slowly, so a piece that has "started" to leave still looks still for a good half of its
        // move - the first leaves are therefore set off a little before the last arrival lands. The eye then sees the
        // picture gather, hold for a beat, and part; never a long stop.
        var want = Math.max(landed, gathered - 500 + Math.max(0, leave - gathered) * 0.1);
        start = Math.max(landed, want - hold);
        skip = (hold - (want - start)) / s[5];
      }
      pic._anims.push(cycle(el, s[1], s[4], s[5], start, s[7], skip));
    });
  }
  function stop(pic) {
    (pic._anims || []).forEach(function (a) { a.cancel(); });
    pic._anims = [];
    pic._playing = false;
  }

  // The card floats and reveals itself, which nudges the picture across the threshold and back. Restarting on each
  // of those crossings played the arrival twice (everything snapped home, then flew in again). So: a picture that is
  // already playing is never restarted, and leaving only stops it after a grace period.
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var pic = e.target;
      if (e.isIntersecting) {
        clearTimeout(pic._leave);
        pic.classList.add('go');
        if (!pic._playing) play(pic);
      } else {
        clearTimeout(pic._leave);
        pic._leave = setTimeout(function () { pic.classList.remove('go'); stop(pic); }, 700);
      }
    });
  }, { threshold: 0.25 });
  // At rest every piece sits in place, fully drawn. The moment a play began, the arriving pieces dropped to their
  // start (gone, off to the side) and flew back - so they showed, vanished and came again, a visible jolt, most of
  // all on a large screen where the picture is seen before it starts. Pieces that a play brings in are hidden from
  // the outset instead (inline, so the animations still win), and only that play shows them. Pictures without a
  // play, and pieces not in one, are left as they are.
  Array.prototype.forEach.call(pics, function (p) {
    (PLAYS[p.dataset.play] || []).forEach(function (s) {
      var el = p.querySelector(s[0]);
      if (el) el.style.opacity = '0';
    });
    io.observe(p);
  });
  window.caseLivePlay = play; // the lab page's "Play again"
})();
