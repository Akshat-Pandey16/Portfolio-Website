import { useEffect, useRef } from 'react';
import { Renderer, Triangle, Program, Mesh } from 'ogl';
import { prefersReducedMotion } from '../lib/motion';

/*
  The "telemetry field" — a GPU fragment-shader backdrop: a slow flowing
  noise nebula tinted mint↔cyan, a faint radar grid and pointer parallax.
  Tuned to be cheap: 3-octave noise, sub-1 render scale (it's a soft field,
  upscaling is invisible), ~30fps throttle, pauses when the tab is hidden,
  freezes (still pretty) under prefers-reduced-motion, and degrades to the
  CSS grid if WebGL is unavailable.
*/

// sRGB 0-1 palettes per theme: [base bg, mint, cyan]
const DARK = {
  bg: [0.052, 0.066, 0.115],
  mint: [0.38, 0.95, 0.7],
  cyan: [0.3, 0.78, 1.0],
} as const;
const LIGHT = {
  bg: [0.953, 0.961, 0.976],
  mint: [0.2, 0.62, 0.46],
  cyan: [0.22, 0.52, 0.74],
} as const;

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision mediump float;
  uniform float uTime;
  uniform float uDark;
  uniform float uReveal;
  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform vec3 uBg;
  uniform vec3 uMint;
  uniform vec3 uCyan;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
    for (int i = 0; i < 3; i++) {
      v += a * noise(p);
      p = m * p;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = (uv - 0.5);
    p.x *= aspect;
    vec2 par = (uPointer - 0.5) * vec2(aspect, 1.0);
    vec2 q = p - par * 0.06;
    float t = uTime * 0.035;

    // flowing nebula (cheap: scalar warp + one field)
    float warp = fbm(q * 1.5 + t);
    float field = fbm(q * 1.7 + warp * 1.2 + vec2(0.0, -t * 1.3));
    field = smoothstep(0.12, 0.95, field);

    float mixv = smoothstep(0.2, 0.85, fbm(q * 1.0 - t + 2.0));
    vec3 tint = mix(uCyan, uMint, mixv);

    // faint radar grid, drifting
    vec2 gp = fract(q * 5.0 + vec2(par.x * 0.4, t * 1.4)) - 0.5;
    float grid = smoothstep(0.03, 0.0, abs(gp.x)) + smoothstep(0.03, 0.0, abs(gp.y));

    // dark: additive glow over deep navy
    float band = smoothstep(0.75, 1.0, sin((uv.x + uv.y) * 3.2 - uTime * 0.45));
    vec3 darkCol = uBg + tint * field * 0.42 + tint * grid * 0.05 + uMint * band * 0.03;

    // light: visible soft colored wash (mix toward medium tint)
    vec3 lightCol = mix(uBg, tint, field * 0.22);
    lightCol = mix(lightCol, tint * 0.65, grid * 0.12);

    vec3 col = mix(lightCol, darkCol, uDark);

    // vignette: darken edges in dark only
    float vig = smoothstep(1.35, 0.25, length(p));
    col *= mix(1.0, mix(0.6, 1.05, vig), uDark);

    col = mix(uBg, col, uReveal);
    gl_FragColor = vec4(col, 1.0);
  }
`;

export function DeckBackground() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let isDarkNow = document.documentElement.classList.contains('dark');
    const reduced = prefersReducedMotion();
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    // sub-1 render scale: the field is soft, so upscaling a low-res buffer is
    // invisible but roughly halves fragment-shader cost.
    const renderScale = isMobile ? 0.6 : 0.75;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        alpha: false,
        antialias: false,
        dpr: renderScale,
        powerPreference: 'low-power',
      });
    } catch {
      host.dataset.fallback = 'true';
      return;
    }

    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    host.appendChild(canvas);

    const palette = isDarkNow ? DARK : LIGHT;
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uDark: { value: isDarkNow ? 1 : 0 },
        uReveal: { value: 0 },
        uResolution: { value: [1, 1] },
        uPointer: { value: [0.5, 0.5] },
        uBg: { value: [...palette.bg] },
        uMint: { value: [...palette.mint] },
        uCyan: { value: [...palette.cyan] },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      program.uniforms.uResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const ptrTarget = { x: 0.5, y: 0.5 };
    const ptr = { x: 0.5, y: 0.5 };
    const onPointer = (e: PointerEvent) => {
      ptrTarget.x = e.clientX / window.innerWidth;
      ptrTarget.y = 1 - e.clientY / window.innerHeight;
    };
    if (!reduced) window.addEventListener('pointermove', onPointer, { passive: true });

    const applyTheme = () => {
      const pal = isDarkNow ? DARK : LIGHT;
      program.uniforms.uDark.value = isDarkNow ? 1 : 0;
      program.uniforms.uBg.value = [...pal.bg];
      program.uniforms.uMint.value = [...pal.mint];
      program.uniforms.uCyan.value = [...pal.cyan];
    };
    const themeObserver = new MutationObserver(() => {
      const nowDark = document.documentElement.classList.contains('dark');
      if (nowDark !== isDarkNow) {
        isDarkNow = nowDark;
        applyTheme();
      }
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    let raf = 0;
    let running = true;
    const start = performance.now();
    let lastFrame = 0;
    const FRAME_MS = 33; // ~30fps is plenty for a slow field, and gentle on the GPU

    const render = (now: number) => {
      raf = requestAnimationFrame(render);
      if (now - lastFrame < FRAME_MS) return;
      lastFrame = now;

      ptr.x += (ptrTarget.x - ptr.x) * 0.08;
      ptr.y += (ptrTarget.y - ptr.y) * 0.08;
      program.uniforms.uPointer.value = [ptr.x, ptr.y];

      const elapsed = (now - start) / 1000;
      program.uniforms.uReveal.value = Math.min(1, elapsed / 1.1);

      if (reduced) {
        program.uniforms.uTime.value = 12;
        renderer.render({ scene: mesh });
        if (program.uniforms.uReveal.value >= 1) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
        return;
      }
      program.uniforms.uTime.value = elapsed;
      renderer.render({ scene: mesh });
    };
    raf = requestAnimationFrame(render);

    const onVisibility = () => {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        running = false;
      } else if (!running && !reduced) {
        running = true;
        lastFrame = 0;
        raf = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      running = false;
      // fall back to the CSS deck-grid so we never show a frozen/black canvas
      canvas.style.display = 'none';
      host.dataset.fallback = 'true';
    };
    const onContextRestored = () => {
      canvas.style.display = 'block';
      delete host.dataset.fallback;
      resize();
      applyTheme();
      if (!running) {
        running = true;
        lastFrame = 0;
        raf = requestAnimationFrame(render);
      }
    };
    canvas.addEventListener('webglcontextlost', onContextLost);
    canvas.addEventListener('webglcontextrestored', onContextRestored);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onContextLost);
      canvas.removeEventListener('webglcontextrestored', onContextRestored);
      themeObserver.disconnect();
      const ext = gl.getExtension('WEBGL_lose_context');
      ext?.loseContext();
      canvas.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 bg-[var(--bg)] data-[fallback=true]:deck-grid"
    />
  );
}
