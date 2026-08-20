import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import * as NETModule from 'vanta/dist/vanta.net.min';
import * as THREE from 'three';

// The UMD build's CJS/ESM interop wraps this in an extra `.default` layer or
// two depending on the bundler, rather than exposing the effect function
// directly — unwrap until we find it.
function unwrapDefault(mod) {
  let m = mod;
  for (let i = 0; i < 3 && m && typeof m !== 'function' && 'default' in m; i++) m = m.default;
  return m;
}
const NET = unwrapDefault(NETModule);

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = t => t * t * (3 - 2 * t);

const LAYER_IDS = ['hero', 'thesis', 'approach', 'build', 'services', 'contact'];

// The net's color shifts continuously with scroll depth rather than
// snapping per section — one space, just one whose light changes as you
// move through it. Stops line up roughly with each layer's home position;
// the two dark layers (hero, contact) get the lighter tint so it still
// reads against their dark backgrounds via the soft-light blend, while the
// light-paper layers between them swing through the brand's ember/steel
// pair for variation.
const hexToRgb = hex => {
  const n = parseInt(hex.replace('#', ''), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};
const lerpRgb = (a, b, t) => ({
  r: Math.round(lerp(a.r, b.r, t)),
  g: Math.round(lerp(a.g, b.g, t)),
  b: Math.round(lerp(a.b, b.b, t)),
});
const rgbToNum = c => (c.r << 16) | (c.g << 8) | c.b;

// soft-light blending has a dead zone near 50% grey — a source channel value
// close to 128 barely changes the destination at all. Stops need real
// saturation (channels pushed well away from 128 in both directions) or
// they just fade out against the light-paper sections; muted mid-tones
// like a plain "#5C89A0" steel effectively vanished here.
const COLOR_STOPS = [
  { at: 0.00, rgb: hexToRgb('#E8A15C') }, // hero (dark)
  { at: 0.20, rgb: hexToRgb('#1E6E8F') }, // thesis (light) — saturated teal-steel
  { at: 0.40, rgb: hexToRgb('#B85C1F') }, // approach (light) — ember
  { at: 0.60, rgb: hexToRgb('#14526B') }, // build (light) — deep saturated teal
  { at: 0.80, rgb: hexToRgb('#D98F52') }, // services (light) — warm ember
  { at: 1.00, rgb: hexToRgb('#E8A15C') }, // contact (dark)
];

function colorAt(progress) {
  const p = clamp(progress, 0, 1);
  for (let i = 0; i < COLOR_STOPS.length - 1; i++) {
    const a = COLOR_STOPS[i];
    const b = COLOR_STOPS[i + 1];
    if (p >= a.at && p <= b.at) {
      const t = (p - a.at) / (b.at - a.at || 1);
      return rgbToNum(lerpRgb(a.rgb, b.rgb, t));
    }
  }
  return rgbToNum(COLOR_STOPS[COLOR_STOPS.length - 1].rgb);
}

// True forward dive: the viewport is pinned (position: sticky) and stays
// visually still, while scroll drives a virtual camera through a sequence
// of Z-positioned layers, one per section — each one grows out of the
// depths, holds at full size while centered, then pops past camera and
// blurs away, so the read is "flying through," not "sliding down."
//
// Any layer taller than the screen (founders' bios, the build gallery,
// services' two card decks) just scrolls internally like a normal page —
// on non-touch devices, only the currently-centered layer is ever marked
// scrollable (data-lenis-prevent + overflow-y:auto), so Lenis routes wheel
// input to it first and only advances the dive once it's exhausted.
//
// That toggle is skipped entirely on touch devices. Browsers decide which
// element a touch gesture scrolls at touchstart; flipping overflow-y to
// 'auto' mid-swipe doesn't retarget an already-started gesture, so the
// moment a layer became "active" mid-scroll, Lenis would block the outer
// dive (data-lenis-prevent) while the inner overflow never actually
// engaged (the gesture's target was already locked elsewhere) — scroll
// just stopped, which is what was happening on iPhone at the founders
// panel. Every section is sized to fit one screen (see .dive-compact in
// App.css) specifically so touch devices never need this fallback.
export function useDiveScene() {
  const bgRef = useRef(null);
  const lenisRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const layers = LAYER_IDS
      .map(id => document.getElementById(id))
      .filter(Boolean);

    if (layers.length === 0) return;

    if (prefersReduced) {
      layers.forEach(el => {
        el.style.position = 'relative';
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      if (trackRef.current) trackRef.current.style.height = 'auto';
      return;
    }

    const lenis = new Lenis({ autoRaf: false });
    lenisRef.current = lenis;
    const isTouch = window.matchMedia('(pointer: coarse)').matches;

    const NET_BASE_OPTIONS = {
      points: 9,
      maxDistance: 20,
      spacing: 17,
      backgroundAlpha: 0,
      showDots: true,
      mouseControls: false,
      touchControls: false,
      gyroControls: false,
      minHeight: 200,
      minWidth: 200,
      scale: 1,
      scaleMobile: 1,
    };

    let vanta = null;
    if (bgRef.current) {
      vanta = NET({
        el: bgRef.current,
        THREE,
        color: colorAt(0),
        ...NET_BASE_OPTIONS,
      });
    }

    const n = layers.length;
    const step = 1 / (n - 1);
    const homeWindow = step * 1.15; // overlap either side of a layer's "home" scroll position
    const prevNorm = new Array(n).fill(NaN);
    const prevActive = new Array(n).fill(false);
    let prevColor = NaN;
    let lastColorUpdate = 0;

    let raf = null;

    function tick(time) {
      lenis.raf(time);

      const track = trackRef.current;
      if (!track) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const rect = track.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = clamp(scrollable > 0 ? -rect.top / scrollable : 0, 0, 1);

      if (vanta && time - lastColorUpdate > 80) {
        const col = colorAt(progress);
        if (col !== prevColor) {
          prevColor = col;
          lastColorUpdate = time;
          // Pass the full option set, not just { color } — a partial object
          // appeared to reset the rest (points/spacing/maxDistance) back
          // toward defaults, which was silently blanking the net out at
          // some scroll depths.
          vanta.setOptions({ color: col, ...NET_BASE_OPTIONS });
        }
      }

      layers.forEach((el, i) => {
        const home = i * step;
        const norm = clamp((progress - home) / homeWindow, -1, 1);

        // Skip the DOM writes entirely once a layer has settled at its
        // resting state (norm unchanged) — six layers' worth of style
        // mutations every frame, most of them for layers that are fully
        // faded and doing nothing, was real overhead (visibly slowed down
        // the hero's own particle-text entrance animation on load).
        if (Math.abs(norm - prevNorm[i]) < 0.0004) return;
        prevNorm[i] = norm;

        const t = smoothstep(Math.abs(norm));
        const z = norm >= 0 ? lerp(0, -1500, t) : lerp(0, 400, t);
        const opacity = lerp(1, 0, t);
        const blur = lerp(0, 16, t);
        const zIndex = Math.round((1 - Math.abs(norm)) * 100);

        el.style.transform = `translateZ(${z.toFixed(1)}px)`;
        el.style.opacity = opacity.toFixed(3);
        el.style.filter = t > 0.03 ? `blur(${blur.toFixed(1)}px)` : 'none';
        el.style.zIndex = String(zIndex);
        el.style.pointerEvents = opacity < 0.15 ? 'none' : 'auto';

        if (!isTouch) {
          const isActive = Math.abs(norm) < 0.12;
          if (isActive !== prevActive[i]) {
            prevActive[i] = isActive;
            el.style.overflowY = isActive ? 'auto' : 'hidden';
            if (isActive) el.setAttribute('data-lenis-prevent', '');
            else el.removeAttribute('data-lenis-prevent');
          }
        }
      });

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      vanta?.destroy();
      lenisRef.current = null;
    };
  }, []);

  return { bgRef, lenisRef, trackRef };
}
