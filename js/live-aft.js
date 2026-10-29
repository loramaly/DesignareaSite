/* The AFT live picture, built from the demo itself instead of cut screenshots (Larisa, 18.10).
   Fills every <div class="case-live cl-aft cl-code" data-play="aft">:
   - the window is case-aft/aft-agent-demo.html?shot - the real demo, as a picture (no demo bar, no clicks),
     scaled to the window's box. It looks like the demo because it is the demo.
   - the floating pieces are the demo's own chip / Missing Approvals pill / milestone / bars, with its markup,
     icons and CSS (css/live-aft.css), set where the old image slices were, under the same class names - so
     js/case-live.js plays the same choreography on them, unchanged. This file must load before it.
   Paths: data-demo on the picture gives the demo's address from the page (default: the case folder's sibling). */
(function () {
  // the demo's own icons (case-aft/aft-agent-demo.html, IC)
  var IC = {
    doc: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    chart: '<svg viewBox="0 0 24 24"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>',
    pen: '<svg viewBox="0 0 24 24"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>',
    spark: '<svg viewBox="0 0 24 24"><path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2L12 3z"/></svg>',
    octagon: '<svg viewBox="0 0 16 16"><path d="M5.24 1.333h5.52l3.907 3.907v5.52L10.76 14.667H5.24L1.333 10.76V5.24z"/><path d="M8 5.333V8"/><path d="M8 10.667h.007"/></svg>'
  };
  function chip(icon, text) {
    return '<span class="ad-chip"><span class="cic">' + IC[icon] + '</span>' + text + '</span>';
  }
  /* The floating layer keeps the composition of the original picture (its gaps from the window, the long line
     falling from the end of the top bar), drawn in picture units with the demo's own pieces - every connector
     starts at the end of its bar and lands on the next, the diamond sits on the line, and the Missing Approvals
     arrow points at it. Each piece keeps the class name the animation knows it by. */
  function piece(cls, x0, y0, x1, y1, inner) {     // a box in picture units (1256 x 840)
    var w = x1 - x0, h = y1 - y0;
    return '<div class="cl-s ' + cls + '" style="left:' + (x0 / 12.56).toFixed(3) + '%;top:' + (y0 / 8.4).toFixed(3) +
      '%;width:' + (w / 12.56).toFixed(3) + '%;aspect-ratio:' + w.toFixed(2) + '/' + h.toFixed(2) + '">' + inner + '</div>';
  }
  function link(cls, d, x0, y0, x1, y1) {          // a connector: its path in picture units, its box padded for the stroke
    var p = 2;
    return piece(cls, x0 - p, y0 - p, x1 + p, y1 + p,
      '<svg class="ad-link" viewBox="' + (x0 - p) + ' ' + (y0 - p) + ' ' + (x1 - x0 + 2 * p) + ' ' + (y1 - y0 + 2 * p) + '"><path d="' + d + '"/></svg>');
  }
  // the long line: from the end of the top bar (917,53) down a straight slant (934,78)->(884,330) into the first
  // grey step (912,354). At y 205 (the Signatures row) it is at x 909, at y 301 at x 890.
  function lineX(y) { return 934 - 50 * (y - 78) / 252; }
  function pieces() {
    var pillTip = lineX(205.5), dia = lineX(301);
    return piece('cl-bar-main', 488, 46, 917, 60, '<span class="ad-bar phasebar"></span>') +
      link('cl-line', 'M911 53C931 53 936 62 934 78L884 330C881 348 890 354 914 354', 881, 51, 937, 356) +
      piece('cl-bar-44', 488, 97, 584, 111, '<span class="ad-bar lite"></span>') +
      piece('cl-chip-44', 502, 82, 556, 104, chip('doc', '4/4')) +
      piece('cl-bar-77', 588, 145, 744, 159, '<span class="ad-bar lite"></span>') +
      piece('cl-chip-77', 602, 130, 654, 152, chip('chart', '7/7')) +
      piece('cl-bar-1524', 744, 198, 898, 213, '<span class="ad-bar sig-grad"></span>') +
      piece('cl-chip-1524', 757, 183, 822, 205, chip('pen', '15/24')) +
      // the pill's arrow tip (9.5 units left of the pill at this size) lands on the line
      // the pill and its engine are one piece: the engine rides the pill's right edge as it opens and closes
      piece('cl-missing', pillTip + 9.5, 187.5, pillTip + 9.5 + 190, 223.5, '<span class="ad-mgrp"><span class="ad-tip"></span>' +
        '<span class="ad-pill">' + IC.octagon + '<span class="ad-ptxt">Missing Approvals</span></span>' +
        '<span class="ad-spark">' + IC.spark + '</span></span>') +
      piece('cl-diamond', dia - 10, 291, dia + 10, 311, '<span class="ad-ms"><span class="mi">!</span></span>') +
      piece('cl-bar-2', 912, 347, 1026, 361, '<span class="ad-bar ghost"></span>') +
      link('cl-tail-a', 'M1026 354C1034 354 1036 360 1034 368L1030 392C1028 401 1031 406 1036 406', 1026, 352, 1037, 408) +
      piece('cl-bar-3', 1036, 399, 1146, 413, '<span class="ad-bar ghost"></span>') +
      link('cl-tail-b', 'M1146 406C1154 406 1156 412 1154 420L1149 452', 1146, 404, 1157, 454);
  }

  /* The Magic Pro card of the case hero: the demo's suggestion, its markup and rules (css/live-aft.css, .ad-mp) */
  var CHEV = '<svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>';
  function magic() {
    var why = ['15 / 24 signatures received - 9 pending', 'Signature pace slowed 40% vs plan', 'Board Approval depends on completion'];
    return '<div class="ad-mp">' +
      '<div class="mp-head"><span class="mp-title">' + IC.spark + 'Magic Pro</span><span class="mp-badge">SUGGESTION</span>' +
        '<span class="mp-close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></span></div>' +
      '<div class="mp-body">' +
        '<p class="mp-headline">9 of 24 signatures outstanding - send reminders to the 9 pending users before Board Approval (Feb 12).</p>' +
        '<div class="mp-h">Why?</div><ul class="mp-why">' + why.map(function (w) { return '<li>' + CHEV + '<span>' + w + '</span></li>'; }).join('') + '</ul>' +
        '<div class="mp-h">If Ignored?</div><p class="mp-p">Projected 6-day delay to the Closing phase.</p>' +
        '<div class="mp-actions"><span class="btn-cta">Approve &amp; Send</span><span class="btn-ghost">Edit</span></div>' +
        '<div class="mp-guard"><div class="g-title">No external action is taken without your approval.</div>' +
          '<div class="g-row"><span class="g-box"></span><span>Make this a rule: always send reminders when a milestone is 5 days away</span></div>' +
          '<div class="manage">Manage rules ' + CHEV + '</div></div>' +
      '</div></div>';
  }

  var DEMO_W = 1440, DEMO_H = 1024;     // the demo runs at this size; the window shows all of it
  Array.prototype.forEach.call(document.querySelectorAll('.case-live.cl-code[data-play^="aft"]'), function (el) {
    var src = el.getAttribute('data-demo') || '../case-aft/aft-agent-demo.html';
    var hero = el.getAttribute('data-variant') === 'hero';
    // the window, and the drawing above it, each float on their own (weightless, never still)
    var card = '<div class="ad-win cl-screen">' +
        '<iframe src="' + src + '?shot" title="" tabindex="-1" aria-hidden="true" loading="lazy" ' +
        'style="width:' + DEMO_W + 'px;height:' + DEMO_H + 'px"></iframe></div>' +
      '<div class="ad-float">' + pieces() + '</div>';
    el.innerHTML = hero
      // the case hero: the same picture, a little larger and to the left, and the Magic Pro card beside it
      ? '<div class="cl-base ad-stage ad-hero"><div class="ad-card">' + card + '</div>' +
        '<div class="cl-s cl-magic" style="left:71.4%;top:47.4%;width:26.5%">' + magic() + '</div></div>'
      : '<div class="cl-base ad-stage">' + card + '</div>';
    var win = el.querySelector('.ad-win'), f = win.querySelector('iframe');
    var fit = function () { f.style.transform = 'scale(' + (win.clientWidth / DEMO_W) + ')'; };
    fit();
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(win);
  });
})();
