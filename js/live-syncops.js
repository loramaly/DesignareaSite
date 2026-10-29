/* The SyncOps live picture, built from the demo itself instead of cut screenshots (Larisa, 18.10).
   Fills every <div class="case-live cl-syncops cl-code" data-play="syncops">, the same on the cards and in the case:
   - the big screen in front is case-syncops/syncops-agent-demo.html?shot=jobs - the real dashboard, the issues
     (KPIs and the Jobs board), no map;
   - the window behind it is the same demo ?shot=map, framed on its Live Map card - the real map, its pins dropping
     and its routes drawing themselves again on a loop;
   - around them float the demo's own markers - its pin SVGs, its technicians' photos, its fire - set where the old
     image slices were, under the same class names, so js/case-live.js plays the same choreography. Load before it.
   data-demo gives the demo's address from the page (default: from a case folder). */
(function () {
  var DEMO_W = 1440, DEMO_H = 1024;
  // the Live Map card inside the demo at 1440 wide (px): the map window shows this much of it
  var MAP = { x: 79, y: 177, w: 897, h: 592 };

  function piece(cls, x, y, w, h, inner) {      // a box in picture units (1256 x 944)
    return '<div class="cl-s ' + cls + '" style="left:' + (x / 12.56).toFixed(3) + '%;top:' + (y / 9.44).toFixed(3) +
      '%;width:' + (w / 12.56).toFixed(3) + '%;aspect-ratio:' + (+w).toFixed(2) + '/' + (+h).toFixed(2) + '">' + inner + '</div>';
  }

  /* The route runs from the turquoise pin's own tip to the technician it is heading to (under the photo), so both
     ends sit exactly on their points. The pin's tip: its box (393,119 64x58), the SVG from 16% / 4%, 96% high;
     the file is 48x73 and the drop's tip is at (24, 51) in it. */
  var PH = 58 * .96, TIP = { x: 393 + 64 * .16 + PH * 48 / 73 * 24 / 48, y: 119 + 58 * .04 + PH * 51 / 73 };
  var TO = { x: 510 + 23, y: 284 + 23 };                       // the centre of the technician (cl-av-c)
  function route() {
    var x0 = TIP.x - 6, y0 = TIP.y - 6, w = TO.x - x0 + 6, h = TO.y - y0 + 6;
    var a = (TIP.x - x0).toFixed(1) + ' ' + (TIP.y - y0).toFixed(1), b = (TO.x - x0).toFixed(1) + ' ' + (TO.y - y0).toFixed(1);
    var d = 'M' + a + 'C' + (TIP.x - x0).toFixed(1) + ' ' + (h * .55).toFixed(1) + ' ' + (w * .45).toFixed(1) + ' ' + (h * .78).toFixed(1) + ' ' + b;
    return piece('cl-route', x0, y0, w, h, '<svg class="sy-route" viewBox="0 0 ' + w.toFixed(1) + ' ' + h.toFixed(1) + '">' +
      '<path class="glow" d="' + d + '"/><path d="' + d + '"/>' +
      '<circle cx="' + a.split(' ')[0] + '" cy="' + a.split(' ')[1] + '" r="3.5"/></svg>');
  }
  function pieces(A) {
    var pin = function (file) { return '<img class="sy-pin" src="' + A + 'Property%201=' + file + '.svg" alt="">'; };
    var ava = function (n) { return '<span class="sy-ava"><img src="' + A + 'Ellipse%20' + n + '.jpg" alt=""></span>'; };
    var bang = '<span class="sy-bang">!</span>';
    var face = function (n) { return '<span class="pav"><img src="' + A + 'Ellipse%20' + n + '.jpg" alt=""></span>'; };
    var star = '<svg viewBox="0 0 24 24"><path d="M12 2c.7 5.2 2.8 7.3 8 8-5.2.7-7.3 2.8-8 8-.7-5.2-2.8-7.3-8-8 5.2-.7 7.3-2.8 8-8z"/></svg>';
    return piece('cl-pin-grey', 500, 69, 56, 56, pin('pending') + bang) +
      piece('cl-pin-cyan', 393, 119, 64, 58, pin('enrouteHigh') + bang) +
      route() +
      piece('cl-av-a', 364, 226, 46, 46, ava('237%207')) +
      piece('cl-av-b', 298, 266, 46, 46, ava('237%208')) +
      piece('cl-av-c', 510, 284, 46, 46, ava('244%202')) +
      piece('cl-av-d', 798, 29, 46, 46, ava('237%2010')) +
      piece('cl-pin-blue', 881, 44, 64, 58, '<span class="sy-pill one">' + pin('inprogress') + '<span class="pbody">' + face('237%208') + '</span></span>') +
      piece('cl-pin-group', 1120, 255, 118, 74, '<span class="sy-pill">' + pin('inprogressUrgent') +
        '<span class="pbody">' + face('237%207') + face('244%202') + '</span><span class="sy-warn">!</span></span>') +
      piece('cl-spark-a', 888, 481, 30, 24, '<span class="sy-star">' + star + '</span>') +
      piece('cl-spark-b', 903, 505, 22, 22, '<span class="sy-star">' + star + '</span>') +
      piece('cl-fire', 849, 510, 33, 38, '<img class="sy-fire" src="' + A + 'fire.svg" alt="">');
  }

  Array.prototype.forEach.call(document.querySelectorAll('.case-live.cl-code[data-play="syncops"]'), function (el) {
    var src = el.getAttribute('data-demo') || '../case-syncops/syncops-agent-demo.html';
    var A = src.replace(/[^\/]*$/, '') + 'assets/';
    var frame = function (mode) {
      return '<iframe src="' + src + '?shot=' + mode + '" title="" tabindex="-1" aria-hidden="true" loading="lazy" ' +
        'style="width:' + DEMO_W + 'px;height:' + DEMO_H + 'px"></iframe>';
    };
    el.innerHTML = '<div class="cl-base sy-stage">' +
        '<div class="sy-win sy-map cl-drift-b">' + frame('map') + '</div>' +
        '<div class="sy-win sy-jobs cl-screen">' + frame('jobs') + '</div>' +
        '<div class="sy-float">' + pieces(A) + '</div>' +
      '</div>';
    var jobs = el.querySelector('.sy-jobs'), jf = jobs.querySelector('iframe');
    var map = el.querySelector('.sy-map'), mf = map.querySelector('iframe');
    var fit = function () {
      jf.style.transform = 'scale(' + (jobs.clientWidth / DEMO_W) + ')';
      var k = map.clientWidth / MAP.w;
      mf.style.transform = 'scale(' + k + ') translate(' + -MAP.x + 'px,' + -MAP.y + 'px)';
    };
    fit();
    if ('ResizeObserver' in window) new ResizeObserver(fit).observe(jobs);
  });
})();
