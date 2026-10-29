/* Case pages: the bottom edge of the screen bends the case like a sheet of paper (after raggededge.com).
   A picture that touches the band at the bottom of the screen is drawn whole in WebGL, and its <img> is hidden
   whole; once it leaves the band it goes back to plain HTML. A picture is never split between the two (a split
   left a seam, and its HTML half and WebGL half slipped apart while the hero pieces animate). The switch happens
   where the bend is under half a pixel, so it does not show. The sheet itself (.cs and its section backgrounds)
   is drawn too, but only where the bend pushes it past its own edges - its text and everything on it stay HTML.
   Rotated pictures (the Critera card fan), text, iframes and video are never bent.
   The curve, as on raggededge: x += (x*2-1) * -0.05*strength * (1-y)^distance  (y = 0 at the bottom).
   The canvas sits inside .case-shell, under the sticky chapter nav, and is clipped to the purple frame.
   Off on touch screens, for reduced motion, and with ?curve=0. ?curve=1 forces it on (for testing).
   To remove the effect: delete this file, js/vendor/lenis.min.js and their two <script> tags on each case page. */
(function () {
  var q = location.search;
  if (/[?&]curve=0/.test(q)) return;
  var forced = /[?&]curve=1/.test(q);
  if (!forced && (matchMedia('(pointer: coarse)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
  var shell = document.querySelector('.case-shell');   // the dark frame around the case; its side borders are the purple lines
  if (!shell) return;

  var me = document.currentScript;
  var STRENGTH = parseFloat(me && me.dataset.strength) || 1;
  var DISTANCE = parseFloat(me && me.dataset.distance) || 34;
  var BAND = 0.16;              // share of the screen at the bottom where the bend shows; above it, under half a pixel
  var RESERVE = 0.3;            // the canvas reaches this far below the screen (see the canvas note below)
  var HIDE = 'data-curve-clip';
  var HIDDEN = 'linear-gradient(transparent,transparent)';

  /* The canvas scrolls with the page (moved to the top of the screen on every frame) and reaches a reserve below
     the screen: if the page ever runs a frame ahead of the drawing (keyboard, scrollbar drag), the canvas moves
     with it instead of slipping against the pictures, and its bottom edge never lifts off the screen.
     It lives inside .case-shell with z-index 30: above the case, under the sticky chapter nav (35). */
  var canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;left:0;top:0;will-change:transform';
  var wrap = document.createElement('div');
  wrap.setAttribute('aria-hidden', 'true');
  wrap.style.cssText = 'position:absolute;top:0;bottom:0;left:0;overflow:hidden;pointer-events:none;z-index:30';
  wrap.appendChild(canvas);
  var opts = { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false };
  var gl = canvas.getContext('webgl2', opts) || canvas.getContext('webgl', opts);
  if (!gl) return;
  var GL2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
  var MAX_TEX = Math.min(4096, gl.getParameter(gl.MAX_TEXTURE_SIZE));   // pictures go up at their on-screen size

  /* ---------- shaders ---------- */
  var VS = 'uniform vec2 uRes;attribute vec2 p;uniform vec4 uRect;varying vec2 vPx;' +
    'void main(){vec2 px=uRect.xy+p*uRect.zw;vPx=px;gl_Position=vec4(px.x/uRes.x*2.-1.,1.-px.y/uRes.y*2.,0.,1.);}';
  // one picture: clip box (rounded), the drawn image box inside it (object-fit), a background colour, opacity.
  // The texture is read outside any if: inside a branch the GPU can pick a tiny mip level on the edge pixels,
  // which drew a flickering light line along the picture's edges.
  var FS_IMG = 'precision highp float;varying vec2 vPx;uniform sampler2D uTex;uniform vec4 uRect;uniform vec4 uImg;' +
    'uniform float uRad;uniform float uAlpha;uniform vec4 uBg;' +
    'void main(){vec2 c=uRect.xy+uRect.zw*.5;vec2 h=uRect.zw*.5;vec2 d=abs(vPx-c)-h+uRad;' +
    'float sd=length(max(d,0.))+min(max(d.x,d.y),0.)-uRad;float m=clamp(.5-sd,0.,1.);' +
    'vec2 uv=(vPx-uImg.xy)/uImg.zw;vec4 t=texture2D(uTex,clamp(uv,0.,1.));' +
    'float inside=step(0.,uv.x)*step(uv.x,1.)*step(0.,uv.y)*step(uv.y,1.);' +
    // a soft shadow baked into a file is cut off at the file's edge; bent, that cut would read as a stripe,
    // so translucent pixels fade out over the last 16px at the left and right edges (solid ones stay as they are)
    'float dx=min(vPx.x-uImg.x,uImg.x+uImg.z-vPx.x);t*=inside*mix(smoothstep(0.,16.,dx),1.,step(.5,t.a));' +
    'gl_FragColor=(t+uBg*(1.-t.a))*m*uAlpha;}';
  // one piece of the sheet: a rounded box filled with a colour, or a top-to-bottom gradient
  var FS_FILL = 'precision highp float;varying vec2 vPx;uniform vec4 uRect;uniform float uRad;uniform vec4 uC1;uniform vec4 uC2;' +
    'void main(){vec2 c=uRect.xy+uRect.zw*.5;vec2 h=uRect.zw*.5;vec2 d=abs(vPx-c)-h+uRad;' +
    'float sd=length(max(d,0.))+min(max(d.x,d.y),0.)-uRad;float m=clamp(.5-sd,0.,1.);' +
    'gl_FragColor=mix(uC1,uC2,clamp((vPx.y-uRect.y)/uRect.w,0.,1.))*m;}';
  var VS_FULL = 'attribute vec2 p;varying vec2 vUv;void main(){vUv=p;gl_Position=vec4(p*2.-1.,0.,1.);}';
  // the bend. The sheet shows only where it reaches past its own flat edges (the HTML sheet and its text stay
  // underneath, untouched); the pictures show whole, on top.
  var FS_CURVE = 'precision highp float;varying vec2 vUv;uniform sampler2D uImgs;uniform sampler2D uSheet;' +
    'uniform float uCH;uniform float uVH;uniform float uStr;uniform float uDist;uniform vec2 uClip;' +
    // y: height above the bottom of the screen, as a share of the screen. Under the screen (y < 0) the same curve
    // keeps going outward, so the tip stays pointed even when the page runs a few px ahead
    'void main(){vec2 uv=vUv;float y=(uVH-(1.-vUv.y)*uCH)/uVH;' +
    'uv.x+=(uv.x*2.-1.)*(uStr*-.05)*min(pow(max(1.-y,0.),uDist),4.);' +
    'if(vUv.x<uClip.x||vUv.x>uClip.y||uv.x<0.||uv.x>1.){gl_FragColor=vec4(0.);return;}' +
    'vec4 i=texture2D(uImgs,uv);vec4 s=texture2D(uSheet,uv)*(1.-texture2D(uSheet,vUv).a);' +
    'gl_FragColor=i+s*(1.-i.a);}';

  function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
  function prog(vs, fs) {
    var p = gl.createProgram(); gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(p, 0, 'p'); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    var u = {}, n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) { var a = gl.getActiveUniform(p, i); u[a.name] = gl.getUniformLocation(p, a.name); }
    return { p: p, u: u };
  }
  var P_IMG, P_FILL, P_CURVE;
  try { P_IMG = prog(VS, FS_IMG); P_FILL = prog(VS, FS_FILL); P_CURVE = prog(VS_FULL, FS_CURVE); } catch (e) { return; }

  var quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  // drawn flat into two targets first (the sheet, the pictures), then bent onto the screen in one pass
  var fbo = gl.createFramebuffer(), fboTex = gl.createTexture();
  var sfbo = gl.createFramebuffer(), sfboTex = gl.createTexture();
  function tex(t, min) {
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, min);
  }

  /* ---------- size ---------- */
  var W = 0, VH = 0, CH = 0, dpr = 1, base = 0;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    VH = window.innerHeight;
    W = document.documentElement.clientWidth;
    CH = VH + Math.ceil(VH * RESERVE);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(CH * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = CH + 'px';
    [[fbo, fboTex], [sfbo, sfboTex]].forEach(function (f) {
      tex(f[1], gl.LINEAR);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, canvas.width, canvas.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, f[0]);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, f[1], 0);
    });
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    items.forEach(function (it) { setClip(it, ''); it.static = null; dropTex(it); });
    // the wrapper spans the whole screen width, starting at the screen's left edge
    var sr = shell.getBoundingClientRect(), ss = getComputedStyle(shell);
    wrap.style.left = -(sr.left + parseFloat(ss.borderLeftWidth)) + 'px';
    wrap.style.width = W + 'px';
    canvas.style.transform = 'none';
    base = wrap.getBoundingClientRect().top + window.scrollY;     // where the wrapper's top sits in the page
    collectFills();
  }

  /* ---------- the sheet ---------- */
  // the white case sheet (.cs) and every section background laid across its full width, in paint order
  var fills = [];
  function collectFills() {
    var all = [], widest = 0;
    Array.prototype.forEach.call(shell.querySelectorAll('*'), function (el) {
      if (el.closest(SKIP)) return;
      var s = getComputedStyle(el);
      if (s.position === 'fixed' || s.backgroundClip === 'text' || s.webkitBackgroundClip === 'text') return;
      var c = fillColours(s); if (!c) return;
      var w = el.offsetWidth; if (w < W * 0.4) return;
      all.push({ el: el, w: w, c1: c[0], c2: c[1], rad: parseFloat(s.borderBottomLeftRadius) || 0 });
      if (w > widest) widest = w;
    });
    fills = all.filter(function (f) { return f.w >= widest * 0.97; });
  }
  function fillColours(s) {
    var bg = rgba(s.backgroundColor), g = s.backgroundImage, c1 = bg, c2 = bg;
    if (g && g.indexOf('linear-gradient') === 0 && !/linear-gradient\((to (left|right)|9\d?deg|270deg)/.test(g)) {
      var cols = g.match(/rgba?\([^)]*\)/g);
      if (cols && cols.length > 1) { c1 = over(rgba(cols[0]), bg); c2 = over(rgba(cols[cols.length - 1]), bg); }
    }
    return (c1[3] > 0.004 || c2[3] > 0.004) ? [c1, c2] : null;
  }
  function over(a, b) { return [a[0] + b[0] * (1 - a[3]), a[1] + b[1] * (1 - a[3]), a[2] + b[2] * (1 - a[3]), a[3] + b[3] * (1 - a[3])]; }

  // At the bottom edge the bend stretches the band by 1/(1-2k) around the middle (k = 0.05 * strength). Where the
  // margin between the sheet and the purple frame is narrow, full strength would push the sheet's pointed tip past
  // the frame line, and it would have to be cut flat. So k is lowered just enough that the tip ends 4px inside it.
  function strengthFor(fr, bl, br) {
    var sheetEl = fills.length ? fills[0].el : null;
    if (!sheetEl) return STRENGTH;
    var sr = sheetEl.getBoundingClientRect();
    var gapL = sr.left / W, tL = (fr.left + bl + 4) / W;
    var gapR = 1 - sr.right / W, tR = 1 - (fr.right - br - 4) / W;
    var k = 0.05 * STRENGTH;
    [[gapL, tL], [gapR, tR]].forEach(function (g) {
      k = g[0] > g[1] ? Math.min(k, (g[0] - g[1]) / (1 - 2 * g[1])) : 0;
    });
    return Math.max(k, 0) / 0.05;
  }

  /* ---------- the pictures ---------- */
  var items = [];
  if (forced) window.__curve = items;   // for testing only
  var SKIP = 'header, nav, footer, .case-head, .cs-lightbox, .chat, [data-no-curve]';
  function collect() {
    Array.prototype.forEach.call(shell.querySelectorAll('img'), function (img) {
      if (img.closest(SKIP)) return;
      items.push({ el: img, tex: null, static: null, clip: '' });
    });
  }

  // what does not change while scrolling: masks, clipping ancestors, radius, fit - read again on resize
  function readStatic(it) {
    var el = it.el, cs = getComputedStyle(el), clips = [], chain = [], masked = false;
    for (var a = el.parentElement; a && a !== shell; a = a.parentElement) {
      var s = getComputedStyle(a);
      if ((s.maskImage && s.maskImage !== 'none') || (s.webkitMaskImage && s.webkitMaskImage !== 'none') ||
          (s.clipPath && s.clipPath !== 'none') || s.mixBlendMode !== 'normal' || (s.filter && s.filter !== 'none')) masked = true;
      if (s.overflowX !== 'visible' || s.overflowY !== 'visible') clips.push(a);
      chain.push(a);
    }
    var pos = cs.objectPosition.split(' ');
    it.static = {
      ok: !masked && cs.mixBlendMode === 'normal' && cs.filter === 'none' && (!cs.maskImage || cs.maskImage === 'none') &&
          (!cs.clipPath || cs.clipPath === 'none'),
      clips: clips,
      chain: chain,
      rad: parseFloat(cs.borderTopLeftRadius) || 0,
      // an SVG keeps its own proportions inside a box of any shape (preserveAspectRatio), so "fill" acts as "contain"
      fit: (cs.objectFit === 'fill' && /\.svg(\?|$)/i.test(el.currentSrc || el.src)) ? 'contain' : cs.objectFit,
      px: pos[0] || '50%', py: pos[1] || '50%',
      pad: [parseFloat(cs.paddingTop) + parseFloat(cs.borderTopWidth), parseFloat(cs.paddingRight) + parseFloat(cs.borderRightWidth),
            parseFloat(cs.paddingBottom) + parseFloat(cs.borderBottomWidth), parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth)],
      bg: rgba(cs.backgroundColor)
    };
  }
  function rgba(c) {
    var m = c.match(/[\d.]+/g); if (!m) return [0, 0, 0, 0];
    var a = m.length > 3 ? +m[3] : 1;
    return [m[0] / 255 * a, m[1] / 255 * a, m[2] / 255 * a, a];   // premultiplied
  }
  function offs(v, free) { return v.indexOf('%') > -1 ? free * parseFloat(v) / 100 : parseFloat(v) || 0; }

  // live state, read every frame: the opacity it is shown at, and whether it (or a parent) is rotated right now -
  // a rotated picture (the Critera card fan) cannot be drawn as an upright box, so it stays plain HTML
  function rotated(s) {
    if (s.rotate && s.rotate !== 'none' && s.rotate !== '0deg') return true;
    var t = s.transform;
    if (!t || t === 'none') return false;
    var n = t.match(/-?[\d.e]+/g).map(Number);
    return t.indexOf('matrix3d') === 0 ? (Math.abs(n[1]) > 1e-3 || Math.abs(n[4]) > 1e-3)
                                       : (Math.abs(n[1]) > 1e-3 || Math.abs(n[2]) > 1e-3);
  }
  function live(it) {
    var s = getComputedStyle(it.el);
    if (s.visibility === 'hidden' || rotated(s)) return 0;
    var o = +s.opacity, chain = it.static.chain;
    for (var i = 0; i < chain.length && o > 0; i++) {
      var ps = getComputedStyle(chain[i]);
      if (rotated(ps)) return 0;
      o *= +ps.opacity;
    }
    return o;
  }

  function upload(it, cssW) {
    var img = it.el;
    if (!img.complete || !img.naturalWidth) return false;
    var w = Math.min(MAX_TEX, Math.round(cssW * dpr)), nw = img.naturalWidth, nh = img.naturalHeight;
    if (w > nw) w = nw;
    var h = Math.max(1, Math.round(w * nh / nw));
    if (h > MAX_TEX) { w = Math.max(1, Math.round(w * MAX_TEX / h)); h = MAX_TEX; }
    try {
      var src = img;
      if (w !== nw || h !== nh || /\.svg(\?|$)/i.test(img.currentSrc || img.src)) {
        src = document.createElement('canvas'); src.width = w; src.height = h;
        var c2 = src.getContext('2d'); c2.imageSmoothingQuality = 'high';
        c2.drawImage(img, 0, 0, w, h);
      }
      var t = gl.createTexture();
      var pot = !(w & (w - 1)) && !(h & (h - 1));
      tex(t, (GL2 || pot) ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
      if (GL2 || pot) gl.generateMipmap(gl.TEXTURE_2D);
      it.tex = t;
      return true;
    } catch (e) { it.bad = true; return false; }   // a tainted or broken image stays plain HTML
  }
  function dropTex(it) { if (it.tex) { gl.deleteTexture(it.tex); it.tex = null; } }

  // hides the whole <img> while WebGL draws it (a mask, so its layout, opacity and clicks stay as they are)
  function setClip(it, v) {
    if (it.clip === v) return;
    it.clip = v;
    var st = it.el.style;
    st.webkitMaskImage = st.maskImage = v;
    if (v) it.el.setAttribute(HIDE, ''); else it.el.removeAttribute(HIDE);
  }

  /* ---------- frame ---------- */
  var drewLast = false;
  function frame(t) {
    requestAnimationFrame(frame);
    if (lenis) {
      // the lightbox and the menu lock the page with overflow:hidden - the wheel must not scroll it behind them
      var locked = document.body.style.overflow === 'hidden' || document.body.classList.contains('has-modal');
      if (locked !== lenis.isStopped) { if (locked) lenis.stop(); else lenis.start(); }
      lenis.raf(t);
    }
    draw();
  }

  /* ---------- the scroll itself ----------
     Why raggededge has no stray tips: their whole scroll runs through Lenis, in the same frame as the drawing.
     A native scroll is moved by the browser on its own thread (at 120 frames a second on a Mac), ahead of any
     script - the bend trails it by a frame and the eye sees two tips. Here too, then: Lenis moves the page, and
     the band is drawn right after it, in the same frame. It comes and goes with the effect (?curve=0 = both off). */
  var lenis = null;
  function startLenis() {
    if (typeof Lenis !== 'function') return;
    var css = document.createElement('style');
    css.textContent =
      'html.lenis{scroll-behavior:auto!important}html.lenis,html.lenis body{height:auto}' +
      '.lenis:not(.lenis-autoToggle).lenis-stopped{overflow:clip}' +
      '.lenis [data-lenis-prevent]{overscroll-behavior:contain}.lenis.lenis-smooth iframe{pointer-events:none}';
    document.head.appendChild(css);
    lenis = new Lenis({ autoRaf: false, allowNestedScroll: true, anchors: false });
    if (forced) window.__lenis = lenis;   // for testing only
    // the chapter nav and "back to top" ask for a smooth native scroll - hand those to Lenis, so they stay in step too
    // (the arguments are passed on as they came: scrollTo(obj, undefined) would mean "scroll to 0,0")
    var nativeScrollTo = window.scrollTo;
    window.scrollTo = function (a) {
      if (a && typeof a === 'object' && a.behavior === 'smooth' && lenis && !lenis.isStopped) {
        lenis.scrollTo(a.top != null ? a.top : window.scrollY);
        return;
      }
      return nativeScrollTo.apply(window, arguments);
    };
  }

  if (forced) window.__curveDraw = function () { draw(); };   // for testing only
  function draw() {
    var band = VH * (1 - BAND), draws = [];
    canvas.style.transform = 'translate3d(0,' + (window.scrollY - base) + 'px,0)';

    for (var i = 0; i < items.length; i++) {
      var it = items[i];
      if (it.bad) continue;
      var r = it.el.getBoundingClientRect();
      // keep textures only for pictures near the bottom of the screen; free the rest
      if (r.bottom < band - VH || r.top > VH * 2.5 || !r.width) { dropTex(it); setClip(it, ''); continue; }
      // only a picture that touches the band goes to WebGL - whole
      if (r.bottom <= band || r.top >= CH) { setClip(it, ''); continue; }
      if (!it.static) readStatic(it);
      var st = it.static;
      if (!st.ok) { setClip(it, ''); continue; }
      var a = live(it);
      if (a <= 0.004) { setClip(it, ''); continue; }
      if (!it.tex && !upload(it, r.width)) { setClip(it, ''); continue; }

      // content box, then the clipping ancestors
      var ow = it.el.offsetWidth || r.width, oh = it.el.offsetHeight || r.height;
      var sx = r.width / ow, sy = r.height / oh;
      var cx = r.left + st.pad[3] * sx, cy = r.top + st.pad[0] * sy;
      var cw = r.width - (st.pad[1] + st.pad[3]) * sx, ch = r.height - (st.pad[0] + st.pad[2]) * sy;
      var x0 = cx, y0 = cy, x1 = cx + cw, y1 = cy + ch;
      for (var k = 0; k < st.clips.length; k++) {
        var cr = st.clips[k].getBoundingClientRect();
        x0 = Math.max(x0, cr.left); y0 = Math.max(y0, cr.top); x1 = Math.min(x1, cr.right); y1 = Math.min(y1, cr.bottom);
      }
      if (x1 <= x0 || y1 <= Math.max(y0, band)) { setClip(it, ''); continue; }

      // the image inside the content box (object-fit / object-position)
      var nw = it.el.naturalWidth, nh = it.el.naturalHeight, iw = cw, ih = ch;
      if (st.fit === 'contain' || st.fit === 'cover' || st.fit === 'scale-down') {
        var sc = st.fit === 'cover' ? Math.max(cw / nw, ch / nh) : Math.min(cw / nw, ch / nh);
        if (st.fit === 'scale-down') sc = Math.min(sc, sx);
        iw = nw * sc; ih = nh * sc;
      } else if (st.fit === 'none') { iw = nw * sx; ih = nh * sy; }
      var ix = cx + offs(st.px, cw - iw), iy = cy + offs(st.py, ch - ih);

      setClip(it, HIDDEN);
      draws.push([it, x0, y0, x1 - x0, y1 - y0, ix, iy, iw, ih, st.rad * Math.min(sx, sy), a, st.bg]);
    }

    // the sheet only matters where it bends: the band and the reserve under the screen
    var sheet = [];
    for (var f = 0; f < fills.length; f++) {
      var fr = fills[f].el.getBoundingClientRect();
      if (fr.bottom > band && fr.top < CH && fr.width) sheet.push([fills[f], fr]);
    }

    if (!draws.length && !sheet.length) {
      if (drewLast) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); drewLast = false;
      }
      return;
    }
    drewLast = true;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    // 1a. the sheet, flat
    gl.bindFramebuffer(gl.FRAMEBUFFER, sfbo);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(P_FILL.p);
    gl.uniform2f(P_FILL.u.uRes, W, CH);
    for (var g = 0; g < sheet.length; g++) {
      var sf = sheet[g][0], sr = sheet[g][1];
      gl.uniform4f(P_FILL.u.uRect, sr.left, sr.top, sr.width, sr.height);
      gl.uniform1f(P_FILL.u.uRad, sf.rad);
      gl.uniform4f(P_FILL.u.uC1, sf.c1[0], sf.c1[1], sf.c1[2], sf.c1[3]);
      gl.uniform4f(P_FILL.u.uC2, sf.c2[0], sf.c2[1], sf.c2[2], sf.c2[3]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    // 1b. the pictures, flat
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(P_IMG.p);
    var u = P_IMG.u;
    gl.uniform2f(u.uRes, W, CH);
    gl.activeTexture(gl.TEXTURE0); gl.uniform1i(u.uTex, 0);
    for (var j = 0; j < draws.length; j++) {
      var d = draws[j];
      gl.bindTexture(gl.TEXTURE_2D, d[0].tex);
      gl.uniform4f(u.uRect, d[1], d[2], d[3], d[4]);
      gl.uniform4f(u.uImg, d[5], d[6], d[7], d[8]);
      gl.uniform1f(u.uRad, d[9]);
      gl.uniform1f(u.uAlpha, d[10]);
      gl.uniform4f(u.uBg, d[11][0], d[11][1], d[11][2], d[11][3]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    // 2. bent onto the screen, clipped to the inside of the purple frame
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.disable(gl.BLEND);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(P_CURVE.p);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, sfboTex);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, fboTex);
    gl.uniform1i(P_CURVE.u.uImgs, 0);
    gl.uniform1i(P_CURVE.u.uSheet, 1);
    gl.uniform1f(P_CURVE.u.uCH, CH);
    gl.uniform1f(P_CURVE.u.uVH, VH);
    var fl = shell.getBoundingClientRect(), fcs = getComputedStyle(shell);
    var bl = parseFloat(fcs.borderLeftWidth), br = parseFloat(fcs.borderRightWidth);
    gl.uniform2f(P_CURVE.u.uClip, (fl.left + bl) / W, (fl.right - br) / W);
    gl.uniform1f(P_CURVE.u.uStr, strengthFor(fl, bl, br));
    gl.uniform1f(P_CURVE.u.uDist, DISTANCE);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  function start() {
    collect();
    if (!items.length) return;
    shell.appendChild(wrap);
    startLenis();
    resize();
    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(resize, 120); });
    canvas.addEventListener('webglcontextlost', function (e) {
      e.preventDefault(); items.forEach(function (it) { setClip(it, ''); it.tex = null; it.bad = true; });
    });
    requestAnimationFrame(frame);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
