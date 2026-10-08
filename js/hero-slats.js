/* Hero "prismatic slats" - the living glass band behind the index hero.
   Vertical glass flutes over a soft light field: two lights and a lilac spark
   loop over the portrait on their own, the pointer lights the glass up, and the
   band breathes in length. Dark: the light adds onto the page. Light: the same
   field is laid down as thin pastel washes with a white fade at the top.
   index.html uses data-preset="tech". The tuning pages (every knob, with a
   panel) live in design-lab/ - not part of the site.
   Removable: this file, the <canvas class="slats-fx"> in index.html and the
   "hero slats" block in css/styles.css. Without WebGL the canvas removes
   itself and the static texture stays. */
(function () {
  const canvas = document.querySelector('.slats-fx');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: false, alpha: true });
  if (!gl) { canvas.remove(); return; }

  /* "Reduce motion" used to freeze this to one frame, which read as broken -
     the light only woke up under the pointer. The idle drift is slow and
     small, so it keeps running there too, at half speed. */
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches ? .5 : 1;

  /* every knob the tune panel can touch */
  const P = {
    angle: 26,       // slat tilt, degrees
    flutes: 13,      // slats across the width
    refraction: 2.6, // how far each flute bends the light
    aberration: 0.35,
    highlight: 0.22, // sheen on the leading edge of each flute
    line: 0.05,      // the thin technical line between flutes
    intensity: 0.9,  // overall light
    pointer: 0.9,    // how much the cursor lights things up
    pointerDark: 1,  // dark theme only: extra glow where the pointer passes
    pointerRight: 0, // dark theme only: how much quieter the pointer is over the text on the right
    speed: 1.0,      // ambient drift
    grain: 0.02,
    fade: 0.42,      // share of the band height that fades out at the bottom
    c1: '#5227FF',
    c2: '#7A3CFF',
    c3: '#C55CFF',   // the spark: a warmer, redder lilac for depth
    spark: 0,        // a small bright light circling faster, the other way
    gap: 0,          // light seeping down into the gap between the portrait and the chat
    gapX: 0.37,      // where that gap sits (share of the width)
    lightAmt: 0.55,
    topWhite: 0.7,   // light theme: a white fade from the top edge down to nothing  // light theme: how much colour the washes lay down (capped low)
    c1L: '#7D8BFF',  // light theme: violet leaning blue
    c2L: '#B08CFF',  // light theme: lilac
    c3L: '#EB8CFF',  // light theme: violet leaning red - the spark
    shape: 0,        // 0 = round glass flutes, 1 = sharp prism ramps (like the static texture)
    fluteW: 0,       // flute width in px; 0 = use the flutes count
    reach: 1,        // how far down the band the flutes go (share of height)
    lift: 0,         // pull the ambient light toward the top edge
    shimmer: 0,      // flutes brighten and dim on their own, slowly
    sweep: 0,        // a soft wave of light that crosses the flutes on its own
    rightSoft: 0,    // how much quieter the right side is than the left
    tilt: 0,         // bottom edge slant: the right end stops this much higher
    flow: 0,         // idle life: strength of the light from above
    idle: 1,         // 1 = breathe (light from the top edge goes deeper and back), 2 = scan (a soft band slides down)
    leftFade: 0,     // fade-in width at the left edge, so the logo stays clean
    rightFade: 0,    // fade-out width at the right edge, so no flute line shows past the frame
    glint: 0,        // a layer ON TOP of the glass: a gleam that crosses the flutes by itself
    breathe: 0,      // idle life with no extra light: the band reaches lower, then pulls back up
    ghost: 0,        // a light that loops on its own over the left side (above the portrait),
                     // an invitation to hover; it steps aside while the real pointer moves
  };
  /* preset 2: the static index texture brought to life - vertical, narrow,
     sharp, short, quiet */
  if (canvas.dataset.preset === 'tech') Object.assign(P, {
    angle: 0, fluteW: 62.7, refraction: 1.4, aberration: 0.2, highlight: 0.1,
    line: 0.02, intensity: 0.45, pointer: 1.4, pointerDark: 1.8, pointerRight: 0.4, speed: 1.0, grain: 0.012,
    fade: 0.7, shape: 1, reach: 0.66, lift: 0.7, shimmer: 0,
    sweep: 0, rightSoft: 0.6, tilt: 0.28, flow: 0, leftFade: 0.14, rightFade: 0.12, idle: 1, glint: 0, breathe: 0.3, ghost: 1.8, spark: 1.3, gap: 1.07,
  });

  const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const FS = `
precision highp float;
uniform vec2 uRes;uniform float uTime;
uniform vec2 uMouse;uniform vec2 uGhost;uniform vec2 uGhost2;uniform float uGhostE;uniform float uGhostE2;uniform vec2 uGhost3;uniform float uGhostE3;uniform vec3 uC3;uniform float uRightFade;uniform float uGap,uGapX,uLightMode,uLightAmt,uTopWhite;uniform vec2 uTrail[4];uniform float uEnergy;
uniform vec3 uC1;uniform vec3 uC2;
uniform float uAngle,uFlutes,uRefr,uAberr,uHi,uLine,uInt,uGrain,uFade,uDpr;
uniform float uShape,uFluteW,uReach,uLift,uShimmer,uSweep,uRightSoft,uTilt,uFlow,uLeftFade,uIdle,uGlint,uBreathe;

float blob(vec2 p,vec2 c,float r){vec2 d=(p-c)/r;return exp(-dot(d,d));}

vec3 field(vec2 p){
  float t=uTime;float s=max(uRes.x,uRes.y);
  float ly=1.-uLift*.75;
  vec2 a=uRes*vec2(.16+.10*sin(t*.050),(.30+.18*sin(t*.037+1.))*ly);
  vec2 b=uRes*vec2(.80+.07*sin(t*.043+2.),(.22+.14*cos(t*.031))*ly);
  vec2 c=uRes*vec2(.50+.28*sin(t*.021+4.),(.55+.12*sin(t*.057))*ly);
  vec3 col=uC1*blob(p,a,s*.15)*.6
          +uC2*blob(p,b,s*.12)*.5
          +mix(uC1,uC2,.5)*blob(p,c,s*.19)*.28;
  /* the idle wave: a tall soft band drifting left to right every ~26s */
  float ph=fract(t*.038)*1.5-.25;
  float sx=(p.x/uRes.x-ph)*4.;
  col+=mix(uC1,uC2,.6)*exp(-sx*sx)*(1.-p.y/uRes.y)*uSweep;
  /* idle light from above */
  float y=p.y/uRes.y;
  vec3 top=mix(uC1,uC2,.5);
  if(uIdle<1.5){
    float b=.5+.5*sin(t*.5);                       /* ~12s breath */
    col+=top*exp(-y/(.08+.30*b))*uFlow*.5;
  }else{
    float yb=fract(t*.055)*1.5-.25;                /* ~18s per pass */
    col+=top*exp(-pow((y-yb)*4.,2.))*uFlow*.4;
  }
  float pr=110.*uDpr;
  /* both ghosts: wide, soft, one shade - so they melt into one light with no
     visible rim, even where the flutes split it */
  vec3 gc=mix(uC1,uC2,.45);
  col+=gc*blob(p,uGhost,pr*2.1)*uGhostE*.5;
  col+=gc*blob(p,uGhost2,pr*2.1)*uGhostE2*.45;
  /* the gap glow: low between the portrait and the chat, drifting a little and
     breathing slowly, so the light seems to seep down into that opening */
  vec2 gp=uRes*vec2(uGapX+.015*sin(t*.31),.6+.06*sin(t*.42));
  col+=gc*blob(p,gp,s*.095)*uGap*(.65+.35*sin(t*.55));
  /* the spark: smaller and warmer, a second depth layer */
  col+=uC3*blob(p,uGhost3,pr*1.15)*uGhostE3*.55;
  col+=uC1*1.3*blob(p,uMouse,pr)*uEnergy;
  /* on light the trail turns pink-lilac, so the pointer leaves several hues
     behind it instead of one darker blot */
  vec3 tc=uLightMode>.5?mix(uC2,uC3,.65):uC2;
  for(int i=0;i<4;i++){
    float fi=float(i);
    col+=tc*blob(p,uTrail[i],pr*(1.+fi*.3))*uEnergy*(.55-fi*.11);
  }
  return col;
}

float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}

void main(){
  vec2 q=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y);
  float ang=radians(uAngle);
  vec2 dir=vec2(cos(ang),sin(ang));          /* across the slats */
  float w=uFluteW>0.?uFluteW*uDpr:uRes.x/uFlutes;
  float u=dot(q,dir)/w;
  float f=fract(u),id=floor(u);
  float k=f-.5;
  /* round flute = cylindrical lens; sharp flute = a flat prism, a straight shift */
  vec2 off=dir*(mix(k*abs(k)*2.,k,uShape)*uRefr*w*.5);
  vec3 col;
  col.r=field(q+off*(1.+uAberr)).r;
  col.g=field(q+off).g;
  col.b=field(q+off*(1.-uAberr)).b;
  col*=mix(.72+.42*sin(f*3.14159),.45+.85*f,uShape);   /* curved shading vs flat ramp */
  /* each flute breathes on its own clock - slow, small */
  col*=1.+uShimmer*.5*sin(uTime*.45+id*2.37)*sin(uTime*.17+id*.61);
  float lum=dot(col,vec3(.3,.4,.3));
  float sheen=mix(pow(1.-f,22.),smoothstep(.93,1.,f)*(1.-smoothstep(.995,1.,f)),uShape);
  col+=vec3(.75,.7,1.)*sheen*uHi*(.35+lum*3.);        /* edge sheen */
  /* where the pointer is strong, the glass lights up from inside: a soft
     glow across the flute plus a brighter edge (dark theme) */
  if(uLightMode<.5){
    float pl=blob(q+off,uMouse,140.*uDpr)*uEnergy;
    col+=uC1*pl*.35*(.6+.4*f)+vec3(.8,.75,1.)*sheen*pl*.6;
  }
  col+=vec3(.7,.6,1.)*smoothstep(.975,1.,f)*uLine;          /* flute seam */
  col*=uInt;
  col+=(hash(q+fract(uTime))-.5)*uGrain;
  float y=q.y/uRes.y,x=q.x/uRes.x;
  /* the gleam: sits over the glass, not behind it, so it reads even when the
     light field is quiet. It leans a little, catches the flute edges hardest,
     crosses every ~9s and rests off-screen between passes */
  float gx=fract(uTime*.07)*1.8-.4;
  float gd=(x-gx+y*.18)/.07;
  float gl=exp(-gd*gd);
  col+=vec3(.78,.7,1.)*gl*uGlint*(.10+.12*f+sheen*1.6);
  /* the bottom edge slants up toward the right */
  /* breathe: only the length moves, never the brightness. A slow roll from
     left to right, ~14s, so the lit area grows down and pulls back up */
  float gxd=(x-uGapX)/.075;
  float reach=uReach*(1.-uTilt*x)*(1.+uGap*.55*exp(-gxd*gxd))*(1.+uBreathe*sin(uTime*.45-x*2.2));
  col*=1.-smoothstep(reach*(1.-uFade),reach,y);
  if(uLeftFade>0.)col*=smoothstep(.02,uLeftFade,x);
  if(uRightFade>0.)col*=smoothstep(0.,uRightFade,1.-x);
  col*=1.-uRightSoft*smoothstep(.15,1.,x);
  col=max(col,0.);
  /* premultiplied: light adds onto the page, darkness stays see-through */
  float a=clamp(max(col.r,max(col.g,col.b)),0.,1.);
  if(uLightMode>.5){
    /* light theme: keep each spot's own hue at full clarity and let only the
       opacity carry the strength - thin, clean washes, never dark */
    vec3 hue=col/max(a,1e-3);
    /* keep the washes clean: push saturation up and add a breath of white,
       so mixed light never drifts toward grey */
    float hl=dot(hue,vec3(.333));
    hue=mix(clamp(mix(vec3(hl),hue,1.5),0.,1.),vec3(1.),.12);
    float ia=clamp(a*uLightAmt,0.,.28);
    /* white fade over the top edge, so the band never reads as a dark lid */
    float w=uTopWhite*(1.-smoothstep(0.,.28,y));
    gl_FragColor=vec4(hue*ia*(1.-w)+vec3(w),ia*(1.-w)+w);
  }else gl_FragColor=vec4(col,a);
}`;

  function sh(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
    return s;
  }
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog); gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {};
  ['uRes','uTime','uMouse','uTrail','uEnergy','uC1','uC2','uAngle','uFlutes','uRefr',
   'uAberr','uHi','uLine','uInt','uGrain','uFade','uDpr','uShape','uFluteW','uReach','uLift','uShimmer','uSweep','uRightSoft','uTilt','uFlow','uLeftFade','uRightFade','uIdle','uGlint','uBreathe','uGhost','uGhost2','uGhostE','uGhostE2','uGhost3','uGhostE3','uC3','uGap','uGapX','uLightMode','uLightAmt','uTopWhite'].forEach(n => U[n] = gl.getUniformLocation(prog, n));

  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);

  /* soft light needs no retina pixels - render at most 1x */
  let dpr = 1;
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1);
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  new ResizeObserver(resize).observe(canvas);

  /* pointer: an eased head plus four lagging points for the trail */
  const head = { x: -999, y: -999 }, target = { x: -999, y: -999 };
  const trail = Array.from({ length: 4 }, () => ({ x: -999, y: -999 }));
  let energy = 0, wake = 0, ghostE = 0;
  addEventListener('pointermove', e => {
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) * dpr, y = (e.clientY - r.top) * dpr;
    if (head.x < -900) { head.x = x; head.y = y; trail.forEach(t => { t.x = x; t.y = y; }); }
    wake = Math.min(1, wake + Math.hypot(x - target.x, y - target.y) / 400);
    target.x = x; target.y = y;
  }, { passive: true });

  let t0 = performance.now(), last = t0, running = false, raf = 0;
  function draw(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    head.x += (target.x - head.x) * Math.min(1, dt * 7);
    head.y += (target.y - head.y) * Math.min(1, dt * 7);
    let prev = head;
    trail.forEach((t, i) => {
      const k = Math.min(1, dt * (5 - i));
      t.x += (prev.x - t.x) * k; t.y += (prev.y - t.y) * k; prev = t;
    });
    /* light rises while the pointer moves, settles to a low glow when it rests */
    wake *= Math.pow(.25, dt);
    const inBand = target.y > 0 && target.y < canvas.height;
    const goal = (inBand ? .25 : 0) + wake * .9;
    energy += (goal - energy) * Math.min(1, dt * 3);

    gl.uniform2f(U.uRes, canvas.width, canvas.height);
    gl.uniform1f(U.uTime, (now - t0) / 1000 * P.speed * calm);
    gl.uniform2f(U.uMouse, head.x, head.y);
    gl.uniform2fv(U.uTrail, trail.flatMap(t => [t.x, t.y]));
    /* dark: full glow on the left (portrait side); over the text and chat on
       the right the pointer lights up much more gently */
    const ramp = Math.min(1, Math.max(0, (head.x / canvas.width - 0.36) / 0.22));
    const darkGain = P.pointerDark * (1 - P.pointerRight * ramp);
    gl.uniform1f(U.uEnergy, energy * P.pointer * (isDark() ? darkGain : 1));
    const L = !isDark();
    gl.uniform3fv(U.uC1, hex(L ? P.c1L : P.c1)); gl.uniform3fv(U.uC2, hex(L ? P.c2L : P.c2));
    gl.uniform1f(U.uAngle, P.angle); gl.uniform1f(U.uFlutes, P.flutes);
    gl.uniform1f(U.uRefr, P.refraction); gl.uniform1f(U.uAberr, P.aberration);
    gl.uniform1f(U.uHi, P.highlight); gl.uniform1f(U.uLine, P.line);
    gl.uniform1f(U.uInt, P.intensity); gl.uniform1f(U.uGrain, P.grain);
    gl.uniform1f(U.uFade, P.fade); gl.uniform1f(U.uDpr, dpr);
    /* flutes shrink with the screen: full width at 1440px and up, about
       three quarters at a 500px phone, never below 70% */
    const cw = canvas.width / dpr;
    const narrow = Math.min(1, Math.max(0.7, 0.7 + 0.3 * (cw - 375) / (1440 - 375)));
    gl.uniform1f(U.uShape, P.shape); gl.uniform1f(U.uFluteW, P.fluteW * narrow);
    gl.uniform1f(U.uLightMode, isDark() ? 0 : 1); gl.uniform1f(U.uLightAmt, P.lightAmt);
    gl.uniform1f(U.uTopWhite, P.topWhite);

    gl.uniform1f(U.uReach, P.reach); gl.uniform1f(U.uLift, P.lift);
    gl.uniform1f(U.uShimmer, P.shimmer); gl.uniform1f(U.uSweep, P.sweep);
    gl.uniform1f(U.uRightSoft, P.rightSoft); gl.uniform1f(U.uTilt, P.tilt);
    gl.uniform1f(U.uFlow, P.flow); gl.uniform1f(U.uLeftFade, P.leftFade);
    gl.uniform1f(U.uRightFade, P.rightFade);
    gl.uniform1f(U.uIdle, P.idle); gl.uniform1f(U.uGlint, P.glint);
    gl.uniform1f(U.uBreathe, P.breathe);
    /* the ghosts: two lights circling over the portrait in opposite directions,
       ~10s and ~13s per loop. Brightest above the head; they dim toward the
       edges, most of all toward the right, where the wide loop reaches about
       mid-screen but only as a faint trace. They step aside while the real
       pointer is lighting things, and come back when it rests */
    const gt = (now - t0) / 1000 * P.speed;
    const W = canvas.width, H = canvas.height, cx = 0.26;
    const a1 = gt * 0.62, a2 = -gt * 0.48 + 2;
    const x1 = cx + 0.2 * Math.cos(a1), y1 = 0.22 + 0.12 * Math.sin(a1);
    const x2 = cx - 0.02 + 0.12 * Math.cos(a2), y2 = 0.2 + 0.1 * Math.sin(a2);
    const ss = (e0, e1, v) => { const t = Math.min(1, Math.max(0, (v - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
    const edge = x => x < cx ? 1 - 0.5 * ss(0, 0.16, cx - x) : 1 - 0.82 * ss(0, 0.2, x - cx);
    gl.uniform2f(U.uGhost, W * x1, H * y1);
    gl.uniform2f(U.uGhost2, W * x2, H * y2);
    ghostE += ((P.ghost * (0.75 + 0.25 * Math.sin(gt * 1.3)) * Math.max(0, 1 - wake * 2.5)) - ghostE) * Math.min(1, dt * 2);
    gl.uniform1f(U.uGhostE, ghostE * edge(x1));
    gl.uniform1f(U.uGhostE2, ghostE * edge(x2));
    /* spark: ~7s per loop, clockwise against the others, a slightly tilted ellipse */
    const a3 = -gt * 0.9 + 4;
    const x3 = cx + 0.03 + 0.15 * Math.cos(a3), y3 = 0.18 + 0.1 * Math.sin(a3) + 0.03 * Math.cos(a3);
    gl.uniform2f(U.uGhost3, W * x3, H * y3);
    gl.uniform1f(U.uGhostE3, ghostE / Math.max(P.ghost, .001) * P.spark * edge(x3) * (0.8 + 0.2 * Math.sin(gt * 2.1)));
    gl.uniform3fv(U.uC3, hex(L ? P.c3L : P.c3));
    gl.uniform1f(U.uGap, P.gap); gl.uniform1f(U.uGapX, P.gapX);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function loop(now) { draw(now); raf = requestAnimationFrame(loop); }

  /* only run while dark, visible and on screen */
  let onScreen = true;
  const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';
  function sync() {
    const want = onScreen && !document.hidden;
    document.documentElement.classList.add('slats-on');
    if (running) draw(performance.now());
    if (want && !running) {
      running = true; last = performance.now();
      raf = requestAnimationFrame(loop);
    } else if (!want && running) { running = false; cancelAnimationFrame(raf); }
  }
  new MutationObserver(sync).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  document.addEventListener('visibilitychange', sync);
  new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); }).observe(canvas);
  sync();

  /* expose for the tune panel */
  window.slatsFx = { P, redraw: () => draw(performance.now()) };
})();
