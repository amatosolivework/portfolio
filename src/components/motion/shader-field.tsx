"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

/**
 * Signature hero background: a slow, domain-warped noise field rendered as a
 * barely-there dark tint (max ~8% alpha) with fine grain, composited over the
 * paper background. Monochrome and theme-agnostic by design.
 *
 * Self-disables on prefers-reduced-motion or missing WebGL, caps DPR, and pauses
 * when the tab/section is not visible. Rendered client-only + lazy so it never
 * blocks first paint; a static CSS gradient sits underneath as the fallback.
 */
const fragment = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uResolution;
varying vec2 vUv;

vec3 permute(vec3 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float rand(vec2 co){ return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453); }

void main(){
  vec2 uv = vUv;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= uResolution.x / max(uResolution.y, 1.0);

  float t = uTime * 0.025;
  float n1 = snoise(p * 1.1 + vec2(t, -t * 0.7));
  float n2 = snoise(p * 2.2 + vec2(-t * 0.8, t) + n1 * 0.6);
  float n = 0.5 + 0.5 * (n1 * 0.6 + n2 * 0.4);

  // barely-there darkening cloud, strongest toward the upper area
  float alpha = smoothstep(0.5, 1.0, n) * 0.07;
  alpha *= smoothstep(1.25, 0.15, length(uv - vec2(0.5, 0.32)));

  float grain = (rand(gl_FragCoord.xy) - 0.5) * 0.02;
  alpha = clamp(alpha + grain, 0.0, 0.09);

  vec3 tint = vec3(0.04, 0.04, 0.05);
  gl_FragColor = vec4(tint, alpha);
}
`;

const vertex = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

export default function ShaderField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const container = wrapRef.current;
    if (!canvas || !container) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        canvas,
        alpha: true,
        premultipliedAlpha: false,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      });
    } catch {
      return; // no WebGL — CSS fallback stays visible
    }

    const gl = renderer.gl;
    if (gl.isContextLost()) return; // e.g. HMR reused a canvas with a lost context
    gl.clearColor(0, 0, 0, 0);

    const program = new Program(gl, {
      vertex,
      fragment,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1] },
      },
    });
    // Bail if the program failed to link (invalid context) — CSS fallback stays.
    if (!gl.getProgramParameter(program.program, gl.LINK_STATUS)) {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return;
    }
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    function resize() {
      const rect = container!.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      renderer.setSize(rect.width, rect.height);
      // OGL writes inline px on the canvas; force it to always fill the wrapper
      // so the buffer stretches gracefully even if a measure is ever stale.
      canvas!.style.width = "100%";
      canvas!.style.height = "100%";
      program.uniforms.uResolution.value = [gl.drawingBufferWidth, gl.drawingBufferHeight];
    }
    resize();
    // layout may not be settled on the dynamic-import mount — correct next frame.
    const rafResize = requestAnimationFrame(() => requestAnimationFrame(resize));
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let raf = 0;
    let running = true;
    const start = performance.now();
    function loop(now: number) {
      if (!running) return;
      if (gl.isContextLost()) {
        running = false;
        return;
      }
      program.uniforms.uTime.value = (now - start) / 1000;
      try {
        renderer.render({ scene: mesh });
      } catch {
        running = false; // degrade to CSS fallback rather than spamming errors
        return;
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    function onVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      cancelAnimationFrame(rafResize);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      // NOTE: intentionally do NOT loseContext here. React StrictMode (dev)
      // unmounts then remounts with the SAME canvas; losing the context would
      // leave the remount with a dead context. The context is released on GC.
    };
  }, []);

  return (
    <div ref={wrapRef} aria-hidden className="absolute inset-0">
      <canvas ref={ref} className="block h-full w-full" />
    </div>
  );
}
