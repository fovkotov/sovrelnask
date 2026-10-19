import { createSticker } from "./vendor/sticker-forge.es.js";

// Same peel parameters, tease timings and circle-grab as peel-sticker/app.js.
const STICKER_W = 326;
const STICKER_H = 57;
const PAD = 64;
const BG = "#DBDFE7";
const PIN = "#A68AFF";
const HOLE_L = 6.73047;
const HOLE_T = 6.7334;
const HOLE_R = 50.3525;
const HOLE_B = 50.3555;
const CIRCLE_CX = HOLE_L + (HOLE_R - HOLE_L) / 2;
const CIRCLE_CY = HOLE_T + (HOLE_B - HOLE_T) / 2;
const CIRCLE_R = (HOLE_R - HOLE_L) / 2;
const LABEL = "испытатели Алисы";

const INTERACTION_DEFAULTS = {
  peel: {
    radius: 0.15,
    stiffness: 0.26,
    grabWidth: 56,
    maxAngle: 3.35,
    detachThreshold: 0.54,
    residue: false,
    surfaceShadow: false,
    release: "snap",
  },
  tilt: 0,
  wind: 0,
  sound: { enabled: true, volume: 0.46 },
};

const stageW = STICKER_W + PAD * 2;
const stageH = STICKER_H + PAD * 2;

const cta = document.querySelector(".testers-cta");
if (cta) {
  const peel = document.createElement("div");
  peel.className = "testers-peel";
  const target = document.createElement("div");
  target.className = "testers-peel-target";
  const hit = document.createElement("button");
  hit.className = "testers-peel-hit";
  hit.type = "button";
  hit.setAttribute("aria-label", LABEL);
  peel.append(target, hit);
  cta.append(peel);

  let sticker;
  let teasing = true;
  let teaseTimer = 0;

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Не загрузился ${src}`));
      img.src = src;
    });
  }

  async function waitForFonts() {
    await document.fonts.load('500 15px "YS Text Compact"').catch(() => {});
    await document.fonts.ready;
  }

  async function makeStickerDataUrl() {
    await waitForFonts();
    const [badge, arrow] = await Promise.all([
      loadImage("./assets/fig/testers-badge.svg"),
      loadImage("./assets/fig/testers-arrow.svg"),
    ]);
    const scale = 4;
    const canvas = document.createElement("canvas");
    canvas.width = stageW * scale;
    canvas.height = stageH * scale;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.translate(PAD, PAD);

    ctx.fillStyle = BG;
    ctx.beginPath();
    ctx.arc(CIRCLE_CX, CIRCLE_CY, CIRCLE_R, 0, Math.PI * 2);
    ctx.fill();

    ctx.drawImage(badge, 0, 0, STICKER_W, STICKER_H);
    ctx.drawImage(arrow, CIRCLE_CX - 12, CIRCLE_CY - 12, 24, 24);

    ctx.font = '500 15px "YS Text Compact", sans-serif';
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(LABEL, 100.5, 18.5 + 10);

    return canvas.toDataURL("image/png");
  }

  function cancelTease() {
    teasing = false;
    if (teaseTimer) {
      cancelAnimationFrame(teaseTimer);
      teaseTimer = 0;
    }
  }

  function animatePeel(from, to, ms, motion) {
    return new Promise((resolve) => {
      const start = performance.now();
      const tick = (now) => {
        if (!teasing) {
          resolve();
          return;
        }
        const t = Math.min(1, (now - start) / ms);
        const eased = 1 - (1 - t) ** 3;
        sticker.setPeelProgress(from + (to - from) * eased, motion);
        if (t < 1) teaseTimer = requestAnimationFrame(tick);
        else resolve();
      };
      teaseTimer = requestAnimationFrame(tick);
    });
  }

  async function playTease() {
    const motion = {
      origin: { x: 0.02, y: 0.5 },
      target: { x: 0.28, y: 0.48 },
    };
    await new Promise((r) => setTimeout(r, 900));
    if (!teasing) return;
    await animatePeel(0, 0.2, 700, motion);
    if (!teasing) return;
    await new Promise((r) => setTimeout(r, 420));
    if (!teasing) return;
    await animatePeel(0.2, 0, 500, motion);
  }

  function disableHintOverlays(engine) {
    engine.startInteractionHint = () => {
      engine.interactionHintActive = false;
      engine.interactionHintElapsed = 0;
      if (engine.uniforms?.uInteractionHint) {
        engine.uniforms.uInteractionHint.value = 0;
      }
    };
    engine.interactionHintActive = false;
    engine.interactionHintElapsed = 0;
    if (engine.uniforms?.uInteractionHint) {
      engine.uniforms.uInteractionHint.value = 0;
    }
    engine.setBackgroundRemovalEffect?.(false);
  }

  function circleUV() {
    return {
      u0: (PAD + CIRCLE_CX) / stageW,
      v0: (PAD + CIRCLE_CY) / stageH,
      ru: (CIRCLE_R + 2) / stageW,
      rv: (CIRCLE_R + 2) / stageH,
    };
  }

  function circleLocalPoint(engine) {
    const { u0, v0 } = circleUV();
    const point = engine.grabOrigin.clone();
    point.set((u0 - 0.5) * engine.meshWidth, (0.5 - v0) * engine.meshHeight);
    return point;
  }

  function rightInward(engine) {
    const inward = engine.grabDirection.clone();
    inward.set(1, 0);
    return inward;
  }

  function hitCircleInterior(engine, local) {
    const { u0, v0, ru, rv } = circleUV();
    const u = local.x / engine.meshWidth + 0.5;
    const vCss = 0.5 - local.y / engine.meshHeight;
    const du = (u - u0) / ru;
    const dv = (vCss - v0) / rv;
    if (du * du + dv * dv > 1) return null;
    return { local: local.clone(), inward: rightInward(engine) };
  }

  function forceCircleGrab(engine) {
    return { local: circleLocalPoint(engine), inward: rightInward(engine) };
  }

  function enableFreePeelFromCircle(engine) {
    engine.hitEdge = (local) => hitCircleInterior(engine, local);
  }

  // Under 768px the stage uses CSS zoom. Pointer clientX/clientY are visual
  // pixels, but in this browser getBoundingClientRect stays in layout pixels.
  // Sticker-forge subtracts that rect from the pointer, so the circle — which
  // sits on a canvas much wider than the plaque — is hundreds of pixels away
  // from the mapped point. The first pointermove then exceeds detachThreshold
  // and the paper flies off. When the rect already includes zoom, the spaces
  // match and the scale stays 1.
  function layoutPointerScale() {
    const stage = cta.closest(".stage");
    if (!stage) return 1;
    const cssZoom = parseFloat(getComputedStyle(stage).zoom);
    if (!Number.isFinite(cssZoom) || cssZoom <= 0 || Math.abs(cssZoom - 1) < 0.001) return 1;
    const layoutW = stage.offsetWidth;
    if (!layoutW) return cssZoom;
    const rectScale = stage.getBoundingClientRect().width / layoutW;
    if (Math.abs(rectScale / cssZoom - 1) < Math.abs(rectScale - 1)) return 1;
    return cssZoom;
  }

  function bindCirclePointer(engine) {
    const canvas = engine.renderer.domElement;
    const screenToLocal = engine.screenToLocal.bind(engine);
    engine.screenToLocal = (clientX, clientY) => {
      const scale = layoutPointerScale();
      return screenToLocal(clientX / scale, clientY / scale);
    };
    canvas.style.pointerEvents = "none";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.tabIndex = -1;
    canvas.setAttribute("aria-hidden", "true");
    canvas.setPointerCapture = (id) => {
      try {
        hit.setPointerCapture(id);
      } catch {
        /* the hit layer may already own the pointer */
      }
    };
    canvas.releasePointerCapture = (id) => {
      try {
        hit.releasePointerCapture(id);
      } catch {
        /* already released */
      }
    };
    canvas.hasPointerCapture = (id) => hit.hasPointerCapture(id);

    hit.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      cancelTease();
      const patched = engine.hitEdge;
      engine.hitEdge = (local) => patched.call(engine, local) || forceCircleGrab(engine);
      try {
        engine.onPointerDown(event);
      } finally {
        engine.hitEdge = patched;
      }
    });
    hit.addEventListener("pointermove", (event) => {
      engine.onPointerMove(event);
    });
    hit.addEventListener("pointerup", (event) => {
      engine.onPointerUp(event);
    });
    hit.addEventListener("pointercancel", (event) => {
      engine.onPointerUp(event);
    });
  }

  function whenShown() {
    const app = document.getElementById("app");
    if (!app || (!app.hidden && cta.getBoundingClientRect().width > 0)) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const obs = new MutationObserver(() => {
        if (app.hidden) return;
        obs.disconnect();
        requestAnimationFrame(() => resolve());
      });
      obs.observe(app, { attributes: true, attributeFilter: ["hidden"] });
    });
  }

  async function start() {
    await whenShown();
    const src = await makeStickerDataUrl();
    sticker = await createSticker(target, {
      source: {
        type: "image",
        src,
        name: "testers-alice.png",
        padding: 0,
      },
      display: { width: stageW, height: stageH },
      outline: { width: 0, color: PIN },
      edge: { width: 1.6, strength: 0.55 },
      shadow: {
        color: "#3b2a63",
        opacity: 0,
        blur: 0,
        distance: 0,
        angle: 48,
      },
      lighting: {
        direction: { x: -0.42, y: 0.48, z: 0.76 },
        intensity: 0.92,
        ambient: 0.42,
        softness: 0.55,
      },
      peel: { ...INTERACTION_DEFAULTS.peel },
      back: { color: "#c9c9ce", gloss: 0.88, roughness: 0.16 },
      material: { type: "original", intensity: 0.7, scale: 1 },
      sound: { ...INTERACTION_DEFAULTS.sound },
      tilt: INTERACTION_DEFAULTS.tilt,
      wind: INTERACTION_DEFAULTS.wind,
      quality: "high",
    });

    const engine = sticker.renderer;
    enableFreePeelFromCircle(engine);
    disableHintOverlays(engine);
    sticker.setBackgroundRemovalEffect?.(false);
    engine.startEntranceAnimation = () => {
      engine.reset();
    };
    engine.entranceActive = false;
    engine.clearEntrancePose?.();
    bindCirclePointer(engine);
    engine.entranceActive = false;
    engine.reset();
    engine.requestRender();
    cta.classList.add("is-ready");

    target.addEventListener("peelstart", () => {
      cancelTease();
      cta.classList.add("is-peeling");
    });
    target.addEventListener("peelend", () => {
      cta.classList.remove("is-peeling");
    });

    window.addEventListener("resize", () => {
      sticker.resize();
    });

    playTease();
  }

  start().catch((error) => {
    console.error(error);
  });
}
