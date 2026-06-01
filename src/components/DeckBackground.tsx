import { useEffect, useRef } from 'react';
import { Renderer, Triangle, Program, Mesh } from 'ogl';
import { prefersReducedMotion } from '../lib/motion';

/*
  The "telemetry field" — a GPU fragment-shader backdrop: a slow flowing
  noise nebula tinted mint↔cyan, a faint radar grid, a drifting sweep band
  and pointer parallax. Single fullscreen triangle, ~5-octave value-noise.
  Adaptive DPR, pauses when the tab is hidden, freezes (still pretty) under
  prefers-reduced-motion, and degrades to a CSS gradient if WebGL is absent.
*/

// sRGB 0-1 palettes per theme: [base bg, mint, cyan]
const DARK = {
  bg: [0.052, 0.066, 0.115],
  mint: [0.38, 0.95, 0.7],
  cyan: [0.3, 0.78, 1.0],
} as const;
const LIGHT = {
  bg: [0.953, 0.961, 0.976],
  mint: [0.1, 0.62, 0.45],
  cyan: [0.12, 0.5, 0.72],
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
  precision highp float;
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
    for (int i = 0; i < 5; i++) {
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

    // flowing nebula
    vec2 warp = vec2(fbm(q * 1.6 + t), fbm(q * 1.6 - t + 5.2));
    float field = fbm(q * 1.7 + warp * 1.4 + vec2(0.0, -t * 1.5));
    field = smoothstep(0.12, 0.95, field);

    // two-tone tint selection
    float mixv = smoothstep(0.2, 0.85, fbm(q * 1.1 - t + 2.0));
    vec3 tint = mix(uCyan, uMint, mixv);

    // faint radar grid, drifting
    vec2 gp = fract(q * 5.0 + vec2(par.x * 0.4, t * 1.4)) - 0.5;
    float grid = smoothstep(0.028, 0.0, abs(gp.x)) + smoothstep(0.028, 0.0, abs(gp.y));

    // slow diagonal sweep
    float band = sin((uv.x + uv.y) * 3.2 - uTime * 0.45);
    band = smoothstep(0.75, 1.0, band);

    vec3 col = uBg;
    col += tint * field * mix(0.07, 0.4, uDark);
    col += tint * grid * mix(0.02, 0.055, uDark);
    col += uMint * band * mix(0.012, 0.03, uDark);

    // vignette: darken edges in dark, lighten center in light
    float vig = smoothstep(1.35, 0.25, length(p));
    col *= mix(1.0, mix(0.62, 1.06, vig), uDark);
    col = mix(col, col + (1.0 - vig) * 0.015, 1.0 - uDark);

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
    const maxDpr = isMobile ? 1 : 1.3;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        alpha: false,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, maxDpr),
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
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    // pointer parallax (smoothed)
    const ptrTarget = { x: 0.5, y: 0.5 };
    const ptr = { x: 0.5, y: 0.5 };
    const onPointer = (e: PointerEvent) => {
      ptrTarget.x = e.clientX / window.innerWidth;
      ptrTarget.y = 1 - e.clientY / window.innerHeight;
    };
    if (!reduced) window.addEventListener('pointermove', onPointer, { passive: true });

    // theme sync without reinit
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

    const render = (now: number) => {
      raf = requestAnimationFrame(render);
      // soft pointer lerp
      ptr.x += (ptrTarget.x - ptr.x) * 0.06;
      ptr.y += (ptrTarget.y - ptr.y) * 0.06;
      program.uniforms.uPointer.value = [ptr.x, ptr.y];

      const elapsed = (now - start) / 1000;
      // reveal fade-in over ~1.1s
      program.uniforms.uReveal.value = Math.min(1, elapsed / 1.1);

      if (reduced) {
        program.uniforms.uTime.value = 12; // frozen, but a pretty frame
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
        raf = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    const onContextLost = (e: Event) => {
      e.preventDefault();
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    canvas.addEventListener('webglcontextlost', onContextLost);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('visibilitychange', onVisibility);
      canvas.removeEventListener('webglcontextlost', onContextLost);
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
