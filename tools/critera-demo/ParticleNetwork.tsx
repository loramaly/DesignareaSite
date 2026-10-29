/**
 * The hero's particle network, the quiet version (2026-09-24): fewer, fainter nodes and threads at rest,
 * and the threads come up around the cursor. The previous, fuller version is kept as ParticleNetworkOriginal.tsx.
 *
 * Hover, fixed for good (2026-10-13). It kept "breaking" for three reasons, each closed here:
 *  1. The hover MULTIPLIED a star's own opacity, so a faint star stayed faint under the cursor however big the
 *     multiplier got. Now the hover pulls every star TOWARD a fixed target (HOVER_DOT), whatever it was at rest.
 *  2. Two of the five colours are dark purples that sink into the #120d2e sky. Under the cursor every star and
 *     thread now lightens toward HOVER_TINT, so the colour can never hide it.
 *  3. The page is zoomed (html zoom 0.81 on laptops), which shrank 0.6px lines to ~0.5px on screen - nearly gone.
 *     Hover line widths are now set in SCREEN pixels, read from the live zoom every frame, so a zoom change can't
 *     dim them again. The look at rest is untouched.
 */
import { useEffect, useRef } from 'react';

// Brand color palette for gradient-colored particles
const PARTICLE_COLORS = [
  { r: 213, g: 84, b: 255 },   // #8C7EEE — primary purple
  { r: 140, g: 126, b: 238 },  // #8C7EEE — secondary violet
  { r: 99, g: 102, b: 241 },   // #6366F1 — indigo
  { r: 192, g: 132, b: 252 },  // #C084FC — lavender
  { r: 152, g: 0, b: 195 },    // #7446DD — primary-dark
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseRadius: number;
  radius: number;
  opacity: number;
  color: typeof PARTICLE_COLORS[number];
  isPulsing: boolean;
  pulsePhase: number;
  pulseSpeed: number;
  depth: number; // 0–1 for parallax layering
}

interface Props {
  scrollY?: number;
  /**
   * Track the pointer from the window instead of the canvas itself, so the
   * network still answers the cursor while content sits on top of it. Pair
   * with `pointer-events: none` on the canvas wrapper so it never swallows
   * clicks meant for that content.
   */
  globalPointer?: boolean;
}

export default function ParticleNetwork({ scrollY = 0, globalPointer = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });
  const scrollRef = useRef(scrollY);
  useEffect(() => {
    scrollRef.current = scrollY;
  }, [scrollY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const PARTICLE_COUNT = 48;          // was 80, then 56: fewer nodes at rest
    const REST_SPEED = 0.6;             // drift at rest, relative to the fuller version
    const NEAR_SPEED = 2.2;             // how much faster the nodes move around the cursor
    const CONNECTION_DISTANCE = 150;
    const MOUSE_RADIUS = 300;           // the cursor's own lines (was 200; the parted stars now wait just outside 200)
    const REST_LINE = 0.09;             // thread opacity at rest (was 0.15)
    const NEAR_RADIUS = 280;            // how far around the cursor the threads wake up
    const DOT_SCALE = 0.7;              // node opacity at rest, relative to the fuller version
    const PART_RADIUS = 240;            // the stars part around the cursor, within this reach
    const PART_PUSH = 3.2;              // px a frame, right at the cursor; fades out toward the reach
    const LIT_GROW = 0.45;              // the nodes at the cursor grow by this much, so the brighter ones read
    // hover targets - absolute, so they hold whatever the rest values or the colours are
    const HOVER_DOT = 0.95;             // a star right at the cursor
    const HOVER_THREAD = 0.55;          // a thread right at the cursor
    const HOVER_CURSOR_LINE = 0.6;      // the cursor's own lines, at the cursor
    const HOVER_TINT = { r: 236, g: 230, b: 255 }; // the light lavender the hover lightens toward
    const TINT_MIX = 0.55;              // how far toward it, right at the cursor
    const HOVER_LINE_PX = 1.1;          // on-screen width of a thread / cursor line at the cursor
    const tint = (c: { r: number; g: number; b: number }, k: number) => {
      const m = TINT_MIX * k;
      return `${Math.round(c.r + (HOVER_TINT.r - c.r) * m)}, ${Math.round(c.g + (HOVER_TINT.g - c.g) * m)}, ${Math.round(c.b + (HOVER_TINT.b - c.b) * m)}`;
    };
    // layout px per screen px: the page zoom (and any zoom on the hero), read live
    const zoomOf = () => (canvas as HTMLCanvasElement & { currentCSSZoom?: number }).currentCSSZoom || 1;

    const resize = () => {
      const dpr = Math.min(1.5, window.devicePixelRatio || 1); // capped: the dots are soft, and a full retina canvas behind the clipped sky costs frames
      // layout size, not the bounding box: the hero's sky may be rotated, and the box would be larger than the canvas
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      ctx.scale(dpr, dpr);
    };

    const initParticles = () => {
      const rect = { width: canvas.clientWidth, height: canvas.clientHeight };
      particlesRef.current = Array.from({ length: PARTICLE_COUNT }, () => {
        const isPulsing = Math.random() < 0.3; // 30% of particles pulse
        const depth = Math.random(); // parallax depth layer
        return {
          x: Math.random() * rect.width,
          y: Math.random() * rect.height,
          vx: (Math.random() - 0.5) * 0.5 * REST_SPEED,
          vy: (Math.random() - 0.5) * 0.5 * REST_SPEED,
          baseRadius: Math.random() * 2 + 1,
          radius: 0,
          opacity: (Math.random() * 0.5 + 0.2) * DOT_SCALE,
          color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
          isPulsing,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.015 + Math.random() * 0.02,
          depth,
        };
      });
    };

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.height !== Math.round(h * Math.min(1.5, window.devicePixelRatio || 1))) resize(); // the canvas grew or shrank since the last frame: match it before drawing
      ctx.clearRect(0, 0, w, h);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const scroll = scrollRef.current;
      const onScreen = 1 / zoomOf(); // multiply a screen-px width by this to draw it in the canvas's layout px

      // Update & draw particles
      for (const p of particles) {
        // slow drift at rest; the nodes near the cursor hurry
        const mdx = p.x - mouse.x, mdy = p.y - mouse.y;
        const nearMouse = Math.max(0, 1 - Math.sqrt(mdx * mdx + mdy * mdy) / NEAR_RADIUS);
        const speed = 1 + (NEAR_SPEED - 1) * nearMouse;
        p.x += p.vx * speed;
        p.y += p.vy * speed;

        // Bounce off edges
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));

        // the stars part around the cursor: pushed straight out of its way, not sped up, so they settle where they
        // stop and drift on at their own pace (the old 0.02 nudge on the velocity hardly showed)
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < PART_RADIUS && dist > 0) {
          const t = 1 - dist / PART_RADIUS;
          p.x += (dx / dist) * PART_PUSH * t * t;
          p.y += (dy / dist) * PART_PUSH * t * t;
        }

        // Dampen velocity
        p.vx *= 0.999;
        p.vy *= 0.999;

        // Pulsing radius for active nodes
        if (p.isPulsing) {
          p.pulsePhase += p.pulseSpeed;
          const pulseFactor = 1 + Math.sin(p.pulsePhase) * 0.5; // 0.5x–1.5x
          p.radius = p.baseRadius * pulseFactor;
        } else {
          p.radius = p.baseRadius;
        }

        // Parallax offset based on scroll and depth
        const parallaxOffset = scroll * p.depth * 0.15;
        const drawY = p.y + parallaxOffset;

        // Draw particle with its own brand color
        const { r, g, b } = p.color;

        // Pulsing particles get a soft glow
        if (p.isPulsing && p.radius > p.baseRadius * 1.1) {
          ctx.beginPath();
          ctx.arc(p.x, drawY, p.radius * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.08})`;
          ctx.fill();
        }

        // the nodes around the cursor brighten and grow, most at the cursor itself
        const ndx = p.x - mouse.x, ndy = drawY - mouse.y;
        const lit = Math.max(0, 1 - Math.sqrt(ndx * ndx + ndy * ndy) / NEAR_RADIUS);
        ctx.beginPath();
        ctx.arc(p.x, drawY, p.radius * (1 + LIT_GROW * lit), 0, Math.PI * 2);
        const dotAlpha = p.opacity + (HOVER_DOT - p.opacity) * Math.sqrt(lit); // eased: still bright a little way out
        ctx.fillStyle = lit > 0 ? `rgba(${tint(p.color, lit)}, ${dotAlpha})` : `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
        ctx.fill();
      }

      // Draw connections — use blended colors from connected particles
      for (let i = 0; i < particles.length; i++) {
        const pi = particles[i];
        const piDrawY = pi.y + scroll * pi.depth * 0.15;
        for (let j = i + 1; j < particles.length; j++) {
          const pj = particles[j];
          const pjDrawY = pj.y + scroll * pj.depth * 0.15;
          const dx = pi.x - pj.x;
          const dy = piDrawY - pjDrawY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // threads near the cursor reach further and show more; at rest they stay faint
          const mx = (pi.x + pj.x) / 2 - mouse.x, my = (piDrawY + pjDrawY) / 2 - mouse.y;
          const near = Math.max(0, 1 - Math.sqrt(mx * mx + my * my) / NEAR_RADIUS);
          const reach = CONNECTION_DISTANCE * (1 + 0.35 * near);
          if (dist < reach) {
            const opacity = (1 - dist / reach) * (REST_LINE + (HOVER_THREAD - REST_LINE) * near);
            // Average the two particle colors for the connection line
            const mid = {
              r: Math.round((pi.color.r + pj.color.r) / 2),
              g: Math.round((pi.color.g + pj.color.g) / 2),
              b: Math.round((pi.color.b + pj.color.b) / 2),
            };
            ctx.beginPath();
            ctx.moveTo(pi.x, piDrawY);
            ctx.lineTo(pj.x, pjDrawY);
            ctx.strokeStyle = `rgba(${tint(mid, near)}, ${opacity})`;
            ctx.lineWidth = 0.8 + (HOVER_LINE_PX * onScreen - 0.8) * near; // at rest as before; at the cursor a fixed on-screen width
            ctx.stroke();
          }
        }
      }

      // Draw mouse connections
      for (const p of particles) {
        const drawY = p.y + scroll * p.depth * 0.15;
        const dx = p.x - mouse.x;
        const dy = drawY - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS) {
          const k = 1 - dist / MOUSE_RADIUS;
          const opacity = k * HOVER_CURSOR_LINE;
          ctx.beginPath();
          ctx.moveTo(p.x, drawY);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(${tint(p.color, k)}, ${opacity})`;
          ctx.lineWidth = HOVER_LINE_PX * onScreen * (0.6 + 0.4 * k);
          ctx.stroke();
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      // the pointer arrives in screen pixels; the particles live in the canvas's own layout pixels (they differ under
      // the laptops' page zoom), so convert, or the cursor's reach lands off to the side
      const k = rect.width ? canvas.clientWidth / rect.width : 1;
      const x = (e.clientX - rect.left) * k;
      const y = (e.clientY - rect.top) * k;
      // Window-level tracking: only count the cursor while it is over the canvas.
      if (globalPointer && (x < 0 || y < 0 || x > canvas.clientWidth || y > canvas.clientHeight)) {
        mouseRef.current = { x: -1000, y: -1000 };
        return;
      }
      mouseRef.current = { x, y };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    resize();
    initParticles();
    animationRef.current = requestAnimationFrame(draw);

    const handleResize = () => {
      resize();
      initParticles();
    };

    // the hero grows after load (fonts, the scene's fit) without a window resize: the canvas kept its first height, so its
    // lowest band was stretched and cut along a straight line, the stars there swollen into half-blots. Follow the
    // canvas's own size; when only the height changed, keep the stars where they are (a phone's address bar)
    let lastW = canvas.clientWidth, lastH = canvas.clientHeight;
    const ro = new ResizeObserver(() => {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h || (w === lastW && h === lastH)) return;
      const sameWidth = w === lastW;
      lastW = w; lastH = h;
      resize();
      if (!sameWidth) initParticles();
    });
    ro.observe(canvas);

    const pointerTarget: Window | HTMLCanvasElement = globalPointer ? window : canvas;
    window.addEventListener('resize', handleResize);
    // a finger is not a cursor: a tap sends one mousemove and the point stays there, so the stars round it swelled into
    // big lit blots long after the finger left. The stars answer a real mouse only
    const finger = window.matchMedia('(hover: none)').matches;
    if (!finger) pointerTarget.addEventListener('mousemove', handleMouseMove as EventListener, { passive: true });
    pointerTarget.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationRef.current);
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
      pointerTarget.removeEventListener('mousemove', handleMouseMove as EventListener);
      pointerTarget.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [globalPointer]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: globalPointer ? 'none' : 'auto' }}
    />
  );
}
