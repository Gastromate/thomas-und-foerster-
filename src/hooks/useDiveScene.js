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
const hexToNum = hex => parseInt(hex.replace('#', ''), 16);

const NET_TINT = '#D98F52';
const LAYER_IDS = ['hero', 'thesis', 'approach', 'build', 'services', 'contact'];

// True forward dive: the viewport is pinned (position: sticky) and stays
// visually still, while scroll drives a virtual camera through a sequence
// of Z-positioned layers, one per section — each one grows out of the
// depths, holds at full size while centered, then pops past camera and
// blurs away, so the read is "flying through," not "sliding down."
//
// Any layer taller than the screen (founders' bios, the build gallery,
// services' two card decks) just scrolls internally like a normal page —
// only the currently-centered layer is ever marked scrollable
// (data-lenis-prevent + overflow-y:auto), so Lenis routes wheel/touch to it
// first and only advances the dive once it's exhausted. Every other layer
// stays overflow:hidden — leaving all six permanently scrollable at once
// (they're stacked, absolute, full-viewport) made Lenis treat the whole
// screen as "nested scrollable content" and the outer dive never advanced.
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

    let vanta = null;
    if (bgRef.current) {
      vanta = NET({
        el: bgRef.current,
        THREE,
        color: hexToNum(NET_TINT),
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
      });
    }

    const n = layers.length;
    const step = 1 / (n - 1);
    const homeWindow = step * 1.15; // overlap either side of a layer's "home" scroll position
    const prevNorm = new Array(n).fill(NaN);
    const prevActive = new Array(n).fill(false);

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

        const isActive = Math.abs(norm) < 0.12;
        if (isActive !== prevActive[i]) {
          prevActive[i] = isActive;
          el.style.overflowY = isActive ? 'auto' : 'hidden';
          if (isActive) el.setAttribute('data-lenis-prevent', '');
          else el.removeAttribute('data-lenis-prevent');
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
