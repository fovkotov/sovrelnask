import { createSticker } from "./vendor/sticker-forge.es.js";

// Same peel parameters, tease timings and circle-grab as testers-peel.js / peel-sticker/app.js.
const PAD = 64;
const BG = "#DBDFE7";
const PIN = "#A68AFF";
const DETACH = 0.54;
const LABEL = "Новое носимое ИИ-устройство с Алисой AI";

const INTERACTION_DEFAULTS = {
  peel: {
    radius: 0.15,
    stiffness: 0.26,
    grabWidth: 56,
    maxAngle: 3.35,
    detachThreshold: DETACH,
    residue: false,
    surfaceShadow: false,
    release: "snap",
  },
  tilt: 0,
  wind: 0,
  sound: { enabled: true, volume: 0.46 },
};

const cta = document.querySelector(".preview-cta");
const preview = document.getElementById("preview");
if (cta && preview) {
  const peel = document.createElement("div");
  peel.className = "preview-peel";
  const target = document.createElement("div");
  target.className = "preview-peel-target";
  const hit = document.createElement("button");
  hit.className = "preview-peel-hit";
  hit.type = "button";
  hit.setAttribute("aria-label", LABEL);
  peel.append(target, hit);
  cta.append(peel);

  let sticker;
  let teasing = true;
  let teaseTimer = 0;
  let pinning = false;
  let generation = 0;
  let shape = null;
  let pointerAbort = null;

  function metrics() {
    const mobile = window.matchMedia("(max-width: 768px)").matches;
    if (mobile) {
      return { w: 353, h: 68, radius: 31, circle: 56, inset: 6, arrow: 30, arrowSrc: "./assets/fig/preview/cta-icon.svg" };
    }
    return { w: 474, h: 56, radius: 26, circle: 44, inset: 6, arrow: 24, arrowSrc: "./assets/fig/preview/desk-cta.svg" };
  }

  function stageOf(m) {
    return { w: m.w + PAD * 2, h: m.h + PAD * 2 };
  }

  function placePeel(m) {
    const stage = stageOf(m);
    const boxW = stage.w * 3;
    const boxH = stage.h * 3;
    peel.style.left = -(stage.w + PAD) + "px";
    peel.style.top = -(stage.h + PAD) + "px";
    peel.style.width = boxW + "px";
    peel.style.height = boxH + "px";
    const cx = m.inset + m.circle / 2;
    const cy = m.h / 2;
    const hitSize = m.circle + 4;
    hit.style.left = stage.w + PAD + cx - hitSize / 2 + "px";
    hit.style.top = stage.h + PAD + cy - hitSize / 2 + "px";
    hit.style.width = hitSize + "px";
    hit.style.height = hitSize + "px";
  }

  function circleGeom(m) {
    const stage = stageOf(m);
    const cx = m.inset + m.circle / 2;
    const cy = m.h / 2;
    const r = m.circle / 2;
    return {
      cx,
      cy,
      r,
      u0: (PAD + cx) / stage.w,
      v0: (PAD + cy) / stage.h,
      ru: (r + 2) / stage.w,
      rv: (r + 2) / stage.h,
    };
  }

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

  function roundPill(ctx, m) {
    const r = m.radius;
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.arcTo(m.w, 0, m.w, m.h, r);
    ctx.arcTo(m.w, m.h, 0, m.h, r);
    ctx.arcTo(0, m.h, 0, 0, r);
    ctx.arcTo(0, 0, m.w, 0, r);
    ctx.closePath();
  }

  async function makeStickerDataUrl(m) {
    await waitForFonts();
    const arrow = await loadImage(m.arrowSrc);
    const stage = stageOf(m);
    const scale = 4;
    const canvas = document.createElement("canvas");
    canvas.width = stage.w * scale;
    canvas.height = stage.h * scale;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.translate(PAD, PAD);

    ctx.fillStyle = PIN;
    roundPill(ctx, m);
    ctx.fill();

    const { cx, cy, r } = circleGeom(m);
    ctx.fillStyle = BG;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.drawImage(arrow, cx - m.arrow / 2, cy - m.arrow / 2, m.arrow, m.arrow);

    ctx.font = '500 15px "YS Text Compact", sans-serif';
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Новое носимое", m.w / 2, m.h / 2 - 10);
    ctx.fillText("ИИ-устройство с Алисой AI", m.w / 2, m.h / 2 + 10);

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
        if (!teasing || !sticker) {
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

  function circleLocalPoint(engine, m) {
    const { u0, v0 } = circleGeom(m);
    const point = engine.grabOrigin.clone();
    point.set((u0 - 0.5) * engine.meshWidth, (0.5 - v0) * engine.meshHeight);
    return point;
  }

  function rightInward(engine) {
    const inward = engine.grabDirection.clone();
    inward.set(1, 0);
    return inward;
  }

  function hitCircleInterior(engine, local, m) {
    const { u0, v0, ru, rv } = circleGeom(m);
    const u = local.x / engine.meshWidth + 0.5;
    const vCss = 0.5 - local.y / engine.meshHeight;
    const du = (u - u0) / ru;
    const dv = (vCss - v0) / rv;
    if (du * du + dv * dv > 1) return null;
    return { local: local.clone(), inward: rightInward(engine) };
  }

  function forceCircleGrab(engine, m) {
    return { local: circleLocalPoint(engine, m), inward: rightInward(engine) };
  }

  function layoutPointerScale() {
    const cssZoom = parseFloat(getComputedStyle(preview).zoom);
    if (!Number.isFinite(cssZoom) || cssZoom <= 0 || Math.abs(cssZoom - 1) < 0.001) return 1;
    const layoutW = preview.offsetWidth;
    if (!layoutW) return cssZoom;
    const rectScale = preview.getBoundingClientRect().width / layoutW;
    if (Math.abs(rectScale / cssZoom - 1) < Math.abs(rectScale - 1)) return 1;
    return cssZoom;
  }

  function syncPin() {
    const sheet = document.getElementById("preview-sheet");
    if (!pinning) {
      cta.style.transform = "";
      sheet?.classList.remove("is-sticker-held");
      return;
    }
    sheet?.classList.add("is-sticker-held");
  }

  let opened = false;
  function openCurtain() {
    if (opened) return;
    opened = true;
    pinning = false;
    syncPin();
    if (typeof window.pinPreviewOpen === "function") window.pinPreviewOpen();
  }

  function bindCirclePointer(engine, m) {
    if (pointerAbort) pointerAbort.abort();
    pointerAbort = new AbortController();
    const listen = { signal: pointerAbort.signal };
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
      pinning = true;
      syncPin();
      const patched = engine.hitEdge;
      engine.hitEdge = (local) => patched.call(engine, local) || forceCircleGrab(engine, m);
      try {
        engine.onPointerDown(event);
      } finally {
        engine.hitEdge = patched;
      }
    }, listen);
    hit.addEventListener("pointermove", (event) => {
      engine.onPointerMove(event);
    }, listen);
    hit.addEventListener("pointerup", (event) => {
      engine.onPointerUp(event);
    }, listen);
    hit.addEventListener("pointercancel", (event) => {
      engine.onPointerUp(event);
    }, listen);
  }

  function whenShown() {
    if (!preview.hidden && cta.getBoundingClientRect().width > 0) return Promise.resolve();
    return new Promise((resolve) => {
      const obs = new MutationObserver(() => {
        if (preview.hidden) return;
        obs.disconnect();
        requestAnimationFrame(() => resolve());
      });
      obs.observe(preview, { attributes: true, attributeFilter: ["hidden"] });
    });
  }

  async function start() {
    const gen = ++generation;
    if (sticker) {
      sticker.destroy();
      sticker = null;
    }
    cta.classList.remove("is-ready", "is-peeling");
    const m = metrics();
    shape = { w: m.w, h: m.h };
    placePeel(m);
    await whenShown();
    if (gen !== generation) return;
    const src = await makeStickerDataUrl(m);
    if (gen !== generation) return;
    const stage = stageOf(m);
    sticker = await createSticker(target, {
      source: {
        type: "image",
        src,
        name: "preview-cta.png",
        padding: 0,
      },
      display: { width: stage.w, height: stage.h },
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
    if (gen !== generation) {
      sticker.destroy();
      sticker = null;
      return;
    }

    const engine = sticker.renderer;
    engine.hitEdge = (local) => hitCircleInterior(engine, local, m);
    disableHintOverlays(engine);
    sticker.setBackgroundRemovalEffect?.(false);
    engine.startEntranceAnimation = () => {
      engine.reset();
    };
    engine.entranceActive = false;
    engine.clearEntrancePose?.();
    bindCirclePointer(engine, m);
    engine.entranceActive = false;
    engine.reset();
    engine.requestRender();
    cta.classList.add("is-ready");

    teasing = true;
    playTease();
  }

  target.addEventListener("peelstart", () => {
    cancelTease();
    pinning = true;
    cta.classList.add("is-peeling");
    syncPin();
  });
  target.addEventListener("peelend", (event) => {
    cta.classList.remove("is-peeling");
    if (!event.detail?.willReset) return;
    pinning = false;
    syncPin();
  });
  target.addEventListener("detachcomplete", () => {
    openCurtain();
  });

  window.addEventListener("resize", () => {
    const next = metrics();
    if (shape && next.w === shape.w && next.h === shape.h) {
      sticker?.resize();
      return;
    }
    cancelTease();
    start().catch((error) => console.error(error));
  });

  start().catch((error) => {
    console.error(error);
  });
}
