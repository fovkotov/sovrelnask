const GATE_KEY = "pin-landing-unlocked";
const PASS = "pinpinpin";

function unlock() {
  sessionStorage.setItem(GATE_KEY, "1");
}

function showApp() {
  document.getElementById("gate").hidden = true;
  document.getElementById("app").hidden = false;
  document.documentElement.classList.remove("is-preview");
  requestAnimationFrame(() => initStackCards());
}

function initGate() {
  const params = new URLSearchParams(location.search);
  if (params.get("key") === PASS) {
    unlock();
    params.delete("key");
    const query = params.toString();
    history.replaceState(null, "", location.pathname + (query ? `?${query}` : "") + location.hash);
  }

  if (sessionStorage.getItem(GATE_KEY) === "1") {
    showApp();
    return;
  }

  const gate = document.getElementById("gate");
  const error = document.getElementById("gate-error");
  gate.hidden = false;
  gate.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = document.getElementById("gate-pass").value.trim();
    if (value === PASS) {
      unlock();
      showApp();
      return;
    }
    error.hidden = false;
  });
  document.getElementById("gate-pass").focus();
}

function initSignup() {
  const openBtn = document.querySelector(".buy-cta");
  const root = document.getElementById("signup");
  const form = document.getElementById("signup-form");
  if (!openBtn || !root || !form) return;

  const email = form.querySelector(".signup-email");

  function openSignup() {
    root.hidden = false;
    document.body.style.overflow = "hidden";
    email.focus();
  }

  function closeSignup() {
    if (root.hidden) return;
    root.hidden = true;
    const terms = document.getElementById("terms");
    const hardware = document.getElementById("hardware");
    const specs = document.getElementById("specs");
    const still = (terms && !terms.hidden) || (hardware && !hardware.hidden) || (specs && !specs.hidden);
    if (!still) document.body.style.overflow = "";
    openBtn.focus();
  }

  root.querySelector(".signup-backdrop").addEventListener("click", closeSignup);
  root.querySelector(".signup-close").addEventListener("click", closeSignup);

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || root.hidden) return;
    closeSignup();
    event.stopImmediatePropagation();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

function initTerms() {
  const openBtn = document.getElementById("plans-terms");
  const root = document.getElementById("terms");
  const sheet = root && root.querySelector(".terms-sheet");
  if (!openBtn || !root || !sheet) return;

  const tabs = [...sheet.querySelectorAll(".terms-tab")];
  const panels = [...sheet.querySelectorAll(".terms-panel")];
  const scroller = sheet;

  function syncScroll() {
    const signup = document.getElementById("signup");
    const hardware = document.getElementById("hardware");
    const specs = document.getElementById("specs");
    const open = !root.hidden || (signup && !signup.hidden) || (hardware && !hardware.hidden) || (specs && !specs.hidden);
    document.body.style.overflow = open ? "hidden" : "";
  }

  function openTerms() {
    root.hidden = false;
    syncScroll();
    const current = tabs.find((tab) => tab.getAttribute("aria-selected") === "true");
    (current || tabs[0]).focus();
  }

  function closeTerms() {
    if (root.hidden) return;
    root.hidden = true;
    syncScroll();
    openBtn.focus();
  }

  function selectTab(name) {
    sheet.dataset.tab = name;
    for (const tab of tabs) {
      const on = tab.dataset.tab === name;
      tab.setAttribute("aria-selected", on ? "true" : "false");
      tab.tabIndex = on ? 0 : -1;
    }
    for (const panel of panels) panel.hidden = panel.dataset.panel !== name;
    if (scroller) scroller.scrollTop = 0;
  }

  openBtn.addEventListener("click", openTerms);
  openBtn.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openTerms();
  });

  sheet.querySelector(".terms-close").addEventListener("click", closeTerms);
  sheet.querySelector(".terms-notify").addEventListener("click", () => {
    const buy = document.querySelector(".buy-cta");
    if (buy) buy.click();
  });

  for (const tab of tabs) {
    tab.addEventListener("click", () => {
      selectTab(tab.dataset.tab);
      tab.focus();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || root.hidden) return;
    const signup = document.getElementById("signup");
    if (signup && !signup.hidden) return;
    closeTerms();
  });
}

function initHardware() {
  const root = document.getElementById("hardware");
  if (!root) return;
  const closeBtn = root.querySelector(".hardware-close");

  function syncScroll() {
    const signup = document.getElementById("signup");
    const terms = document.getElementById("terms");
    const specs = document.getElementById("specs");
    const open = !root.hidden || (signup && !signup.hidden) || (terms && !terms.hidden) || (specs && !specs.hidden);
    document.body.style.overflow = open ? "hidden" : "";
  }

  function closeHardware() {
    if (root.hidden) return;
    root.hidden = true;
    syncScroll();
  }

  if (closeBtn) closeBtn.addEventListener("click", closeHardware);

  const notify = root.querySelector(".hardware-notify");
  if (notify) {
    notify.addEventListener("click", () => {
      const buy = document.querySelector(".buy-cta");
      if (buy) buy.click();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || root.hidden) return;
    const signup = document.getElementById("signup");
    if (signup && !signup.hidden) return;
    closeHardware();
  });
}

function initSpecs() {
  const openBtn = document.querySelector(".footer-specs");
  const root = document.getElementById("specs");
  if (!openBtn || !root) return;
  const closeBtn = root.querySelector(".specs-close");

  function syncScroll() {
    const signup = document.getElementById("signup");
    const terms = document.getElementById("terms");
    const hardware = document.getElementById("hardware");
    const open = !root.hidden || (signup && !signup.hidden) || (terms && !terms.hidden) || (hardware && !hardware.hidden);
    document.body.style.overflow = open ? "hidden" : "";
  }

  function openSpecs() {
    root.hidden = false;
    syncScroll();
    if (closeBtn) closeBtn.focus();
  }

  function closeSpecs() {
    if (root.hidden) return;
    root.hidden = true;
    syncScroll();
    openBtn.focus();
  }

  openBtn.addEventListener("click", (event) => {
    event.preventDefault();
    openSpecs();
  });

  if (closeBtn) closeBtn.addEventListener("click", closeSpecs);

  const notify = root.querySelector(".specs-notify");
  if (notify) {
    notify.addEventListener("click", () => {
      const buy = document.querySelector(".buy-cta");
      if (buy) buy.click();
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || root.hidden) return;
    const signup = document.getElementById("signup");
    if (signup && !signup.hidden) return;
    closeSpecs();
  });
}

initGate();
initSignup();
initTerms();
initHardware();
initSpecs();
initLabWheel();
initFooterWheel();

function initLabWheel() {
  const wheels = [...document.querySelectorAll(".lab-wheel")];
  const track = document.querySelector(".lab-wheel[data-lab-track]");
  const disc = wheels.find((el) => el !== track);
  const rotor = disc && disc.querySelector(":scope > div");
  const plate = rotor && rotor.querySelector(":scope > div");
  if (!wheels.length || !track || !disc || !rotor || !plate) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const turn = 30;
  const baseMatch = /rotate\(\s*([-\d.]+)deg\)/.exec(rotor.style.transform || "");
  const baseDeg = baseMatch ? parseFloat(baseMatch[1]) : 0;
  const plateW = parseFloat(plate.style.width);
  const plateH = parseFloat(plate.style.height);
  const trackW = parseFloat(track.style.width);
  const trackH = parseFloat(track.style.height);
  let frame = 0;
  let tight = false;
  let ringNode = null;
  let cachedHeight = null;
  let spinning = false;
  let rotorText = "";
  let ringText = "";
  let fit = null;

  const anchor = document.createElement("div");
  anchor.className = "lab-anchor";
  anchor.style.cssText = "position:absolute;width:0;height:0;pointer-events:none;";
  anchor.style.left = (parseFloat(track.style.left) + trackW / 2) + "px";
  anchor.style.top = (parseFloat(track.style.top) + trackH / 2) + "px";
  track.parentElement.appendChild(anchor);

  function pct(value) {
    return value && value.endsWith("%") ? parseFloat(value) / 100 : 0;
  }

  function readStageZoom() {
    const stage = document.querySelector(".stage");
    if (!stage || !stage.offsetWidth) return 1;
    const width = stage.getBoundingClientRect().width;
    return width ? width / stage.offsetWidth : 1;
  }

  // Keep the spinning plate under the GPU texture limit (4096). The static
  // scale on .lab-fit restores the original CSS size, so the picture matches.
  function fitPlate() {
    const zoom = readStageZoom();
    const dpr = window.devicePixelRatio || 1;
    const px = plateW * dpr * zoom;
    const shrink = px > 3840 ? 3840 / px : 1;
    const w = plateW * shrink;
    const h = plateH * shrink;
    if (!fit) {
      fit = document.createElement("div");
      fit.className = "lab-fit";
      rotor.parentElement.insertBefore(fit, rotor);
      fit.appendChild(rotor);
    }
    plate.style.width = w + "px";
    plate.style.height = h + "px";
    fit.style.width = w + "px";
    fit.style.height = h + "px";
    fit.style.flex = "none";
    fit.style.transform = shrink < 0.999 ? "scale(" + (1 / shrink) + ")" : "";
    cachedHeight = null;
  }

  function cropRing(img) {
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    if (!nw || !nh) return null;
    const step = 4;
    const sw = Math.ceil(nw / step);
    const sh = Math.ceil(nh / step);
    const probe = document.createElement("canvas");
    probe.width = sw;
    probe.height = sh;
    const pctx = probe.getContext("2d", { willReadFrequently: true });
    pctx.drawImage(img, 0, 0, sw, sh);
    const data = pctx.getImageData(0, 0, sw, sh).data;
    let minX = sw;
    let minY = sh;
    let maxX = -1;
    let maxY = -1;
    for (let y = 0; y < sh; y++) {
      const row = y * sw;
      for (let x = 0; x < sw; x++) {
        if (data[(row + x) * 4 + 3] > 2) {
          if (x < minX) minX = x;
          if (y < minY) minY = y;
          if (x > maxX) maxX = x;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX < 0) return null;
    const pad = 12;
    const x0 = Math.max(0, minX * step - pad);
    const y0 = Math.max(0, minY * step - pad);
    const x1 = Math.min(nw, (maxX + 1) * step + pad);
    const y1 = Math.min(nh, (maxY + 1) * step + pad);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, x1 - x0);
    canvas.height = Math.max(1, y1 - y0);
    canvas.getContext("2d").drawImage(img, x0, y0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
    const tL = parseFloat(track.style.left);
    const tT = parseFloat(track.style.top);
    const imgL = tL + pct(img.style.left) * trackW;
    const imgT = tT + pct(img.style.top) * trackH;
    const qx = imgL + (x0 / nw) * trackW;
    const qy = imgT + (y0 / nh) * trackH;
    const qw = ((x1 - x0) / nw) * trackW;
    const qh = ((y1 - y0) / nh) * trackH;
    canvas.className = "lab-ring";
    canvas.style.position = "absolute";
    canvas.style.left = qx + "px";
    canvas.style.top = qy + "px";
    canvas.style.width = qw + "px";
    canvas.style.height = qh + "px";
    canvas.style.transformOrigin = (tL + trackW / 2 - qx) + "px " + (tT + trackH / 2 - qy) + "px";
    canvas.setAttribute("aria-hidden", "true");
    track.parentElement.appendChild(canvas);
    img.remove();
    return canvas;
  }

  // The plate PNG is 16-bit 3560². An 8-bit canvas at the same pixels is what
  // the screen can show, and the 16-bit decode can be dropped.
  function rasterPlate(img) {
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;
    if (!nw || !nh) return;
    const edge = Math.min(nw, 4096);
    const canvas = document.createElement("canvas");
    canvas.width = edge;
    canvas.height = Math.max(1, Math.round(nh * (edge / nw)));
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.style.cssText = img.style.cssText;
    canvas.setAttribute("aria-hidden", "true");
    img.replaceWith(canvas);
  }

  function prepare() {
    if (tight) return;
    const ringImg = track.querySelector("img");
    const plateImg = plate.querySelector("img");
    if (!ringImg || !plateImg || !ringImg.naturalWidth || !plateImg.naturalWidth) return;
    rotor.classList.add("lab-rotor");
    ringNode = cropRing(ringImg);
    fitPlate();
    rasterPlate(plateImg);
    disc.style.transform = "";
    track.style.transform = "";
    cachedHeight = track.getBoundingClientRect().height;
    if (!(cachedHeight > 1)) cachedHeight = null;
    tight = true;
    rotorText = "";
    ringText = "";
  }

  function paintSpin(progress, top) {
    const angle = (progress * turn).toFixed(3);
    const rotorNext = "rotate(" + (baseDeg + parseFloat(angle)).toFixed(3) + "deg)";
    const ringNext = "rotate(" + angle + "deg)";
    if (rotorNext !== rotorText) {
      rotorText = rotorNext;
      rotor.style.transform = rotorNext;
    }
    if (ringNode && ringNext !== ringText) {
      ringText = ringNext;
      ringNode.style.transform = ringNext;
    }
    const near = top < window.innerHeight + 240 && top + cachedHeight > -240;
    if (near !== spinning) {
      spinning = near;
      const hint = near ? "transform" : "auto";
      rotor.style.willChange = hint;
      if (ringNode) ringNode.style.willChange = hint;
    }
  }

  function apply() {
    frame = 0;
    if (!tight) prepare();
    if (!tight) return;
    if (reduce.matches) {
      const still = "rotate(" + baseDeg + "deg)";
      if (rotorText !== still) {
        rotorText = still;
        rotor.style.transform = still;
      }
      if (ringNode && ringText !== "") {
        ringText = "";
        ringNode.style.transform = "";
      }
      disc.style.transform = "";
      track.style.transform = "";
      return;
    }
    if (!(cachedHeight > 1)) {
      const measured = track.getBoundingClientRect().height;
      if (measured > 1) cachedHeight = measured;
    }
    if (!(cachedHeight > 1)) return;
    const center = anchor.getBoundingClientRect().top;
    const top = center - cachedHeight / 2;
    const vh = window.innerHeight;
    const total = cachedHeight + vh;
    const progress = total > 0 ? Math.min(1, Math.max(0, (vh - top) / total)) : 0;
    paintSpin(progress, top);
  }

  function requestTick() {
    if (frame) return;
    frame = requestAnimationFrame(apply);
  }

  function onResize() {
    cachedHeight = null;
    if (tight) fitPlate();
    requestTick();
  }

  // Stack writes its transforms first, then asks for the wheel angle so the
  // anchor read sees this frame's position and nothing reads after the spin.
  initLabWheel.flush = function () {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    apply();
  };

  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("scroll", requestTick, { passive: true });
    window.visualViewport.addEventListener("resize", onResize, { passive: true });
  }
  reduce.addEventListener("change", requestTick);
  const wait = [track.querySelector("img"), plate.querySelector("img")].filter(Boolean);
  wait.forEach((img) => {
    if (!img.complete) img.addEventListener("load", requestTick, { once: true });
  });
  if (document.readyState !== "complete") window.addEventListener("load", requestTick, { once: true });
  apply();
}

function initFooterWheel() {
  const wheel = document.querySelector(".footer-wheel");
  if (!wheel) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const start = -60;
  let frame = 0;

  function apply() {
    frame = 0;
    if (reduce.matches) {
      wheel.style.transform = "rotate(0deg)";
      return;
    }
    const scroller = document.scrollingElement || document.documentElement;
    const scrollY = window.scrollY || scroller.scrollTop || 0;
    const view = window.innerHeight;
    const scrollHeight = scroller.scrollHeight;
    const max = scrollHeight - view;
    if (max <= 4 || scrollY + view >= scrollHeight - 4) {
      wheel.style.transform = "rotate(0deg)";
      return;
    }
    const block = wheel.parentElement || wheel;
    const begin = scrollY + block.getBoundingClientRect().top - view;
    const span = max - begin;
    const progress = span > 1 ? Math.min(1, Math.max(0, (scrollY - begin) / span)) : 0;
    const angle = (1 - progress) * start;
    wheel.style.transform = "rotate(" + angle.toFixed(3) + "deg)";
  }

  function requestTick() {
    if (frame) return;
    frame = requestAnimationFrame(apply);
  }

  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("scroll", requestTick, { passive: true });
    window.visualViewport.addEventListener("resize", requestTick, { passive: true });
  }
  reduce.addEventListener("change", requestTick);
  apply();
}

initItogiDrag();

function initItogiDrag() {
  const viewport = document.querySelector(".itogi-screen");
  const ui = document.getElementById("itogi-ui");
  const track = document.querySelector(".itogi-track");
  const thumb = document.getElementById("itogi-thumb");
  if (!viewport || !ui || !track || !thumb) return;

  const designW = 375;
  let scroll = 0;
  let maxScroll = 0;

  function layout() {
    const width = viewport.clientWidth;
    // #app is hidden on the first pass, so clientWidth is 0. Writing scale(0)
    // sticks after unlock and the day summary stays blank until the thumb moves.
    if (width < 1) return;
    const scale = width / designW;
    const visualH = ui.offsetHeight * scale;
    maxScroll = Math.max(0, visualH - viewport.clientHeight);
    scroll = Math.min(Math.max(0, scroll), maxScroll);
    ui.style.transform = `translateY(${-scroll}px) scale(${scale})`;
    if (viewport.scrollTop) viewport.scrollTop = 0;
    if (viewport.scrollLeft) viewport.scrollLeft = 0;
    const travel = Math.max(0, track.clientHeight - thumb.offsetHeight);
    const y = maxScroll === 0 ? 0 : (scroll / maxScroll) * travel;
    thumb.style.translate = `0 ${y}px`;
    thumb.setAttribute("aria-valuenow", String(maxScroll === 0 ? 0 : Math.round((scroll / maxScroll) * 100)));
  }

  const phone = viewport.closest(".itogi-phone") || viewport;
  const scrollKeys = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "PageUp", "PageDown", "Home", "End", " ", "Spacebar"]);
  let drag = null;

  function blockScroll(event) {
    const node = event.target;
    if (!(node instanceof Element)) return;
    if (node.closest(".itogi-thumb")) return;
    if (node !== phone && node !== viewport && !phone.contains(node)) return;
    event.preventDefault();
  }

  function inPhone(event) {
    const node = event.target;
    return node instanceof Element && (phone.contains(node) || node === phone);
  }

  function freezeScrolled(event) {
    const node = event.target;
    if (!node || node.nodeType !== 1 || node === document.documentElement || node === document.body) return;
    if (!phone.contains(node) && node !== phone && node !== viewport) return;
    if (node.scrollTop) node.scrollTop = 0;
    if (node.scrollLeft) node.scrollLeft = 0;
  }

  function clipScrollports(root) {
    const nodes = [root, ...root.querySelectorAll("*")];
    nodes.forEach((el) => {
      const style = getComputedStyle(el);
      const blocks = (value) => value === "auto" || value === "scroll" || value === "hidden";
      const overflows = el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1;
      if (overflows && blocks(style.overflowX) && blocks(style.overflowY)) {
        el.style.setProperty("overflow", "clip", "important");
      }
    });
  }

  [phone, viewport].forEach((el) => {
    el.addEventListener("wheel", blockScroll, { passive: false });
    el.addEventListener("touchmove", blockScroll, { passive: false });
  });
  phone.addEventListener("dragstart", (event) => {
    if (inPhone(event)) event.preventDefault();
  }, { capture: true });
  phone.addEventListener("keydown", (event) => {
    if (scrollKeys.has(event.key) && inPhone(event)) event.preventDefault();
  }, { capture: true });
  phone.addEventListener("scroll", freezeScrolled, { capture: true });
  viewport.addEventListener("scroll", freezeScrolled, { capture: true });
  ui.inert = true;

  thumb.addEventListener("pointerdown", (event) => {
    if (event.button !== 0) return;
    event.preventDefault();
    thumb.setPointerCapture(event.pointerId);
    document.documentElement.style.userSelect = "none";
    document.documentElement.style.webkitUserSelect = "none";
    const zoom = track.offsetHeight ? track.getBoundingClientRect().height / track.offsetHeight : 1;
    const travel = Math.max(0, track.clientHeight - thumb.offsetHeight);
    const origin = maxScroll === 0 ? 0 : (scroll / maxScroll) * travel;
    drag = { id: event.pointerId, y: event.clientY, origin, zoom };
  });

  thumb.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    event.preventDefault();
    const travel = Math.max(0, track.clientHeight - thumb.offsetHeight);
    const dy = (event.clientY - drag.y) / (drag.zoom || 1);
    const next = Math.min(travel, Math.max(0, drag.origin + dy));
    scroll = travel === 0 ? 0 : (next / travel) * maxScroll;
    layout();
  });

  function endDrag(event) {
    if (!drag || event.pointerId !== drag.id) return;
    drag = null;
    document.documentElement.style.userSelect = "";
    document.documentElement.style.webkitUserSelect = "";
  }

  thumb.addEventListener("pointerup", endDrag);
  thumb.addEventListener("pointercancel", endDrag);

  thumb.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp" && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const step = maxScroll * 0.08;
    if (event.key === "ArrowDown") scroll += step;
    else if (event.key === "ArrowUp") scroll -= step;
    else if (event.key === "Home") scroll = 0;
    else scroll = maxScroll;
    layout();
  });

  function relayout() {
    layout();
    if (viewport.clientWidth < 1) return;
    clipScrollports(viewport);
  }

  ui.querySelectorAll("img").forEach((img) => {
    if (!img.complete) img.addEventListener("load", relayout, { once: true });
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  window.addEventListener("resize", relayout);
  if (typeof ResizeObserver === "function") {
    const ro = new ResizeObserver(() => relayout());
    ro.observe(viewport);
  }
  const app = document.getElementById("app");
  if (app && typeof MutationObserver === "function") {
    const mo = new MutationObserver(() => relayout());
    mo.observe(app, { attributes: true, attributeFilter: ["hidden"] });
  }
  relayout();
}

function initPlansSlider() {
  const root = document.querySelector("[data-plans-slider]");
  if (!root) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let origin = 0;
  let axis = null;
  let dragging = false;
  let lastX = 0;
  let lastT = 0;
  let velocity = 0;
  let frame = 0;

  function zoom() {
    const width = root.getBoundingClientRect().width;
    return root.offsetWidth ? width / root.offsetWidth : 1;
  }

  function limit() {
    return Math.max(0, root.scrollWidth - root.clientWidth);
  }

  function clamp(value) {
    return Math.min(limit(), Math.max(0, value));
  }

  root.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    cancelAnimationFrame(frame);
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    origin = root.scrollLeft;
    axis = null;
    dragging = false;
    lastX = event.clientX;
    lastT = performance.now();
    velocity = 0;
  });

  root.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (!axis) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (axis === "y") {
        pointerId = null;
        return;
      }
      dragging = true;
      root.classList.add("is-dragging");
      root.setPointerCapture(event.pointerId);
    }
    if (axis !== "x") return;
    const now = performance.now();
    const dt = now - lastT;
    if (dt > 0) {
      const instant = (event.clientX - lastX) / dt / zoom();
      velocity = velocity * 0.65 + instant * 0.35;
    }
    lastX = event.clientX;
    lastT = now;
    root.scrollLeft = clamp(origin - dx / zoom());
  });

  function end(event) {
    if (pointerId === null || event.pointerId !== pointerId) return;
    const moved = dragging;
    pointerId = null;
    dragging = false;
    axis = null;
    root.classList.remove("is-dragging");
    if (!moved || reduce.matches || Math.abs(velocity) < 0.05) return;
    let v = Math.max(-28, Math.min(28, -velocity * 16));
    let current = root.scrollLeft;
    const step = () => {
      v *= 0.92;
      current = clamp(current + v);
      root.scrollLeft = current;
      const hit = current <= 0 || current >= limit();
      if (Math.abs(v) > 0.35 && !hit) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  }

  root.addEventListener("pointerup", end);
  root.addEventListener("pointercancel", end);
  root.addEventListener("dragstart", (event) => event.preventDefault());
  root.addEventListener("touchmove", (event) => {
    if (axis === "x") event.preventDefault();
  }, { passive: false });

  root.addEventListener("wheel", (event) => {
    const absX = Math.abs(event.deltaX);
    const absY = Math.abs(event.deltaY);
    if (absX <= absY && !event.shiftKey) return;
    let delta = absX > absY ? event.deltaX : event.deltaY;
    if (event.deltaMode === 1) delta *= 16;
    else if (event.deltaMode === 2) delta *= root.clientWidth;
    const next = clamp(root.scrollLeft + delta / zoom());
    if (next === root.scrollLeft) return;
    root.scrollLeft = next;
    event.preventDefault();
  }, { passive: false });

  root.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const dir = event.key === "ArrowRight" ? 1 : -1;
    root.scrollLeft = clamp(root.scrollLeft + dir * 160);
  });
}

initPlansSlider();
initMemorySlider();
initDeviceSlider();

function initDeviceSlider() {
  const root = document.querySelector("[data-device-slider]");
  if (!root) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const rest = parseFloat(getComputedStyle(root).getPropertyValue("--device-rest"));
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let origin = 0;
  let axis = null;
  let dragging = false;
  let lastX = 0;
  let lastT = 0;
  let velocity = 0;
  let frame = 0;

  function zoom() {
    const width = root.getBoundingClientRect().width;
    return root.offsetWidth ? width / root.offsetWidth : 1;
  }

  function limit() {
    return Math.max(0, root.scrollWidth - root.clientWidth);
  }

  function clamp(value) {
    return Math.min(limit(), Math.max(0, value));
  }

  // Stack reparents this scroller after the first write, which drops scrollLeft
  // back to 0 and shows the face puck. Keep the side view centered until
  // the person actually drags. The track stays 375px; rest is not a snap.
  let touched = false;
  function frameRest() {
    if (touched || dragging || Number.isNaN(rest)) return;
    const max = limit();
    if (max <= 0) return;
    const target = Math.min(max, Math.max(0, rest));
    if (Math.abs(root.scrollLeft - target) < 1) return;
    root.scrollLeft = target;
  }
  root._pinDeviceRest = frameRest;

  frameRest();
  requestAnimationFrame(frameRest);
  const app = document.getElementById("app");
  if (app && app.hidden) {
    new MutationObserver(frameRest).observe(app, { attributes: true, attributeFilter: ["hidden"] });
  }

  root.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    cancelAnimationFrame(frame);
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    origin = root.scrollLeft;
    axis = null;
    dragging = false;
    lastX = event.clientX;
    lastT = performance.now();
    velocity = 0;
  });

  root.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (!axis) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (axis === "y") {
        pointerId = null;
        return;
      }
      dragging = true;
      touched = true;
      root.classList.add("is-dragging");
      root.setPointerCapture(event.pointerId);
    }
    if (axis !== "x") return;
    const now = performance.now();
    const dt = now - lastT;
    if (dt > 0) {
      const instant = (event.clientX - lastX) / dt / zoom();
      velocity = velocity * 0.65 + instant * 0.35;
    }
    lastX = event.clientX;
    lastT = now;
    root.scrollLeft = clamp(origin - dx / zoom());
  });

  function end(event) {
    if (pointerId === null || event.pointerId !== pointerId) return;
    const moved = dragging;
    pointerId = null;
    dragging = false;
    axis = null;
    root.classList.remove("is-dragging");
    if (!moved || reduce.matches || Math.abs(velocity) < 0.05) return;
    let v = Math.max(-28, Math.min(28, -velocity * 16));
    let current = root.scrollLeft;
    const step = () => {
      v *= 0.92;
      current = clamp(current + v);
      root.scrollLeft = current;
      const hit = current <= 0 || current >= limit();
      if (Math.abs(v) > 0.35 && !hit) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  }

  root.addEventListener("pointerup", end);
  root.addEventListener("pointercancel", end);
  root.addEventListener("dragstart", (event) => event.preventDefault());
  root.addEventListener("touchmove", (event) => {
    if (axis === "x") event.preventDefault();
  }, { passive: false });

  root.addEventListener("wheel", (event) => {
    const absX = Math.abs(event.deltaX);
    const absY = Math.abs(event.deltaY);
    if (absX <= absY && !event.shiftKey) return;
    let delta = absX > absY ? event.deltaX : event.deltaY;
    if (event.deltaMode === 1) delta *= 16;
    else if (event.deltaMode === 2) delta *= root.clientWidth;
    const next = clamp(root.scrollLeft + delta / zoom());
    if (next === root.scrollLeft) return;
    touched = true;
    root.scrollLeft = next;
    event.preventDefault();
  }, { passive: false });

  root.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    touched = true;
    const dir = event.key === "ArrowRight" ? 1 : -1;
    root.scrollLeft = clamp(root.scrollLeft + dir * 160);
  });
}

function initMemorySlider() {
  const root = document.querySelector("[data-memory-slider]");
  if (!root) return;
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let origin = 0;
  let axis = null;
  let dragging = false;
  let lastX = 0;
  let lastT = 0;
  let velocity = 0;
  let frame = 0;

  function zoom() {
    const width = root.getBoundingClientRect().width;
    return root.offsetWidth ? width / root.offsetWidth : 1;
  }

  function limit() {
    return Math.max(0, root.scrollWidth - root.clientWidth);
  }

  function clamp(value) {
    return Math.min(limit(), Math.max(0, value));
  }

  // Photo and whatever sits in the circle lag the card by 20% of its
  // travel from the home slot. Home is the first card's rest.
  const parallax = 0.2;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cards = [...root.querySelectorAll(".memory-card")];
  let slotsReady = false;

  function measureSlots() {
    if (!cards.length || root.offsetWidth < 1) return;
    const home = cards[0].offsetLeft;
    cards.forEach((card) => {
      card.dataset.memorySlot = String(card.offsetLeft - home);
    });
    slotsReady = true;
  }

  function syncParallax() {
    if (!cards.length) return;
    if (!slotsReady) measureSlots();
    const scrolled = root.scrollLeft;
    cards.forEach((card) => {
      const slot = slotsReady ? Number(card.dataset.memorySlot) : 0;
      const x = !reduce.matches && slotsReady ? parallax * (scrolled - slot) : 0;
      card.style.setProperty("--memory-shift", x.toFixed(2) + "px");
    });
  }

  function writeScroll(value) {
    root.scrollLeft = value;
    syncParallax();
  }

  root.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    cancelAnimationFrame(frame);
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    origin = root.scrollLeft;
    axis = null;
    dragging = false;
    lastX = event.clientX;
    lastT = performance.now();
    velocity = 0;
  });

  root.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (!axis) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (axis === "y") {
        pointerId = null;
        return;
      }
      dragging = true;
      root.classList.add("is-dragging");
      root.setPointerCapture(event.pointerId);
    }
    if (axis !== "x") return;
    const now = performance.now();
    const dt = now - lastT;
    if (dt > 0) {
      const instant = (event.clientX - lastX) / dt / zoom();
      velocity = velocity * 0.65 + instant * 0.35;
    }
    lastX = event.clientX;
    lastT = now;
    writeScroll(clamp(origin - dx / zoom()));
  });

  function end(event) {
    if (pointerId === null || event.pointerId !== pointerId) return;
    const moved = dragging;
    pointerId = null;
    dragging = false;
    axis = null;
    root.classList.remove("is-dragging");
    if (!moved || Math.abs(velocity) < 0.05) return;
    let v = Math.max(-28, Math.min(28, -velocity * 16));
    let current = root.scrollLeft;
    const step = () => {
      v *= 0.92;
      current = clamp(current + v);
      writeScroll(current);
      const hit = current <= 0 || current >= limit();
      if (Math.abs(v) > 0.35 && !hit) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  }

  root.addEventListener("pointerup", end);
  root.addEventListener("pointercancel", end);
  root.addEventListener("dragstart", (event) => event.preventDefault());
  root.addEventListener("touchmove", (event) => {
    if (axis === "x") event.preventDefault();
  }, { passive: false });

  root.addEventListener("wheel", (event) => {
    const absX = Math.abs(event.deltaX);
    const absY = Math.abs(event.deltaY);
    if (absX <= absY && !event.shiftKey) return;
    let delta = absX > absY ? event.deltaX : event.deltaY;
    if (event.deltaMode === 1) delta *= 16;
    else if (event.deltaMode === 2) delta *= root.clientWidth;
    cancelAnimationFrame(frame);
    const next = clamp(root.scrollLeft + delta / zoom());
    if (next === root.scrollLeft) return;
    writeScroll(next);
    event.preventDefault();
  }, { passive: false });

  root.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const dir = event.key === "ArrowRight" ? 1 : -1;
    writeScroll(clamp(root.scrollLeft + dir * 160));
  });

  root.addEventListener("scroll", syncParallax, { passive: true });
  window.addEventListener("resize", () => {
    slotsReady = false;
    syncParallax();
  });
  reduce.addEventListener("change", syncParallax);
  const app = document.getElementById("app");
  if (app && app.hidden) {
    new MutationObserver(() => {
      if (app.hidden) return;
      slotsReady = false;
      requestAnimationFrame(syncParallax);
    }).observe(app, { attributes: true, attributeFilter: ["hidden"] });
  }
  syncParallax();
}

initMeetScrub();

function initMeetScrub() {
  const track = document.querySelector(".meet-track");
  const pin = document.getElementById("meet-pin");
  const phone = pin && pin.querySelector(".meet-phone");
  const shots = pin ? [...pin.querySelectorAll(".meet-shot")] : [];
  const caps = pin ? [...pin.querySelectorAll(".meet-cap")] : [];
  const dim = pin && pin.querySelector(".meet-dim");
  const jewel = pin && pin.querySelector(".meet-pin-jewel");
  const ask = pin && pin.querySelector(".meet-ask");
  const home = pin && pin.querySelector(".meet-ask-home");
  const keyboard = pin && pin.querySelector(".meet-keyboard");
  const keyboardLip = pin && pin.querySelector(".meet-keyboard-lip");
  const stage = document.querySelector(".stage");
  const app = document.getElementById("app");
  if (!track || !pin || !phone || !dim || !jewel || !ask || !home || !keyboard || !keyboardLip || shots.length !== 7 || caps.length !== 7 || !stage || !app) return;
  const card = pin.querySelector(".meet-new-card");
  const feed = pin.querySelector(".meet-records-feed");
  if (!card || !feed) return;

  const fullScale = 329.3 / 226.29;
  const blockDesign = 692;
  const scrubDesign = 5000;
  const animMs = 380;
  const askMs = 200;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const marks = [100, 800, 1500, 2200, 2900, 3600, 4300, 4500];
  const scenes = [
    { shot: 0, cap: 0, scale: 1, jewel: 1, ask: 0, card: 0 },
    { shot: 1, cap: 1, scale: 1, jewel: 1, ask: 0, card: 0 },
    { shot: 2, cap: 2, scale: 1, jewel: 0, ask: 0, card: 0, x: -50 },
    { shot: 2, cap: 4, scale: fullScale, jewel: 1, ask: 0, card: 0 },
    { shot: 3, cap: 3, scale: 1, jewel: 1, ask: 0, card: 0 },
    { shot: 5, cap: 5, scale: fullScale, jewel: 1, ask: 1, card: 0 },
    { shot: 5, cap: 5, scale: fullScale, jewel: 1, ask: 1, card: 0 },
    { shot: 6, cap: 6, scale: 1, jewel: 1, ask: 0, card: 0 },
    { shot: 6, cap: 6, scale: 1, jewel: 1, ask: 0, card: 1 }
  ];
  let frame = 0;
  let from = 0;
  let to = 0;
  let u = 1;
  let u0 = 1;
  let started = 0;
  let playing = false;
  let desired = 0;

  function easeAsk(t) {
    const x1 = 0.5;
    const y1 = 0;
    const x2 = 0.25;
    const y2 = 1;
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    let u = t;
    for (let i = 0; i < 6; i++) {
      const cx = 3 * x1;
      const bx = 3 * (x2 - x1) - cx;
      const ax = 1 - cx - bx;
      const x = ((ax * u + bx) * u + cx) * u;
      const dx = (3 * ax * u + 2 * bx) * u + cx;
      if (Math.abs(dx) < 1e-6) break;
      u -= (x - t) / dx;
      if (u < 0) u = 0;
      else if (u > 1) u = 1;
    }
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;
    return ((ay * u + by) * u + cy) * u;
  }

  function zoomOf() {
    const n = parseFloat(getComputedStyle(stage).zoom);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }

  function sceneFor(dist) {
    let scene = 0;
    for (let i = 0; i < marks.length; i++) if (dist >= marks[i]) scene = i + 1;
    return scene;
  }

  function duration(a, b) {
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    if (lo === 5 && hi === 6) return askMs;
    return animMs;
  }

  function modeBetween(a, b) {
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    if (hi - lo !== 1) return "cut";
    if (lo === 0) return "slide";
    if (lo === 2) return "zoom";
    if (lo === 5) return "ask";
    if (lo === 6) return "down";
    if (lo === 7) return "card";
    return "blur";
  }

  function shownIndex() {
    if (!playing || u >= 1) return to;
    return u > 0.5 ? to : from;
  }

  function reverse(now) {
    const oldFrom = from;
    const shown = u;
    from = to;
    to = oldFrom;
    u0 = 1 - shown;
    u = u0;
    started = now;
    playing = true;
  }

  // Keyboard shot is on the zoomed anchor; the records shot is on the resting
  // one. A fast scroll used to skip that beat, so scale snapped and the
  // picture cut. Play it through, then chain whatever scene is waiting.
  function holdDown(target) {
    if (playing && from === 6 && to === 7 && target > 7) return true;
    if (playing && from === 7 && to === 6 && target < 6) return true;
    if (playing && from === 8 && to === 7 && target < 7) return true;
    return false;
  }

  function stepDown(base, target) {
    if ((base === 5 || base === 6) && target > 6) return [6, 7];
    if (base === 7 && target < 7) return [7, 6];
    if (base === 8 && target < 7) return [8, 7];
    return null;
  }

  function begin(now, target) {
    if (playing && target === to) return;
    if (playing && target === from) {
      reverse(now);
      return;
    }
    if (holdDown(target)) return;
    const base = shownIndex();
    if (target === base) {
      from = to = base;
      u = 1;
      u0 = 1;
      playing = false;
      return;
    }
    const down = stepDown(base, target);
    if (down) {
      from = down[0];
      to = down[1];
      u0 = 0;
      u = 0;
      started = now;
      playing = true;
      return;
    }
    const far = Math.abs(target - base) > 1;
    from = far ? (target > base ? target - 1 : target + 1) : base;
    to = far ? target : (target > base ? base + 1 : base - 1);
    u0 = 0;
    u = 0;
    started = now;
    playing = from !== to;
  }

  function advance(now) {
    if (!playing) return;
    const p = Math.min(1, (now - started) / duration(from, to));
    u = u0 + (1 - u0) * p;
    if (p < 1) return;
    u = 1;
    from = to;
    playing = false;
    if (desired !== to) begin(now, desired);
  }

  function seek(now, target) {
    desired = target;
    if (reduce.matches) {
      from = 0;
      to = 0;
      u = 1;
      u0 = 1;
      playing = false;
      return;
    }
    if (playing && target !== to) begin(now, target);
    else if (!playing && to !== target) begin(now, target);
    advance(now);
  }

  function clearShot(el) {
    el.style.opacity = "0";
    el.style.filter = "none";
    el.style.transform = "";
    el.style.zIndex = "2";
  }

  function showShot(index, opacity, blur, shift, shade) {
    const el = shots[index];
    if (!el) return;
    el.style.opacity = String(opacity);
    const parts = [];
    if (blur > 0.4) parts.push("blur(" + blur.toFixed(1) + "px)");
    if (shade > 0.004) parts.push("brightness(" + (1 - shade).toFixed(3) + ")");
    el.style.filter = parts.length ? parts.join(" ") : "none";
    el.style.transform = shift ? "translate3d(" + shift.toFixed(2) + "%,0,0)" : "";
  }

  function dimOff() {
    dim.style.opacity = "0";
    dim.style.zIndex = "1";
  }

  function dimOnOutgoing(outIndex, inIndex, opacity) {
    if (shots[outIndex]) shots[outIndex].style.zIndex = "2";
    if (shots[inIndex] && inIndex !== outIndex) shots[inIndex].style.zIndex = "4";
    dim.style.zIndex = "3";
    dim.style.opacity = String(opacity);
  }

  function cardMix(a, b, eased) {
    const ca = scenes[a].card;
    const cb = scenes[b].card;
    if (ca === cb) return ca;
    return b > a ? eased : 1 - eased;
  }

  let capShown = 0;
  let capWant = 0;
  let capBusy = false;
  const capExitMs = 111;
  const capExitStagger = 9;
  const capEnterMs = 155;
  const capEnterStagger = 15;
  const capEaseOut = "cubic-bezier(0.7, 0, 0.84, 0)";
  const capEaseIn = "cubic-bezier(0.16, 1, 0.3, 1)";

  function capWords(cap) {
    if (cap._words) return cap._words;
    const words = [];
    for (const node of cap.querySelectorAll(".meet-cap-title, .meet-cap-body")) {
      const parts = node.textContent.split(/(\u0020+)/);
      node.textContent = "";
      for (const part of parts) {
        if (!part) continue;
        if (part.trim() === "") {
          node.appendChild(document.createTextNode(part));
          continue;
        }
        const span = document.createElement("span");
        span.className = "meet-cap-word";
        span.textContent = part;
        node.appendChild(span);
        words.push(span);
      }
    }
    cap._words = words;
    return words;
  }

  function hideCap(cap) {
    cap.style.opacity = "0";
  }

  function showCapStill(cap) {
    cap.style.opacity = "1";
    for (const word of capWords(cap)) {
      word.getAnimations().forEach((anim) => anim.cancel());
      word.style.opacity = "1";
      word.style.transform = "translateY(0px)";
    }
  }

  function playWords(words, frames, duration, stagger, easing) {
    words.forEach((word, index) => {
      word.getAnimations().forEach((anim) => anim.cancel());
      word.animate(frames, { duration, delay: index * stagger, easing, fill: "forwards" });
    });
  }

  function runCap() {
    if (capWant === capShown) {
      capBusy = false;
      return;
    }
    const leave = caps[capShown];
    const next = capWant;
    capBusy = true;
    caps.forEach((cap, index) => {
      if (index !== capShown) hideCap(cap);
    });
    if (reduce.matches || !leave) {
      caps.forEach(hideCap);
      showCapStill(caps[next]);
      capShown = next;
      capBusy = false;
      if (capWant !== capShown) runCap();
      return;
    }
    const oldWords = capWords(leave);
    const exitTotal = Math.max(0, oldWords.length - 1) * capExitStagger + capExitMs;
    leave.style.opacity = "1";
    playWords(oldWords, [
      { opacity: 1, transform: "translateY(0px)" },
      { opacity: 0, transform: "translateY(-6px)" }
    ], capExitMs, capExitStagger, capEaseOut);
    window.setTimeout(() => {
      if (caps[capShown] !== leave) return;
      hideCap(leave);
      const enter = caps[capWant];
      capShown = capWant;
      if (!enter) {
        capBusy = false;
        return;
      }
      enter.style.opacity = "1";
      const fresh = capWords(enter);
      fresh.forEach((word) => {
        word.style.opacity = "0";
        word.style.transform = "translateY(8px)";
      });
      playWords(fresh, [
        { opacity: 0, transform: "translateY(8px)" },
        { opacity: 1, transform: "translateY(0px)" }
      ], capEnterMs, capEnterStagger, capEaseIn);
      const enterTotal = Math.max(0, fresh.length - 1) * capEnterStagger + capEnterMs;
      window.setTimeout(() => {
        capBusy = false;
        if (capWant !== capShown) runCap();
      }, enterTotal);
    }, exitTotal);
  }

  function queueCap(next) {
    if (next == null || next === capWant) return;
    capWant = next;
    if (!capBusy) runCap();
  }

  function blurSwap(outIndex, inIndex, linear) {
    if (outIndex === inIndex) {
      showShot(inIndex, 1, 0, 0, 0);
      dimOff();
      return;
    }
    if (linear < 0.5) {
      showShot(outIndex, 1, 18 * (linear / 0.5), 0, 0);
      showShot(inIndex, 0, 0, 0, 0);
      if (shots[outIndex]) shots[outIndex].style.zIndex = "4";
    } else {
      const k = (linear - 0.5) / 0.5;
      showShot(outIndex, 0, 0, 0, 0);
      showShot(inIndex, 1, 18 * (1 - k), 0, 0);
      if (shots[inIndex]) shots[inIndex].style.zIndex = "4";
    }
    dimOff();
  }

  function paint(a, b, linear) {
    const eased = a === b ? 1 : easeAsk(linear);
    const A = scenes[a];
    const B = scenes[b];
    const mode = modeBetween(a, b);
    shots.forEach(clearShot);
    if (a === b || mode === "ask") {
      showShot(B.shot, 1, 0, 0, 0);
      dimOff();
    } else if (mode === "slide") {
      const shown = b > a ? eased : 1 - eased;
      const lo = scenes[Math.min(a, b)].shot;
      const hi = scenes[Math.max(a, b)].shot;
      showShot(lo, 1, 0, 0, 0);
      showShot(hi, 1, 0, (1 - shown) * 100, 0);
      dimOnOutgoing(A.shot, B.shot, 0.22 * eased);
    } else if (mode === "card") {
      showShot(B.shot, 1, 0, 0, 0);
      dimOff();
    } else if (A.shot === B.shot) {
      showShot(B.shot, 1, 0, 0, 0);
      dimOff();
    } else {
      blurSwap(A.shot, B.shot, eased);
    }
    queueCap(B.cap);
    phone.style.transformOrigin = "center bottom";
    const phoneX = (A.x || 0) + ((B.x || 0) - (A.x || 0)) * eased;
    const rawScale = A.scale + (B.scale - A.scale) * eased;
    const rest = pin._rest == null ? 1 : pin._rest;
    const arrive = pin._arrive == null ? 1 : pin._arrive;
    const settled = 1 + (rest - 1) * arrive;
    let phoneScale = rawScale;
    if (rawScale < fullScale - 0.0001) {
      if (rawScale <= 1) phoneScale = settled;
      else phoneScale = settled + (fullScale - settled) * ((rawScale - 1) / (fullScale - 1));
    }
    phone.style.transform = "translate3d(" + phoneX.toFixed(2) + "px,0,0) scale(" + phoneScale + ")";
    if (reduce.matches) {
      jewel.style.visibility = "hidden";
    } else {
      const jewelK = A.jewel + (B.jewel - A.jewel) * eased;
      jewel.style.visibility = "";
      jewel.style.transform = "translateX(" + (jewelK * 118) + "px)";
    }
    const k = A.ask + (B.ask - A.ask) * eased;
    const kbH = keyboardHeight();
    const homeH = 20.627;
    const askGap = 8;
    const lift = k * Math.max(0, kbH - homeH + askGap);
    const slide = "translate3d(0," + ((1 - k) * (kbH + 2)).toFixed(2) + "px,0)";
    keyboard.style.transform = slide;
    keyboardLip.style.transform = slide;
    ask.style.transform = "translate3d(0," + (-lift).toFixed(2) + "px,0)";
    ask.style.setProperty("--ask-gap", (k * askGap).toFixed(2) + "px");
    home.style.transform = "translate3d(0,0,0)";
    home.style.backgroundColor = "rgba(232, 232, 232, " + (1 - k).toFixed(3) + ")";
    const askVisible = A.shot === 5 || B.shot === 5;
    ask.style.opacity = askVisible ? "1" : "0";
    home.style.opacity = askVisible ? "1" : "0";
    const cardK = cardMix(a, b, eased);
    const cardH = card.offsetHeight || 49;
    card.style.opacity = String(cardK);
    card.style.transform = "translate3d(0," + ((1 - cardK) * -cardH).toFixed(2) + "px,0)";
    card.style.filter = "none";
    const drop = Math.max(0, card.offsetTop - feed.offsetTop);
    const push = cardK * (cardH + drop);
    feed.style.transform = push ? "translate3d(0," + push.toFixed(2) + "px,0)" : "";
  }

  function keyboardHeight() {
    const h = keyboard.offsetHeight;
    if (h > 0) return h;
    const w = keyboard.offsetWidth || phone.clientWidth * 0.89151874;
    return w * (528 / 679);
  }

  function shiftY(el) {
    const raw = el && el.style.transform;
    if (!raw || raw === "none") return 0;
    const m = /translate3d\(\s*[-0-9.]+px\s*,\s*([-0-9.]+)px/.exec(raw);
    return m ? parseFloat(m[1]) : 0;
  }

  function layoutTop(el, stop) {
    let y = 0;
    let node = el;
    while (node && node !== stop) {
      y += node.offsetTop;
      node = node.offsetParent;
    }
    return y;
  }

  function talkBg() {
    return document.querySelector(".talk-bg");
  }

  function parkBg(card, pinTop) {
    const bg = talkBg();
    if (!bg || !card) return;
    if (!bg._home) bg._home = bg.parentElement;
    if (bg._base == null) bg._base = parseFloat(bg.style.top) || 0;
    if (pin._baseTop == null) pin._baseTop = 356.464;
    if (bg.parentElement !== card) card.appendChild(bg);
    const next = (pinTop - (pin._baseTop - bg._base)) + "px";
    if (bg.style.top !== next) bg.style.top = next;
    if (bg.style.position !== "absolute") bg.style.position = "absolute";
    if (bg.style.left !== "0px") bg.style.left = "0px";
    if (bg.style.zIndex !== "1") bg.style.zIndex = "1";
  }

  function unparkBg() {
    const bg = talkBg();
    if (!bg || !bg._home) return;
    if (bg.parentElement !== bg._home) bg._home.appendChild(bg);
    const base = (bg._base == null ? 256 : bg._base) + "px";
    if (bg.style.top !== base) bg.style.top = base;
    if (bg.style.left) bg.style.left = "";
    if (bg.style.position) bg.style.position = "";
    if (bg.style.zIndex) bg.style.zIndex = "";
  }

  function parkAt(top) {
    const card = pin._card;
    if (!card) return;
    if (pin.parentElement !== card) card.appendChild(pin);
    const topPx = top + "px";
    if (pin.style.top !== topPx) pin.style.top = topPx;
    if (pin.style.position !== "absolute") pin.style.position = "absolute";
    if (pin.style.left) pin.style.left = "";
    if (pin.style.transform) pin.style.transform = "";
    if (pin.style.zIndex !== "2") pin.style.zIndex = "2";
    pin._parked = 1;
    parkBg(card, top);
  }

  function unpark() {
    if (!pin._home) return;
    if (pin.parentElement !== pin._home) pin._home.appendChild(pin);
    if (pin.style.top) pin.style.top = "";
    if (pin.style.position) pin.style.position = "";
    if (pin.style.left) pin.style.left = "";
    if (pin.style.transform) pin.style.transform = "";
    if (pin.style.zIndex) pin.style.zIndex = "";
    pin._parked = 0;
    unparkBg();
  }

  // «до 32» lives at the end of this block. Once it reaches the phone, keep it
  // just underneath so it cannot climb into the slot or sit in an empty plate.
  function releaseHours() {
    const hours = document.querySelector(".record-hours");
    if (!hours || !hours._pinHold) return;
    hours.style.transform = "";
    hours._pinHold = 0;
  }

  function holdHours(card, cardTop, shift, pinBottom, stick) {
    const hours = document.querySelector(".record-hours");
    if (!hours || hours.closest(".stack-card") !== card) {
      releaseHours();
      return;
    }
    const base = cardTop + layoutTop(hours, card) + shift;
    // 86px from the caption text: the 156px caption box has 82px empty under the copy.
    const want = pinBottom + 4;
    const raw = Math.round(want - base);
    const delta = raw > 0 || stick ? raw : 0;
    if ((hours._pinHold || 0) === delta) return;
    hours._pinHold = delta;
    hours.style.transform = delta ? "translate3d(0," + delta + "px,0)" : "";
  }

  function tick(again) {
    frame = 0;
    // The sheet writes its scroll transform in a frame queued ahead of the
    // follow-up. Deciding here would bake that stale shift into the hold.
    if (!again) {
      frame = requestAnimationFrame(() => tick(true));
      return;
    }
    if (!pin._home) pin._home = pin.parentElement;
    if (app.hidden) {
      unpark();
      releaseHours();
      return;
    }
    const card = pin._card || (pin._card = pin._home.closest(".stack-card"));
    const content = card && card.querySelector(".stack-content");
    const shift = content ? shiftY(content) : 0;
    // Resting top is the phone's own slot. A parked inline top must not
    // become the new rest, or the slot starts chasing the scroll.
    if (pin.parentElement === pin._home && !pin.style.top) {
      const next = Math.round(pin._home.offsetTop + pin.offsetTop);
      if (pin._restTop == null || Math.abs(next - pin._restTop) > 1) pin._restTop = next;
    }
    if ((pin._trackTop == null || pin._trackTop === 0) && card) {
      const next = Math.round(layoutTop(track, card));
      if (next) pin._trackTop = next;
    }
    const zoom = zoomOf();
    const view = window.innerHeight / zoom;
    const phoneH = 491.984;
    const inset = phone.offsetTop > 0 && phone.offsetTop < 80 ? phone.offsetTop : 16;
    // First state, sheet still, card filling the viewport: the phone's own
    // center sits on the screen center. Later steps still catch it at parkTop.
    const rest = Math.round(view / 2 - inset - phoneH / 2);
    pin._restTop = rest;
    const ceiling = Math.round(Math.max(8, view - 76 - (28 + 156) - phoneH));
    const parkTop = ceiling - 16;
    const natural = rest + shift;
    // Inherited visibility follows the sheet. Only the phone's own hide,
    // while it is still under Alice, should drop the hold.
    const hidden = pin.style.visibility === "hidden";
    // The slot is a viewport position. After the sheet lets go it is no longer
    // at the top of the screen, and a card-local parkTop carries the phone
    // away while the gray plate is still up. Keep the last state in that slot
    // until the sheet itself no longer has room for it.
    const cardTop = card ? Math.round(card.getBoundingClientRect().top / zoom) : 0;
    const cardH = card ? (parseFloat(card.style.height) || view) : 0;
    const cardBottom = cardTop + cardH;
    const cardVisible = !!(card && getComputedStyle(card).visibility !== "hidden" && cardBottom > 24 && cardTop < view);
    let viewTop = parkTop;
    // Keep the whole phone block inside the sheet. Once the sheet bottom
    // climbs over the slot, pack «до 32» under the captions in what's left
    // so the plate cannot stay up empty. While the sheet still covers the
    // slot, the phone stays at parkTop.
    let room = cardBottom - blockDesign;
    const hours = card && document.querySelector(".record-hours");
    let stickHours = false;
    if (hours && cardBottom < view - 2 && hours.closest(".stack-card") === card) {
      const base = cardTop + layoutTop(hours, card) + shift;
      // 252px from the hours line (85px into the lockup) to the rounded end.
      if (base < parkTop + blockDesign + 4) {
        room -= 4 + 85 + 252;
        stickHours = true;
      }
    }
    if (viewTop > room) viewTop = room;
    if (viewTop < cardTop) viewTop = cardTop;
    // First frame of «Лента» is already the stuck slot. The phone does not
    // rise into it.
    const hold = !hidden && !reduce.matches && cardVisible && viewTop + phoneH > cardTop + 8;
    if (hold) {
      parkAt(Math.round(viewTop - cardTop));
      holdHours(card, cardTop, shift, viewTop + blockDesign, stickHours);
    } else {
      unpark();
      releaseHours();
    }
    const pinRect = pin.getBoundingClientRect();
    const alice = document.querySelector('[data-section="alice"]');
    const plaque = alice && alice.closest(".stack-card");
    let overlap = false;
    if (plaque) {
      const cs = getComputedStyle(plaque);
      if (cs.visibility !== "hidden" && cs.display !== "none") {
        const box = plaque.getBoundingClientRect();
        if (box.height > 80 && box.width > 80) {
          overlap = box.bottom > pinRect.top + 32 && box.top < pinRect.bottom - 32;
          if (!overlap && box.bottom > pinRect.top - 8 && box.top < pinRect.bottom + 8) overlap = !!pin._under;
        }
      }
    }
    pin._under = overlap;
    const trackCss = (pin._trackTop == null ? rest : pin._trackTop) + shift;
    let progress = 0;
    if (!hidden && !overlap && !reduce.matches && track.offsetHeight > blockDesign + 1) {
      if (trackCss > parkTop) progress = 0;
      else if (trackCss + track.offsetHeight - blockDesign < parkTop) progress = 1;
      else progress = Math.min(1, (parkTop - trackCss) / scrubDesign);
    }
    const shown = reduce.matches ? 0 : progress;
    const dist = shown >= 1 ? scrubDesign : Math.round(Math.min(scrubDesign, Math.max(0, shown * scrubDesign)));
    // Resting size: 80 viewport px above the phone, bottom edge unmoved.
    // Zoomed scenes keep fullScale; this only replaces the scale:1 rest.
    const frameTop = 12.95;
    const bottomVp = (parkTop + inset + phoneH) * zoom;
    const restFit = (bottomVp - 80) / ((phoneH + frameTop) * zoom);
    pin._rest = Math.min(1.45, Math.max(0.45, restFit));
    pin._arrive = 1;
    const fitKey = pin._arrive.toFixed(3) + ":" + pin._rest.toFixed(4);
    seek(performance.now(), sceneFor(dist));
    if (playing || !pin._painted || pin._scene !== to || pin._fitKey !== fitKey) {
      paint(from, to, u);
      pin._painted = playing ? 0 : 1;
      pin._scene = playing ? -1 : to;
      pin._fitKey = fitKey;
    }
    if (playing) requestTick();
  }

  function requestTick() {
    if (frame) return;
    frame = requestAnimationFrame(() => tick(false));
  }

  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("scroll", requestTick, { passive: true });
    window.visualViewport.addEventListener("resize", requestTick, { passive: true });
  }
  reduce.addEventListener("change", requestTick);
  new MutationObserver(requestTick).observe(app, { attributes: true, attributeFilter: ["hidden"] });
  requestTick();
}


initSecuritySlider();
initAliceSliders();

function initSecuritySlider() {
  const root = document.querySelector("[data-security-slider]");
  if (!root) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let origin = 0;
  let axis = null;
  let dragging = false;
  let lastX = 0;
  let lastT = 0;
  let velocity = 0;
  let frame = 0;

  function zoom() {
    const width = root.getBoundingClientRect().width;
    return root.offsetWidth ? width / root.offsetWidth : 1;
  }

  function limit() {
    return Math.max(0, root.scrollWidth - root.clientWidth);
  }

  function clamp(value) {
    return Math.min(limit(), Math.max(0, value));
  }

  // Photo lags the disc by 20% of that card's travel from the home slot.
  // Home is the first card's rest; a later card reaches it after scrolling `slot`.
  const parallax = 0.2;
  const photos = [];
  root.querySelectorAll(".security-card").forEach((card) => {
    const disc = card.firstElementChild;
    if (!disc || disc.style.overflow !== "hidden") return;
    let layer = disc.firstElementChild;
    while (layer && layer.style.display === "contents") layer = layer.firstElementChild;
    if (!layer) return;
    photos.push({
      card,
      disc,
      layer,
      base: layer.style.transform,
      slot: 0,
      min: 0,
      max: 0
    });
  });
  let metrics = false;

  function place(item, x) {
    const shift = "translateX(" + x.toFixed(2) + "px)";
    item.layer.style.transform = item.base ? item.base + " " + shift : shift;
  }

  function measureParallax() {
    if (!photos.length || root.offsetWidth < 1) return;
    const z = zoom() || 1;
    photos.forEach((item) => place(item, 0));
    const home = photos[0].card.offsetLeft;
    photos.forEach((item) => {
      const discBox = item.disc.getBoundingClientRect();
      const photoBox = item.layer.getBoundingClientRect();
      item.slot = item.card.offsetLeft - home;
      item.min = -Math.max(0, (photoBox.right - discBox.right) / z - 1);
      item.max = Math.max(0, (discBox.left - photoBox.left) / z - 1);
    });
    metrics = true;
  }

  function syncParallax() {
    if (!photos.length) return;
    if (!metrics) measureParallax();
    const scrolled = root.scrollLeft;
    photos.forEach((item) => {
      let x = 0;
      if (!reduce.matches) {
        x = parallax * (scrolled - item.slot);
        if (metrics) x = Math.min(item.max, Math.max(item.min, x));
      }
      place(item, x);
      const fast = item.card.querySelector(".security-fast");
      if (fast) {
        const lead = reduce.matches ? 0 : Math.max(-72, Math.min(72, -0.55 * (scrolled - item.slot)));
        fast.style.transform = "translateX(" + lead.toFixed(2) + "px)";
      }
    });
  }

  function writeScroll(value) {
    root.scrollLeft = value;
    syncParallax();
  }

  root.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    cancelAnimationFrame(frame);
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    origin = root.scrollLeft;
    axis = null;
    dragging = false;
    lastX = event.clientX;
    lastT = performance.now();
    velocity = 0;
  });

  root.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (!axis) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (axis === "y") {
        pointerId = null;
        return;
      }
      dragging = true;
      root.classList.add("is-dragging");
      root.setPointerCapture(event.pointerId);
    }
    if (axis !== "x") return;
    const now = performance.now();
    const dt = now - lastT;
    if (dt > 0) {
      const instant = (event.clientX - lastX) / dt / zoom();
      velocity = velocity * 0.65 + instant * 0.35;
    }
    lastX = event.clientX;
    lastT = now;
    writeScroll(clamp(origin - dx / zoom()));
  });

  function end(event) {
    if (pointerId === null || event.pointerId !== pointerId) return;
    const moved = dragging;
    pointerId = null;
    dragging = false;
    axis = null;
    root.classList.remove("is-dragging");
    if (!moved || reduce.matches || Math.abs(velocity) < 0.05) return;
    let v = Math.max(-28, Math.min(28, -velocity * 16));
    let current = root.scrollLeft;
    const step = () => {
      v *= 0.92;
      current = clamp(current + v);
      writeScroll(current);
      const hit = current <= 0 || current >= limit();
      if (Math.abs(v) > 0.35 && !hit) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  }

  root.addEventListener("pointerup", end);
  root.addEventListener("pointercancel", end);
  root.addEventListener("dragstart", (event) => event.preventDefault());
  root.addEventListener("touchmove", (event) => {
    if (axis === "x") event.preventDefault();
  }, { passive: false });

  root.addEventListener("wheel", (event) => {
    const absX = Math.abs(event.deltaX);
    const absY = Math.abs(event.deltaY);
    if (absX <= absY && !event.shiftKey) return;
    let delta = absX > absY ? event.deltaX : event.deltaY;
    if (event.deltaMode === 1) delta *= 16;
    else if (event.deltaMode === 2) delta *= root.clientWidth;
    const next = clamp(root.scrollLeft + delta / zoom());
    if (next === root.scrollLeft) return;
    writeScroll(next);
    event.preventDefault();
  }, { passive: false });

  root.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const dir = event.key === "ArrowRight" ? 1 : -1;
    writeScroll(clamp(root.scrollLeft + dir * 160));
  });

  root.addEventListener("scroll", syncParallax, { passive: true });
  window.addEventListener("resize", () => {
    metrics = false;
    syncParallax();
  });
  reduce.addEventListener("change", syncParallax);
  const app = document.getElementById("app");
  if (app && app.hidden) {
    new MutationObserver(() => {
      if (app.hidden) return;
      metrics = false;
      requestAnimationFrame(syncParallax);
    }).observe(app, { attributes: true, attributeFilter: ["hidden"] });
  }
  syncParallax();
}

function initAliceSliders() {
  document.querySelectorAll("[data-alice-slider]").forEach((root) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let pointerId = null;
    let startX = 0;
    let startY = 0;
    let origin = 0;
    let axis = null;
    let dragging = false;
    let lastX = 0;
    let lastT = 0;
    let velocity = 0;
    let frame = 0;

    function zoom() {
      const width = root.getBoundingClientRect().width;
      return root.offsetWidth ? width / root.offsetWidth : 1;
    }

    function limit() {
      return Math.max(0, root.scrollWidth - root.clientWidth);
    }

    function clamp(value) {
      return Math.min(limit(), Math.max(0, value));
    }

    // Photo lags the card by 20% of that card's travel from the home slot.
    // The bubble is a sibling and stays on the card. The rounded card clips the photo.
    const parallax = 0.2;
    const photos = [];
    root.querySelectorAll(".alice-card").forEach((card) => {
      const layer = card.querySelector(":scope > img");
      if (!layer) return;
      photos.push({
        card,
        layer,
        base: layer.style.transform,
        slot: 0,
        min: 0,
        max: 0
      });
    });
    let metrics = false;

    function place(item, x) {
      const shift = "translateX(" + x.toFixed(2) + "px)";
      item.layer.style.transform = item.base ? item.base + " " + shift : shift;
    }

    function measureParallax() {
      if (!photos.length || root.offsetWidth < 1) return;
      const z = zoom() || 1;
      photos.forEach((item) => place(item, 0));
      const home = photos[0].card.offsetLeft;
      photos.forEach((item) => {
        const frame = item.card.getBoundingClientRect();
        const photo = item.layer.getBoundingClientRect();
        item.slot = item.card.offsetLeft - home;
        item.min = -Math.max(0, (photo.right - frame.right) / z - 1);
        item.max = Math.max(0, (frame.left - photo.left) / z - 1);
      });
      metrics = true;
    }

    function syncParallax() {
      if (!photos.length) return;
      if (!metrics) measureParallax();
      const scrolled = root.scrollLeft;
      photos.forEach((item) => {
        let x = 0;
        if (!reduce.matches) {
          x = parallax * (scrolled - item.slot);
          if (metrics) x = Math.min(item.max, Math.max(item.min, x));
        }
        place(item, x);
      });
    }

    function writeScroll(value) {
      root.scrollLeft = value;
      syncParallax();
    }

    root.addEventListener("pointerdown", (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      cancelAnimationFrame(frame);
      pointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;
      origin = root.scrollLeft;
      axis = null;
      dragging = false;
      lastX = event.clientX;
      lastT = performance.now();
      velocity = 0;
    });

    root.addEventListener("pointermove", (event) => {
      if (event.pointerId !== pointerId) return;
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (!axis) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
        if (axis === "y") {
          pointerId = null;
          return;
        }
        dragging = true;
        root.classList.add("is-dragging");
        root.setPointerCapture(event.pointerId);
      }
      if (axis !== "x") return;
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) {
        const instant = (event.clientX - lastX) / dt / zoom();
        velocity = velocity * 0.65 + instant * 0.35;
      }
      lastX = event.clientX;
      lastT = now;
      writeScroll(clamp(origin - dx / zoom()));
    });

    function end(event) {
      if (pointerId === null || event.pointerId !== pointerId) return;
      const moved = dragging;
      pointerId = null;
      dragging = false;
      axis = null;
      root.classList.remove("is-dragging");
      if (!moved || reduce.matches || Math.abs(velocity) < 0.05) return;
      let v = Math.max(-28, Math.min(28, -velocity * 16));
      let current = root.scrollLeft;
      const step = () => {
        v *= 0.92;
        current = clamp(current + v);
        writeScroll(current);
        const hit = current <= 0 || current >= limit();
        if (Math.abs(v) > 0.35 && !hit) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    }

    root.addEventListener("pointerup", end);
    root.addEventListener("pointercancel", end);
    root.addEventListener("dragstart", (event) => event.preventDefault());
    root.addEventListener("touchmove", (event) => {
      if (axis === "x") event.preventDefault();
    }, { passive: false });

    root.addEventListener("wheel", (event) => {
      const absX = Math.abs(event.deltaX);
      const absY = Math.abs(event.deltaY);
      if (absX <= absY && !event.shiftKey) return;
      let delta = absX > absY ? event.deltaX : event.deltaY;
      if (event.deltaMode === 1) delta *= 16;
      else if (event.deltaMode === 2) delta *= root.clientWidth;
      const next = clamp(root.scrollLeft + delta / zoom());
      if (next === root.scrollLeft) return;
      writeScroll(next);
      event.preventDefault();
    }, { passive: false });

    root.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
      event.preventDefault();
      const dir = event.key === "ArrowRight" ? 1 : -1;
      writeScroll(clamp(root.scrollLeft + dir * 160));
    });

    root.addEventListener("scroll", syncParallax, { passive: true });
    window.addEventListener("resize", () => {
      metrics = false;
      syncParallax();
    });
    reduce.addEventListener("change", syncParallax);
    const app = document.getElementById("app");
    if (app && app.hidden) {
      new MutationObserver(() => {
        if (app.hidden) return;
        metrics = false;
        requestAnimationFrame(syncParallax);
      }).observe(app, { attributes: true, attributeFilter: ["hidden"] });
    }
    syncParallax();
  });
}

initHardwareSlider();

function initHardwareSlider() {
  const root = document.querySelector("[data-hardware-slider]");
  if (!root) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let origin = 0;
  let axis = null;
  let dragging = false;
  let lastX = 0;
  let lastT = 0;
  let velocity = 0;
  let frame = 0;

  function zoom() {
    const width = root.getBoundingClientRect().width;
    return root.offsetWidth ? width / root.offsetWidth : 1;
  }

  function limit() {
    return Math.max(0, root.scrollWidth - root.clientWidth);
  }

  function clamp(value) {
    return Math.min(limit(), Math.max(0, value));
  }

  root.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    cancelAnimationFrame(frame);
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    origin = root.scrollLeft;
    axis = null;
    dragging = false;
    lastX = event.clientX;
    lastT = performance.now();
    velocity = 0;
  });

  root.addEventListener("pointermove", (event) => {
    if (event.pointerId !== pointerId) return;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    if (!axis) {
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (axis === "y") {
        pointerId = null;
        return;
      }
      dragging = true;
      root.classList.add("is-dragging");
      root.setPointerCapture(event.pointerId);
    }
    if (axis !== "x") return;
    const now = performance.now();
    const dt = now - lastT;
    if (dt > 0) {
      const instant = (event.clientX - lastX) / dt / zoom();
      velocity = velocity * 0.65 + instant * 0.35;
    }
    lastX = event.clientX;
    lastT = now;
    root.scrollLeft = clamp(origin - dx / zoom());
  });

  function end(event) {
    if (pointerId === null || event.pointerId !== pointerId) return;
    const moved = dragging;
    pointerId = null;
    dragging = false;
    axis = null;
    root.classList.remove("is-dragging");
    if (!moved || reduce.matches || Math.abs(velocity) < 0.05) return;
    let v = Math.max(-28, Math.min(28, -velocity * 16));
    let current = root.scrollLeft;
    const step = () => {
      v *= 0.92;
      current = clamp(current + v);
      root.scrollLeft = current;
      const hit = current <= 0 || current >= limit();
      if (Math.abs(v) > 0.35 && !hit) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  }

  root.addEventListener("pointerup", end);
  root.addEventListener("pointercancel", end);
  root.addEventListener("dragstart", (event) => event.preventDefault());
  root.addEventListener("touchmove", (event) => {
    if (axis === "x") event.preventDefault();
  }, { passive: false });

  root.addEventListener("wheel", (event) => {
    const absX = Math.abs(event.deltaX);
    const absY = Math.abs(event.deltaY);
    if (absX <= absY && !event.shiftKey) return;
    let delta = absX > absY ? event.deltaX : event.deltaY;
    if (event.deltaMode === 1) delta *= 16;
    else if (event.deltaMode === 2) delta *= root.clientWidth;
    const next = clamp(root.scrollLeft + delta / zoom());
    if (next === root.scrollLeft) return;
    root.scrollLeft = next;
    event.preventDefault();
  }, { passive: false });

  root.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const dir = event.key === "ArrowRight" ? 1 : -1;
    root.scrollLeft = clamp(root.scrollLeft + dir * 160);
  });
}


function flipRevealPx(buttonWidth) {
  return buttonWidth;
}

function flipCommitPx(cardWidth, revealPx) {
  return Math.max(cardWidth * 0.4, revealPx);
}

function flipShouldCommit(dx, cardWidth, revealPx) {
  if (!(cardWidth > 0)) return false;
  return dx >= flipCommitPx(cardWidth, revealPx);
}

function flipRotatedSlots(slots) {
  const count = slots.length;
  return slots.map((slot) => (Number(slot) + count - 1) % count);
}

function initFlipStack() {
  const root = document.querySelector("[data-flip-stack]");
  if (!root) return;
  const like = root.querySelector(".flip-like");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let axis = null;
  let dragging = false;
  let dx = 0;
  let active = null;
  let busy = false;
  let cardWidth = 0;
  let reveal = 44;
  let gesture = 0;

  function zoom() {
    const width = root.getBoundingClientRect().width;
    return root.offsetWidth ? width / root.offsetWidth : 1;
  }

  function front() {
    return root.querySelector('[data-flip-card][data-slot="0"]');
  }

  function paint(value) {
    dx = value;
    if (active) active.style.transform = "translateX(" + value + "px)";
    const t = reveal > 0 ? Math.max(0, Math.min(1, value / reveal)) : 0;
    if (!like) return;
    like.style.opacity = String(t);
    like.style.transform = "translateY(-50%) scale(" + (0.6 + 0.4 * t) + ")";
  }

  function clearMotion() {
    if (active) {
      active.style.transition = "";
      active.style.transform = "";
    }
    if (like) {
      like.style.transition = "";
      like.style.opacity = "";
      like.style.transform = "";
    }
    active = null;
    dx = 0;
  }

  function rotate() {
    const cards = Array.from(root.querySelectorAll("[data-flip-card]"));
    const next = flipRotatedSlots(cards.map((card) => card.getAttribute("data-slot")));
    cards.forEach((card, index) => {
      card.setAttribute("data-slot", String(next[index]));
    });
  }

  function springBack() {
    if (!active) return;
    const token = gesture;
    if (reduce.matches) {
      clearMotion();
      root.classList.remove("is-dragging");
      return;
    }
    const card = active;
    root.classList.remove("is-dragging");
    card.style.transition = "transform 0.32s ease";
    card.style.transform = "translateX(0px)";
    if (like) {
      like.style.transition = "opacity 0.32s ease, transform 0.32s ease";
      like.style.opacity = "0";
      like.style.transform = "translateY(-50%) scale(0.6)";
    }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      card.removeEventListener("transitionend", onEnd);
      if (token !== gesture) return;
      if (active === card) clearMotion();
    };
    const onEnd = (event) => {
      if (event.target !== card || event.propertyName !== "transform") return;
      finish();
    };
    card.addEventListener("transitionend", onEnd);
    window.setTimeout(finish, 420);
  }

  function commit() {
    const card = active;
    if (!card) return;
    busy = true;
    const fly = cardWidth;
    const finishSettle = () => {
      root.classList.remove("is-dragging");
      if (like) {
        like.style.transition = "";
        like.style.opacity = "";
        like.style.transform = "";
      }
      if (reduce.matches) {
        card.style.transition = "";
        card.style.transform = "";
        rotate();
        active = null;
        dx = 0;
        busy = false;
        return;
      }
      card.style.transition = "";
      card.style.transform = "translateX(" + fly + "px)";
      void card.offsetWidth;
      rotate();
      card.style.transform = "";
      active = null;
      dx = 0;
      window.setTimeout(() => {
        busy = false;
      }, 460);
    };
    if (reduce.matches) {
      finishSettle();
      return;
    }
    root.classList.remove("is-dragging");
    card.style.transition = "transform 0.22s ease";
    card.style.transform = "translateX(" + fly + "px)";
    if (like) {
      like.style.transition = "opacity 0.16s ease, transform 0.16s ease";
      like.style.opacity = "0";
      like.style.transform = "translateY(-50%) scale(0.6)";
    }
    let flown = false;
    const afterFly = () => {
      if (flown) return;
      flown = true;
      card.removeEventListener("transitionend", onEnd);
      finishSettle();
    };
    const onEnd = (event) => {
      if (event.target !== card || event.propertyName !== "transform") return;
      afterFly();
    };
    card.addEventListener("transitionend", onEnd);
    window.setTimeout(afterFly, 320);
  }

  root.addEventListener("pointerdown", (event) => {
    if (busy) return;
    if (event.button !== undefined && event.button !== 0) return;
    const top = front();
    if (!top || !top.contains(event.target)) return;
    gesture += 1;
    top.style.transition = "none";
    top.style.transform = "";
    if (like) {
      like.style.transition = "none";
      like.style.opacity = "";
      like.style.transform = "";
    }
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    axis = null;
    dragging = false;
    dx = 0;
    active = top;
    cardWidth = top.offsetWidth;
    reveal = flipRevealPx((like && like.offsetWidth) || 44);
  });

  root.addEventListener("pointermove", (event) => {
    if (pointerId === null || event.pointerId !== pointerId || !active) return;
    const rawX = (event.clientX - startX) / zoom();
    const rawY = (event.clientY - startY) / zoom();
    if (!axis) {
      if (Math.abs(rawX) < 6 && Math.abs(rawY) < 6) return;
      if (rawX <= 0 || rawY * rawY > rawX * rawX) {
        axis = "y";
        pointerId = null;
        clearMotion();
        return;
      }
      axis = "x";
      dragging = true;
      root.classList.add("is-dragging");
      if (like) like.style.transition = "none";
      active.style.transition = "none";
      try { root.setPointerCapture(event.pointerId); } catch (error) {}
    }
    if (axis !== "x") return;
    paint(Math.max(0, Math.min(cardWidth, rawX)));
  });

  function end(event) {
    if (pointerId === null || event.pointerId !== pointerId) return;
    const moved = dragging;
    const pulled = dx;
    const width = cardWidth;
    const openAt = reveal;
    pointerId = null;
    dragging = false;
    axis = null;
    if (!moved) {
      clearMotion();
      return;
    }
    if (flipShouldCommit(pulled, width, openAt)) commit();
    else springBack();
  }

  root.addEventListener("pointerup", end);
  root.addEventListener("pointercancel", (event) => {
    if (pointerId === null || event.pointerId !== pointerId) return;
    pointerId = null;
    dragging = false;
    axis = null;
    springBack();
  });
  root.addEventListener("dragstart", (event) => event.preventDefault());
  root.addEventListener("touchmove", (event) => {
    if (axis === "x") event.preventDefault();
  }, { passive: false });
}

initFlipStack();
initMemoryStack();

function initMemoryStack() {
  const root = document.querySelector("[data-memory-stack]");
  if (!root) return;
  const like = root.querySelector(".memory-offer-like");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let axis = null;
  let dragging = false;
  let dx = 0;
  let active = null;
  let busy = false;
  let cardWidth = 0;
  let gesture = 0;
  let ignoreClick = false;
  let rising = null;
  let likeX = 0;
  let likeA = 0;
  let likeTargetX = 0;
  let likeTargetA = 0;
  let likeFollow = false;
  let likeRaf = 0;
  let likeLast = 0;
  let likeReady = false;
  const LIKE_TAU = 0.11;
  const BACK_POSE = "translateY(11px) scale(0.94)";
  const FRONT_POSE = "translateY(0px) scale(1)";

  function zoom() {
    const width = root.getBoundingClientRect().width;
    return root.offsetWidth ? width / root.offsetWidth : 1;
  }

  function front() {
    return root.querySelector('[data-memory-card][data-slot="0"]');
  }

  function cards() {
    return Array.from(root.querySelectorAll("[data-memory-card]"));
  }

  function offscreenX(card) {
    const scene = root.closest(".memory-scene");
    const sceneWidth = scene && scene.clientWidth ? scene.clientWidth : 375;
    const offerLeft = parseFloat(getComputedStyle(root).left) || 0;
    const cardLeft = parseFloat(getComputedStyle(card).left) || 0;
    const likeLeft = like ? (parseFloat(getComputedStyle(like).left) || 0) : cardLeft;
    const left = offerLeft + Math.min(cardLeft, likeLeft);
    return Math.ceil(sceneWidth - left + 48);
  }

  function parkedLike() {
    const offerLeft = parseFloat(getComputedStyle(root).left) || 0;
    const likeLeft = like ? (parseFloat(getComputedStyle(like).left) || 0) : 0;
    const width = like && like.offsetWidth ? like.offsetWidth : 44;
    return -(offerLeft + likeLeft + width + 8);
  }

  function translateXOf(el) {
    const raw = getComputedStyle(el).transform;
    if (!raw || raw === "none") return 0;
    const match = raw.match(/^matrix\(([^)]+)\)$/);
    if (!match) return 0;
    const n = parseFloat(match[1].split(",")[4]);
    return Number.isFinite(n) ? n : 0;
  }

  function stopLike(reset) {
    if (likeRaf) cancelAnimationFrame(likeRaf);
    likeRaf = 0;
    likeFollow = false;
    likeLast = 0;
    if (!reset) return;
    likeReady = false;
    if (!like) return;
    like.style.transition = "";
    like.style.opacity = "";
    like.style.transform = "";
  }

  function stepLike(now) {
    likeRaf = 0;
    if (!like) return;
    if (!likeLast) likeLast = now;
    const dt = Math.min(0.048, (now - likeLast) / 1000);
    likeLast = now;
    if (likeFollow && active) likeTargetX = translateXOf(active);
    const k = 1 - Math.exp(-dt / LIKE_TAU);
    likeX += (likeTargetX - likeX) * k;
    likeA += (likeTargetA - likeA) * k;
    like.style.opacity = String(Math.max(0, Math.min(1, likeA)));
    like.style.transform = "translateX(" + likeX + "px)";
    const arrived = Math.abs(likeX - likeTargetX) < 0.4 && Math.abs(likeA - likeTargetA) < 0.02;
    if (!likeFollow && arrived) {
      stopLike(true);
      return;
    }
    likeRaf = requestAnimationFrame(stepLike);
  }

  function armLike() {
    if (!like || reduce.matches) return;
    if (!likeReady) {
      likeX = parkedLike();
      likeA = 1;
      likeReady = true;
      likeLast = 0;
    }
    like.style.transition = "none";
    like.style.opacity = "1";
    like.style.transform = "translateX(" + likeX + "px)";
    if (!likeRaf) likeRaf = requestAnimationFrame(stepLike);
  }

  function paint(value) {
    dx = value;
    if (active) active.style.transform = "translateX(" + value + "px)";
    if (!like) return;
    if (reduce.matches) {
      like.style.opacity = "1";
      like.style.transform = "translateX(" + value + "px)";
      return;
    }
    likeFollow = true;
    likeTargetA = 1;
    likeTargetX = value;
    armLike();
  }

  function clearCard(card) {
    if (!card) return;
    card.style.transition = "";
    card.style.transform = "";
    card.style.transformOrigin = "";
  }

  function clearMotion() {
    clearCard(active);
    stopLike(true);
    active = null;
    rising = null;
    dx = 0;
    root.classList.remove("is-dragging", "is-settling");
  }

  function grow(node) {
    if (!node) return;
    node.style.transformOrigin = "center center";
    if (reduce.matches) return;
    node.style.transition = "none";
    node.style.transform = BACK_POSE;
    void node.offsetWidth;
    node.style.transition = "transform 0.42s cubic-bezier(.22,.7,.3,1)";
    node.style.transform = FRONT_POSE;
  }

  function springBack() {
    if (!active) return;
    const token = gesture;
    const card = active;
    root.classList.remove("is-dragging");
    if (reduce.matches) {
      clearMotion();
      return;
    }
    if (likeReady) {
      likeFollow = true;
      likeTargetA = 0;
      armLike();
    }
    card.style.transition = "transform 0.32s ease";
    card.style.transform = "translateX(0px)";
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      card.removeEventListener("transitionend", onEnd);
      if (token !== gesture) return;
      likeFollow = false;
      likeTargetX = 0;
      likeTargetA = 0;
      if (active === card) {
        clearCard(card);
        active = null;
        dx = 0;
        root.classList.remove("is-dragging", "is-settling");
      }
    };
    const onEnd = (event) => {
      if (event.target !== card || event.propertyName !== "transform") return;
      finish();
    };
    card.addEventListener("transitionend", onEnd);
    window.setTimeout(finish, 420);
  }

  function flyOff(done) {
    const card = active;
    if (!card) return;
    const token = gesture;
    const dest = Math.max(dx, offscreenX(card));
    rising = cards().find((el) => el !== card) || null;
    if (reduce.matches) {
      done();
      return;
    }
    root.classList.remove("is-dragging");
    if (rising) grow(rising);
    card.style.transition = "none";
    card.style.transform = "translateX(" + dx + "px)";
    void card.offsetWidth;
    if (dx < dest - 0.5) {
      card.style.transition = "transform 0.32s ease";
      card.style.transform = "translateX(" + dest + "px)";
    }
    dx = dest;
    if (like) {
      likeFollow = true;
      likeTargetA = 1;
      likeTargetX = dest;
      armLike();
    }
    if (dx >= dest - 0.5 && card.style.transition === "none") {
      done();
      return;
    }
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      card.removeEventListener("transitionend", onEnd);
      if (token !== gesture || active !== card) {
        busy = false;
        return;
      }
      done();
    };
    const onEnd = (event) => {
      if (event.target !== card || event.propertyName !== "transform") return;
      finish();
    };
    card.addEventListener("transitionend", onEnd);
    window.setTimeout(finish, 420);
  }

  function commit() {
    const card = active;
    const under = rising || cards().find((el) => el !== card);
    if (!card || !under) {
      springBack();
      return;
    }
    busy = true;
    const token = gesture;
    root.classList.remove("is-dragging");
    likeFollow = false;
    likeTargetX = dx;
    likeTargetA = 1;
    if (reduce.matches) {
      clearCard(card);
      clearCard(under);
      card.setAttribute("data-slot", "1");
      under.setAttribute("data-slot", "0");
      stopLike(true);
      active = null;
      rising = null;
      dx = 0;
      busy = false;
      return;
    }
    card.style.transition = "none";
    card.style.transformOrigin = "center center";
    card.style.transform = BACK_POSE;
    card.setAttribute("data-slot", "1");
    under.setAttribute("data-slot", "0");
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      under.removeEventListener("transitionend", onEnd);
      if (token !== gesture) return;
      clearCard(card);
      clearCard(under);
      active = null;
      rising = null;
      dx = 0;
      root.classList.remove("is-dragging", "is-settling");
      busy = false;
    };
    const onEnd = (event) => {
      if (event.target !== under || event.propertyName !== "transform") return;
      finish();
    };
    under.addEventListener("transitionend", onEnd);
    window.setTimeout(finish, 480);
  }

  function accept() {
    if (busy || pointerId !== null) return;
    const card = front();
    if (!card || cards().length < 2) return;
    gesture += 1;
    active = card;
    cardWidth = card.offsetWidth || 327;
    busy = true;
    flyOff(commit);
  }

  root.addEventListener("click", (event) => {
    const button = event.target.closest(".memory-offer-accept, .memory-offer-pass");
    if (!button || !root.contains(button)) return;
    event.preventDefault();
    event.stopPropagation();
    if (ignoreClick) return;
    const top = front();
    if (!top || !top.contains(button)) return;
    accept();
  });

  root.addEventListener("pointerdown", (event) => {
    if (busy) return;
    if (event.button !== undefined && event.button !== 0) return;
    const top = front();
    if (!top || !top.contains(event.target)) return;
    gesture += 1;
    top.style.transition = "none";
    top.style.transform = "";
    stopLike(true);
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    axis = null;
    dragging = false;
    dx = 0;
    active = top;
    cardWidth = top.offsetWidth;
  });

  root.addEventListener("pointermove", (event) => {
    if (pointerId === null || event.pointerId !== pointerId || !active) return;
    const rawX = (event.clientX - startX) / zoom();
    const rawY = (event.clientY - startY) / zoom();
    if (!axis) {
      if (Math.abs(rawX) < 6 && Math.abs(rawY) < 6) return;
      if (rawX <= 0 || rawY * rawY > rawX * rawX) {
        axis = "y";
        pointerId = null;
        clearMotion();
        return;
      }
      axis = "x";
      dragging = true;
      root.classList.add("is-dragging");
      if (like) like.style.transition = "none";
      active.style.transition = "none";
      try { root.setPointerCapture(event.pointerId); } catch (error) {}
    }
    if (axis !== "x") return;
    paint(Math.max(0, Math.min(offscreenX(active), rawX)));
  });

  function end(event) {
    if (pointerId === null || event.pointerId !== pointerId) return;
    const moved = dragging;
    const pulled = dx;
    const width = cardWidth;
    pointerId = null;
    dragging = false;
    axis = null;
    if (!moved) {
      clearMotion();
      return;
    }
    ignoreClick = true;
    window.setTimeout(() => { ignoreClick = false; }, 0);
    if (width > 0 && pulled >= width * 0.4) {
      busy = true;
      flyOff(commit);
    } else springBack();
  }

  root.addEventListener("pointerup", end);
  root.addEventListener("pointercancel", (event) => {
    if (pointerId === null || event.pointerId !== pointerId) return;
    pointerId = null;
    dragging = false;
    axis = null;
    springBack();
  });
  root.addEventListener("dragstart", (event) => event.preventDefault());
  root.addEventListener("touchmove", (event) => {
    if (axis === "x") event.preventDefault();
  }, { passive: false });
}

const SMUT = [
  ["Помогает<br>не&nbsp;потерять<br>важное", "Нескончаемые рабочие встречи и обсуждения, случайные диалоги и дружеские беседы, обещания и планы, договорённости и задачи — Яндекс Пин собирает всё происходящее вокруг тебя"],
  ["Алиса AI<br>твой&nbsp;напарник", "Алиса AI помнит твои записи, задачи и разговоры — поэтому не нужно ничего объяснять заново, можно сразу перейти к делу."],
  ["Оставайся в&nbsp;разговоре", "Уделяй внимание собеседникам, а не конспектированию встречи. Яндекс Пин сам зафиксирует и сохранит всё, что обсуждается"],
  ["Всё важное — в&nbsp;Моей памяти", "С помощью функции Моя память Алиса AI в Яндекс Пине запоминает множество самых разных фактов из твоих ежедневных обсуждений и разговоров"],
  ["Итоги дня", "В конце дня Алиса AI собирает общую картину: завершённые дела, новые задачи, обещания, важные моменты и приоритеты на завтра"],
  ["Больше возможностей с&nbsp;подпиской", ""],
  ["Ювелирно<br>собран", ""],
  ["Это<br>конфиденциально", "Безопасность и конфиденциальность ИИ-пина поддерживается на нескольких уровнях"]
];

/* Композиции из макета: только выгруженные стрелка и плюс. «Ювелирно собран» — стрелка сверху и плюс снизу. «Итоги дня» — отдельный ряд плюс, стрелка, плюс. */
const SMUT_LAYOUT = [
  { top: "arrow", bot: "pluses-column" },
  null,
  { top: "arrow", bot: "pluses-row" },
  { top: "arrows-2", bot: "plus" },
  null,
  { top: "pluses-3", bot: "pluses-3" },
  null,
  { top: "arrows-loose", bot: "arrow" }
];

function smutIcon(kind) {
  const img = document.createElement("img");
  img.className = "smut-icon " + (kind === "arrow" ? "is-arrow" : "is-plus");
  img.alt = "";
  img.src = kind === "arrow" ? "./assets/fig/smut-icon-arrow.svg" : "./assets/fig/smut-icon-plus.svg";
  return img;
}

function smutStack(kind, count, gap) {
  const el = document.createElement("div");
  el.className = "smut-cluster";
  el.style.gap = gap + "px";
  for (let i = 0; i < count; i++) el.appendChild(smutIcon(kind));
  return el;
}

function smutPlusColumn() {
  const el = document.createElement("div");
  el.className = "smut-cluster";
  [0, 38, 18].forEach((gap) => {
    const img = smutIcon("plus");
    if (gap) img.style.marginTop = gap + "px";
    el.appendChild(img);
  });
  return el;
}

function smutPlusRow(count) {
  const el = document.createElement("div");
  el.className = "smut-cluster is-row";
  for (let i = 0; i < count; i++) el.appendChild(smutIcon("plus"));
  return el;
}

function fillSmutZone(zone, spec) {
  if (spec === "arrow") zone.appendChild(smutIcon("arrow"));
  else if (spec === "plus") zone.appendChild(smutIcon("plus"));
  else if (spec === "arrow-plus") {
    zone.classList.add("is-split");
    zone.appendChild(smutIcon("arrow"));
    zone.appendChild(smutIcon("plus"));
  } else if (spec === "arrows-2") zone.appendChild(smutStack("arrow", 2, 33));
  else if (spec === "arrows-loose") zone.appendChild(smutStack("arrow", 2, 67));
  else if (spec === "pluses-3") zone.appendChild(smutStack("plus", 3, 10));
  else if (spec === "pluses-column") zone.appendChild(smutPlusColumn());
  else if (spec === "pluses-sides") {
    zone.classList.add("is-low");
    zone.appendChild(smutPlusRow(2));
  } else if (spec === "pluses-row") {
    zone.classList.add("is-low", "is-midlow");
    zone.appendChild(smutPlusRow(3));
  }
}

function liftAliceContent(section) {
  const head = [...section.children].find((el) => (el.textContent || "").replace(/\s+/g, " ").trim().startsWith("Находит ответы"));
  if (!head) return;
  const shift = parseFloat(head.style.top) - 120;
  if (!Number.isFinite(shift) || shift < 8) return;
  for (const el of section.children) {
    const top = el.style.top;
    if (!top || /calc|%/.test(top)) continue;
    const n = parseFloat(top);
    if (!Number.isFinite(n)) continue;
    el.style.top = (n - shift) + "px";
  }
  const height = parseFloat(section.style.height);
  if (Number.isFinite(height)) section.style.height = Math.max(0, height - shift) + "px";
  const bg = section.querySelector('img[src*="alice-bg"]');
  if (bg) {
    bg.style.top = "0px";
    bg.style.height = section.style.height;
  }
}

function hideSmutDuplicates(content) {
  const titles = [
    "Помогает не потерять важное",
    "Алиса AI твой напарник",
    "Оставайся в разговоре",
    "Всё важное — в Моей памяти",
    "Итоги дня",
    "Больше возможностей с подпиской",
    "Ювелирно собран",
    "Это конфиденциально"
  ];
  const plain = (el) => {
    const clone = el.cloneNode(true);
    clone.querySelectorAll("br").forEach((br) => br.replaceWith(" "));
    return (clone.textContent || "").replace(/\u00a0/g, " ").replace(/[—–]/g, "-").replace(/\s+/g, " ").trim();
  };
  const known = new Set(titles.map((title) => title.replace(/[—–]/g, "-")));
  for (const el of content.querySelectorAll("p, h1, h2, h3")) {
    const text = plain(el);
    if (!known.has(text)) continue;
    el.classList.add("smut-dup");
    let node = el;
    let subtitle = el.nextElementSibling;
    if (!subtitle && el.parentElement) {
      node = el.parentElement;
      subtitle = node.nextElementSibling;
    }
    if (subtitle && subtitle.tagName === "P") subtitle.classList.add("smut-dup");
    const after = (subtitle || node).nextElementSibling;
    if (after && /height:\s*680px/.test(after.getAttribute("style") || "")) after.classList.add("smut-dup");
  }
  for (const el of content.querySelectorAll("div")) {
    const lines = [...el.children].filter((child) => child.tagName === "P");
    if (lines.length < 2) continue;
    const joined = lines.map((line) => plain(line)).join(" ");
    if (!known.has(joined)) continue;
    el.classList.add("smut-dup");
    const body = el.nextElementSibling;
    if (body && body.tagName === "P") body.classList.add("smut-dup");
  }
}

function placeWorkflowCopy() {
  const stack = document.querySelector("[data-flip-stack]");
  if (!stack || stack.dataset.workflow) return;
  const layer = stack.closest(".layer");
  let outer = stack;
  while (outer.parentElement && outer.parentElement !== layer) outer = outer.parentElement;
  if (!layer || outer === stack) return;
  stack.dataset.workflow = "1";
  const copy = document.createElement("div");
  copy.className = "workflow-copy";
  const title = document.createElement("p");
  title.className = "workflow-title";
  title.innerHTML = "Если утопаешь<br>в&nbsp;проектах и задачах";
  const body = document.createElement("p");
  body.className = "workflow-body";
  body.innerHTML = "Яндекс Пин упорядочивает твой ежедневный рабочий хаос и помогает сосредоточиться на&nbsp;действительно важном";
  copy.append(title, body);
  outer.appendChild(copy);
  const shift = copy.offsetHeight + 48;
  for (const child of outer.children) {
    if (child === copy) continue;
    const n = parseFloat(child.style.top);
    child.style.top = ((Number.isFinite(n) ? n : 0) + shift) + "px";
  }
  const pager = outer.querySelector(".ctx-pager");
  const hang = pager ? Math.max(0, Math.round(pager.getBoundingClientRect().bottom - stack.getBoundingClientRect().bottom)) : 0;
  const height = shift + stack.offsetHeight + hang;
  outer.style.height = height + "px";
  const boxTop = parseFloat(outer.style.top);
  if (!Number.isFinite(boxTop)) return;
  const later = [];
  for (const el of outer.parentElement.children) {
    if (el === outer) continue;
    const top = el.style.top;
    if (!top || /calc|%/.test(top)) continue;
    const n = parseFloat(top);
    if (Number.isFinite(n) && n > boxTop + 1) later.push({ el, n });
  }
  if (!later.length) return;
  later.sort((a, b) => a.n - b.n);
  const delta = boxTop + height + 120 - later[0].n;
  if (delta > 1) {
    for (const item of later) item.el.style.top = (item.n + delta) + "px";
  }
}

function padAliceEnd(section) {
  if (!section || section.dataset.padded) return;
  section.dataset.padded = "1";
  const height = parseFloat(section.style.height);
  if (Number.isFinite(height)) section.style.height = (height + 120) + "px";
  const bg = section.querySelector('img[src*="alice-bg"]');
  if (bg) {
    const bh = parseFloat(bg.style.height);
    if (Number.isFinite(bh)) bg.style.height = (bh + 120) + "px";
  }
  const parent = section.parentElement;
  const floor = parseFloat(section.style.top);
  if (!parent || !Number.isFinite(floor)) return;
  for (const el of parent.children) {
    if (el === section) continue;
    const top = parseFloat(el.dataset.stackTop || el.style.top);
    if (!Number.isFinite(top) || top <= floor + 1) continue;
    const next = top + 120;
    el.style.top = next + "px";
    el.dataset.stackTop = String(next);
  }
}

function gapBelowSlider(content) {
  const stack = content.querySelector("[data-flip-stack]");
  if (!stack) return;
  const box = stack.closest(".stack-content > *");
  if (!box || box.dataset.gapped) return;
  box.dataset.gapped = "1";
  const boxTop = parseFloat(box.style.top) || 0;
  const bottom = boxTop + (parseFloat(box.style.height) || box.offsetHeight || 0);
  let nextTop = Infinity;
  for (const el of content.children) {
    if (el === box) continue;
    const top = parseFloat(el.style.top);
    if (!Number.isFinite(top) || top <= boxTop + 1) continue;
    if (top < nextTop) nextTop = top;
  }
  if (!Number.isFinite(nextTop)) return;
  const delta = bottom + 120 - nextTop;
  if (delta <= 1) return;
  for (const el of content.children) {
    if (el === box) continue;
    const top = parseFloat(el.dataset.stackTop || el.style.top);
    if (!Number.isFinite(top) || top <= boxTop + 1) continue;
    const next = top + delta;
    el.style.top = next + "px";
    el.dataset.stackTop = String(next);
  }
}

function initStackCards() {
  const app = document.getElementById("app");
  const layer = app && app.querySelector(".layer");
  if (!app || !layer || app.hidden) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  function zoomOf() {
    const stage = document.querySelector(".stage");
    const n = parseFloat(getComputedStyle(stage).zoom);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }

  function flowShift() {
    const n = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--flow-shift"));
    return Number.isFinite(n) ? n : 0;
  }

  function translateY(el) {
    const raw = getComputedStyle(el).translate;
    if (!raw || raw === "none") return 0;
    const parts = raw.trim().split(/\s+/);
    if (parts.length < 2) return 0;
    const y = parseFloat(parts[1]);
    return Number.isFinite(y) ? y : 0;
  }

  function layoutTop(el) {
    let y = 0;
    let node = el;
    while (node && node !== app) {
      y += node.offsetTop;
      node = node.offsetParent;
    }
    return y;
  }

  function pinExtra(el) {
    const extra = translateY(el) - flowShift();
    return Math.abs(extra) < 1 ? 0 : extra;
  }

  function kindOf(el) {
    if (el.querySelector(".footer-specs")) return "footer";
    if (el.dataset.section === "alice") return 1;
    if (el.dataset.section === "talk") return 2;
    if (el.dataset.section === "memory") return 3;
    if (el.dataset.section === "itogi") return 4;
    if (el.dataset.section === "plans") return 5;
    if (el.classList.contains("hardware-pack")) return 6;
    const head = (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80);
    if (head.includes("Помогает") && head.includes("важное")) return 0;
    if (head.includes("подпиской")) return 5;
    if (head.includes("конфиденциально")) return 7;
    return null;
  }

  function stackY(el) {
    let y = layoutTop(el);
    let shift = 0;
    let node = el;
    while (node && node !== app) {
      shift += translateY(node);
      node = node.parentElement;
    }
    const extra = shift - flowShift();
    return y + (Math.abs(extra) < 1 ? 0 : extra);
  }

  if (!initStackCards.state) {
    placeWorkflowCopy();
    const hours = document.querySelector(".record-hours");
    const hardwareBody = document.querySelector(".hardware-pack-body");
    const hardwareSlider = hardwareBody && hardwareBody.querySelector(".hardware-slider");
    if (hours && hardwareSlider) {
      hours.style.position = "relative";
      hours.style.left = "auto";
      hours.style.right = "auto";
      hours.style.top = "auto";
      hours.style.width = "190px";
      hours.style.margin = "0 0 40px 24px";
      hours.style.alignSelf = "flex-start";
      hardwareSlider.before(hours);
    }
    const heading = [...app.querySelectorAll(".talk-title")].find((el) => {
      const text = (el.textContent || "").replace(/\s+/g, " ");
      return text.includes("Помогает") && text.includes("важное");
    });
    const anchorY = heading ? stackY(heading) : null;
    const roots = [];
    for (const el of layer.children) {
      if (el.classList.contains("hero-photo") || el.classList.contains("hero-title") || el.classList.contains("feature-cards") || el.classList.contains("tap") || el.classList.contains("stack-host")) continue;
      if (el.style.display === "contents") roots.push(...el.children);
      else roots.push(el);
    }
    for (const el of app.children) {
      if (el.dataset && el.dataset.section) roots.push(el);
    }

    const tagged = roots.map((el) => ({ el, y: stackY(el), group: -1 }));
    const memoryItem = tagged.find((item) => item.el.dataset.section === "memory");
    const itogiItem = tagged.find((item) => item.el.dataset.section === "itogi");
    if (memoryItem && itogiItem) {
      const memoryH = memoryItem.el.offsetHeight || parseFloat(memoryItem.el.style.height) || 0;
      const after = memoryItem.y + memoryH;
      if (itogiItem.y < after) itogiItem.y = after;
    }
    const ordered = tagged.slice().sort((a, b) => a.y - b.y || 0);
    let group = -1;
    let footer = null;
    for (const item of ordered) {
      if (anchorY != null && item.y < anchorY - 1 && !(heading && item.el.contains(heading))) continue;
      const kind = kindOf(item.el);
      if (kind === "footer") {
        footer = item.el;
        group = 99;
        continue;
      }
      if (typeof kind === "number") group = kind;
      if (group >= 0 && group < 8) item.group = group;
    }

    const groups = [[], [], [], [], [], [], [], []];
    for (const item of tagged) {
      if (item.group >= 0) groups[item.group].push(item);
    }
    if (!footer || groups.some((items) => items.length === 0)) return;

    const host = document.createElement("div");
    host.className = "stack-host";
    const gap = document.createElement("div");
    gap.className = "stack-gap";
    gap.style.display = "none";
    host.appendChild(gap);
    const cards = groups.map((items, index) => {
      const card = document.createElement("div");
      const plain = index === 1;
      const bare = index === 5;
      const memory = index === 3;
      const itogi = index === 4;
      const hardware = index === 6;
      const flush = index === 7;
      const dock = index === 0;
      card.className = "stack-card is-sheet" + (plain ? " is-plain" : "") + (bare ? " is-bare" : "") + (memory ? " is-memory" : "") + (itogi ? " is-itogi" : "") + (hardware ? " is-hardware" : "") + (flush ? " is-flush" : "") + (dock ? " is-dock" : "");
      const plate = document.createElement("div");
      plate.className = "stack-plate";
      const leadEl = document.createElement("div");
      leadEl.className = "stack-lead";
      const content = document.createElement("div");
      content.className = "stack-content";
      const arc = document.createElement("div");
      arc.className = "stack-arc";
      const smut = document.createElement("div");
      const talk = index === 2;
      smut.className = "smut" + (index === 1 ? " is-alice" : "") + (talk ? " is-talk" : "") + (itogi ? " is-itogi" : "") + (hardware ? " is-hardware" : "") + (flush ? " is-private" : "");
      const copy = SMUT[index];
      const layout = SMUT_LAYOUT[index];
      const topZone = document.createElement("div");
      topZone.className = "smut-zone is-top";
      fillSmutZone(topZone, talk ? null : layout && layout.top);
      const copyEl = document.createElement("div");
      copyEl.className = "smut-copy";
      const smutTitle = document.createElement("p");
      smutTitle.className = "smut-title";
      smutTitle.innerHTML = copy[0];
      copyEl.appendChild(smutTitle);
      if (copy[1]) {
        const smutBody = document.createElement("p");
        smutBody.className = "smut-body";
        smutBody.textContent = copy[1];
        copyEl.appendChild(smutBody);
      }
      const botZone = document.createElement("div");
      botZone.className = "smut-zone is-bot";
      fillSmutZone(botZone, talk ? null : layout && layout.bot);
      smut.append(topZone, copyEl, botZone);
      if (index === 1) {
        const photo = document.createElement("img");
        photo.className = "smut-photo";
        photo.alt = "";
        photo.draggable = false;
        photo.src = "./assets/fig/product-overview.png";
        botZone.appendChild(photo);
      }
      if (talk) {
        const arrow = document.createElement("img");
        arrow.className = "smut-talk-arrow";
        arrow.alt = "";
        arrow.width = 15;
        arrow.height = 15;
        arrow.src = "./assets/fig/talk-arrow.svg";
        const plus = (side) => {
          const img = document.createElement("img");
          img.className = "smut-talk-plus is-" + side;
          img.alt = "";
          img.width = 12;
          img.height = 12;
          img.src = "./assets/fig/talk-plus.svg";
          return img;
        };
        smut.append(arrow, plus("left"), plus("center"), plus("right"));
      }
      if (itogi) {
        const marks = document.createElement("div");
        marks.className = "smut-itogi-marks";
        marks.append(smutIcon("plus"), smutIcon("arrow"), smutIcon("plus"));
        smut.append(marks);
      }
      if (hardware) {
        const arrow = smutIcon("arrow");
        arrow.classList.add("smut-hw-arrow");
        const plus = smutIcon("plus");
        plus.classList.add("smut-hw-plus");
        smut.append(arrow, plus);
      }
      const origin = index === 0 && anchorY != null ? anchorY : Math.min(...items.map((item) => item.y));
      const lead = index === 0 || plain ? 0 : 120;
      // «Помогает»: после шмуца первый блок контента на 120px. Сдвиг общий, зазоры внутри секции те же.
      const contentTop = index === 0 ? 120 : 0;
      items.forEach((item) => {
        item.el.style.position = "absolute";
        const top = item.y - origin + contentTop;
        item.el.dataset.stackTop = String(top);
        item.el.style.top = top + "px";
        item.el.style.translate = "none";
        content.appendChild(item.el);
      });
      hideSmutDuplicates(content);
      gapBelowSlider(content);
      if (index === 1) {
        for (const img of content.querySelectorAll('img[src*="alice-puck"]')) img.hidden = true;
        const alice = content.querySelector('[data-section="alice"]');
        if (alice) {
          liftAliceContent(alice);
          padAliceEnd(alice);
        }
      }
      card.appendChild(plate);
      card.appendChild(leadEl);
      card.appendChild(content);
      card.appendChild(arc);
      card.appendChild(smut);
      host.appendChild(card);
      return { card, plate, content, arc, smut, origin, lead, leadEl, dock, memory, cover: plain || bare };
    });
    app.appendChild(host);
    const schemeHold = document.querySelector("[data-scheme-hold]");
    if (schemeHold && !schemeHold.dataset.expanded) {
      const zoom = parseFloat(getComputedStyle(document.querySelector(".stage")).zoom) || 1;
      const view = Math.max(1, window.innerHeight / zoom);
      const extra = Math.max(0, view + 1600 - 588);
      schemeHold.style.height = (view + 1600) + "px";
      const pack = schemeHold.closest(".hardware-pack");
      const base = pack ? parseFloat(pack.style.top) || 0 : 0;
      const parent = pack && pack.parentElement;
      if (parent) {
        for (const el of parent.children) {
          if (el === pack) continue;
          const top = parseFloat(el.style.top);
          if (Number.isFinite(top) && top > base) {
            const next = top + extra;
            el.style.top = next + "px";
            el.dataset.stackTop = String(next);
          }
        }
      }
      schemeHold.dataset.expanded = "1";
    }
    const lastCard = cards[cards.length - 1];
    let lastBottom = 0;
    for (const child of lastCard.content.children) {
      const top = parseFloat(child.dataset.stackTop) || parseFloat(child.style.top) || 0;
      lastBottom = Math.max(lastBottom, top + child.offsetHeight);
    }
    const footerTop = lastBottom + 120;
    footer.dataset.stackTop = String(footerTop);
    footer.style.position = "absolute";
    footer.style.left = "0px";
    footer.style.top = footerTop + "px";
    footer.style.translate = "none";
    lastCard.content.appendChild(footer);

    initStackCards.state = {
      host,
      gap,
      cards,
      footer,
      layer,
      base: anchorY != null ? anchorY : groups[0].reduce((min, item) => Math.min(min, item.y), Infinity)
    };
  }

  const state = initStackCards.state;
  if (!state) return;

  function sampleAliceOpaque(photo) {
    if (photo.dataset.opaquePending) return;
    photo.dataset.opaquePending = "1";
    const run = () => {
      const h = photo.naturalHeight;
      if (!h) return;
      let frac = 3318 / 4207;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 4;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(photo, 0, 0, 4, h);
        const data = ctx.getImageData(0, 0, 4, h).data;
        for (let y = h - 1; y >= 0; y--) {
          const i = y * 16;
          if (data[i + 3] > 250 || data[i + 7] > 250 || data[i + 11] > 250 || data[i + 15] > 250) {
            frac = (y + 1) / h;
            break;
          }
        }
      } catch (e) {}
      if (photo.dataset.opaqueFrac === String(frac)) return;
      photo.dataset.opaqueFrac = String(frac);
      requestLayout();
    };
    if (photo.complete && photo.naturalHeight) run();
    else photo.addEventListener("load", run, { once: true });
  }

  function aliceSmutSpan(card, beat) {
    if (!card.smut.classList.contains("is-alice")) return beat;
    const photo = card.smut.querySelector(".smut-photo");
    if (!photo) return beat;
    if (!photo.dataset.opaqueFrac) sampleAliceOpaque(photo);
    if (!photo.offsetHeight || !photo.dataset.opaqueFrac) return beat;
    let node = photo;
    let y = 0;
    let ok = false;
    let guard = 0;
    while (node && node !== card.smut && guard++ < 8) {
      y += node.offsetTop || 0;
      node = node.offsetParent;
      if (node === card.smut) ok = true;
    }
    if (!ok) return beat;
    const bottom = y + photo.offsetHeight * (parseFloat(photo.dataset.opaqueFrac) - 680 / 4207);
    return bottom > 1 ? bottom : beat;
  }

  function measure() {
    if (state.footer && !state.footer.dataset.cropped) {
      const kept = 701;
      state.footer.style.height = kept + "px";
      state.footer.style.overflow = "hidden";
      state.footer.dataset.cropped = "1";
    }
    const zoom = zoomOf();
    const view = Math.max(1, window.innerHeight / zoom);
    const beat = view;
    const spans = state.cards.map((card) => {
      const pack = card.content.querySelector(".hardware-pack");
      if (pack) {
        const floor = pack.offsetHeight + 120;
        let minAfter = Infinity;
        for (const el of card.content.children) {
          if (el === pack) continue;
          const top = parseFloat(el.dataset.stackTop || el.style.top);
          if (Number.isFinite(top) && top > (parseFloat(pack.style.top) || 0)) minAfter = Math.min(minAfter, top);
        }
        const delta = floor - minAfter;
        if (delta > 1) {
          for (const el of card.content.children) {
            if (el === pack) continue;
            const top = parseFloat(el.dataset.stackTop || el.style.top);
            if (Number.isFinite(top) && top > (parseFloat(pack.style.top) || 0)) {
              const next = top + delta;
              el.style.top = next + "px";
              el.dataset.stackTop = String(next);
            }
          }
        }
      }
      const tail = parseFloat(getComputedStyle(card.content).paddingBottom) || 0;
      let contentH = 0;
      for (const child of card.content.children) {
        const base = parseFloat(child.dataset.stackTop);
        const top = Number.isFinite(base) ? base : (parseFloat(child.style.top) || 0);
        if (Number.isFinite(base)) child.style.top = top + "px";
        contentH = Math.max(contentH, top + child.offsetHeight);
      }
      contentH += tail;
      card.content.style.height = contentH + "px";
      const contentLen = Math.max(0, contentH - view);
      const smutLen = aliceSmutSpan(card, beat);
      return { smut: smutLen, content: contentLen, leave: beat, total: smutLen + contentLen + beat, contentH };
    });
    let cursor = 0;
    spans.forEach((span) => {
      span.start = cursor;
      cursor += span.total;
    });
    const hostTop = state.base + flowShift();
    const timeline = cursor;
    app.style.height = (hostTop + timeline) + "px";
    state.host.style.top = hostTop + "px";
    if (state.layer) {
      state.layer.style.height = hostTop + "px";
      state.layer.style.overflow = "hidden";
      state.layer.style.backgroundColor = "#DBDFE7";
      state.layer.style.zIndex = "8";
    }
    return { view, spans, hostTop, timeline, origin: hostTop, zoom };
  }

  let frame = 0;
  let metrics = null;
  function put(el, prop, value) {
    const key = "_pin" + prop;
    if (el[key] === value) return;
    el[key] = value;
    el.style[prop] = value;
  }
  function px(value) {
    return (Math.round(value * 100) / 100).toFixed(2);
  }
  function roundBottom(el, radius) {
    const v = !radius || radius < 0.5 ? "0px" : px(radius) + "px";
    put(el, "borderBottomLeftRadius", v);
    put(el, "borderBottomRightRadius", v);
  }
  function apply() {
    frame = 0;
    if (app.hidden) return;
    if (!metrics) metrics = measure();
    const scroller = document.scrollingElement || document.documentElement;
    const scroll = (window.scrollY || scroller.scrollTop || 0) / metrics.zoom;
    const { view, spans, hostTop, origin } = metrics;
    const s = scroll - hostTop;
    const morph = !reduce.matches;
    if (state.layer) {
      const introBottom = -s;
      let introR = 0;
      if (morph && introBottom < view && introBottom > 0) introR = 120 * (1 - introBottom / view);
      roundBottom(state.layer, introR);
    }
    state.cards.forEach((card, index) => {
      const span = spans[index];
      const t = s - span.start;
      // Next шмут is already fixed for the whole previous content phase.
      // Turning it on only at the exit is the pop.
      let mode = "off";
      if (index === 0 && t < 0 && s >= -view) mode = "hold";
      if (index > 0) {
        const prev = spans[index - 1];
        const prevT = s - prev.start;
        if (prevT >= prev.smut && prevT < prev.total) mode = "hold";
      }
      if (t >= 0 && t < span.smut) mode = "exit";
      else if (t >= span.smut && t < span.smut + span.content) mode = "scroll";
      else if (t >= span.smut + span.content && t < span.total) mode = "leave";
      const on = mode !== "off";
      card.card.classList.toggle("is-pinned", on);
      card.card.classList.toggle("is-live", mode === "exit" || mode === "scroll" || mode === "leave");
      put(card.card, "visibility", on ? "visible" : "hidden");
      put(card.card, "height", px(view) + "px");
      put(card.smut, "height", px(view) + "px");
      let z = "4";
      if (mode === "exit" || mode === "scroll") z = "5";
      if (mode === "leave") z = "6";
      put(card.card, "zIndex", z);
      let cardShift = "translate3d(0,-20000px,0)";
      let contentShift = "none";
      let smutShift = "none";
      let cardR = 0;
      let smutR = 0;
      let smutOn = false;
      if (mode === "hold") {
        cardShift = "none";
        smutOn = true;
      } else if (mode === "exit") {
        cardShift = "none";
        smutOn = true;
        const p = span.smut ? t / span.smut : 1;
        smutShift = Math.abs(t) < 0.005 ? "none" : "translate3d(0," + px(-t) + "px,0)";
        smutR = 120 * p;
      } else if (mode === "scroll") {
        cardShift = "none";
        const y = t - span.smut;
        contentShift = Math.abs(y) < 0.005 ? "none" : "translate3d(0," + px(-y) + "px,0)";
      } else if (mode === "leave") {
        const gone = t - span.smut - span.content;
        const p = span.leave ? gone / span.leave : 1;
        cardShift = Math.abs(gone) < 0.005 ? "none" : "translate3d(0," + px(-gone) + "px,0)";
        contentShift = Math.abs(span.content) < 0.005 ? "none" : "translate3d(0," + px(-span.content) + "px,0)";
        cardR = 120 * p;
      }
      put(card.card, "transform", on ? cardShift : "translate3d(0,-20000px,0)");
      put(card.content, "transform", contentShift);
      put(card.smut, "visibility", smutOn ? "visible" : "hidden");
      put(card.smut, "transform", smutOn ? smutShift : "translate3d(0,-20000px,0)");
      roundBottom(card.card, morph ? cardR : 0);
      roundBottom(card.smut, morph ? smutR : 0);
      put(card.card, "clipPath", "none");
    });
    put(state.gap, "display", "none");
    // «Оставайся» is parked under Alice. The purple field and the puck box
    // used to keep the copy hidden until Alice had fully left. Show it once
    // Alice's own content is about halfway down, and keep it hidden while it
    // would still sit on Alice's paragraph or be cut by the puck.
    // The phone and talk-bg use that same moment: they stay hidden until the
    // words appear, then ride with this block, under the words.
    if (!state.talkCopy) {
      const talk = document.querySelector('[data-section="talk"]');
      const title = talk && [...talk.querySelectorAll(".talk-title")].find((el) => (el.textContent || "").replace(/\s+/g, " ").includes("Оставайся"));
      state.talkCopy = title ? title.parentElement : null;
      state.talkTitle = title || null;
      const alice = document.querySelector('[data-section="alice"]');
      const heading = alice && [...alice.querySelectorAll(".talk-title")].find((el) => (el.textContent || "").replace(/\s+/g, " ").includes("напарник"));
      state.aliceIntro = heading ? heading.parentElement : null;
      state.alicePuck = alice ? alice.querySelector('img[src*="alice-puck"]') : null;
      state.talkCard = state.talkCopy ? state.cards.find((card) => card.content.contains(state.talkCopy)) : null;
      const veil = [];
      const scene = [];
      if (state.talkCard) {
        if (state.talkCard.plate) veil.push(state.talkCard.plate);
        if (state.talkCard.leadEl) veil.push(state.talkCard.leadEl);
        if (state.talkCard.arc) veil.push(state.talkCard.arc);
        for (const el of state.talkCard.content.children) {
          if (talk && el !== talk) veil.push(el);
        }
      }
      if (talk && state.talkCopy) {
        for (const el of talk.children) {
          if (el === state.talkCopy) continue;
          const src = ((el.querySelector("img") || {}).getAttribute && el.querySelector("img").getAttribute("src")) || "";
          if (el.classList.contains("talk-phone") || el.classList.contains("talk-bg") || src.includes("talk-bg") || src.includes("pin-home") || src.includes("talk-start")) scene.push(el);
          else veil.push(el);
        }
      }
      const parkedBg = document.querySelector(".talk-bg");
      if (parkedBg && !scene.includes(parkedBg)) scene.push(parkedBg);
      state.talkVeil = veil;
      state.talkScene = scene;
      state.talkSceneBg = parkedBg || scene.find((el) => {
        const img = el.querySelector("img");
        return img && (img.getAttribute("src") || "").includes("talk-bg");
      }) || null;
    }
    const copy = state.talkCopy;
    const aliceSpan = spans[1];
    const aliceLocal = aliceSpan ? scroll - origin - aliceSpan.start : -1;
    function overlaps(a, b) {
      return a.top < b.bottom - 0.5 && a.bottom > b.top + 0.5 && a.left < b.right - 0.5 && a.right > b.left + 0.5;
    }
    function veilTalk(on) {
      const value = on ? "hidden" : "";
      for (const el of state.talkVeil || []) put(el, "visibility", value);
      state.talkLifted = on;
    }
    // Phone + geometry stay under the words. While Alice still owns the
    // screen they are hidden until the words themselves are shown, then they
    // paint beneath that block and keep travelling with it.
    function placeScene(show, underCopy) {
      for (const el of state.talkScene || []) {
        put(el, "visibility", show ? "" : "hidden");
        put(el, "zIndex", underCopy ? "1" : "");
      }
      if (state.talkSceneBg) put(state.talkSceneBg, "backgroundColor", underCopy ? "#DBDFE7" : "");
    }
    const inAlice = false;
    if (inAlice) {
      const progressed = aliceSpan.content > 0 ? (aliceLocal - aliceSpan.enter) / aliceSpan.content : 1;
      let hold = progressed < 0.5;
      if (!hold) {
        const titleBox = state.talkTitle ? state.talkTitle.getBoundingClientRect() : null;
        const para = copy.querySelector("p:last-child");
        const paraBox = para ? para.getBoundingClientRect() : null;
        const box = titleBox && paraBox && titleBox.height > 1 && paraBox.height > 1
          ? { top: titleBox.top, bottom: paraBox.bottom, left: Math.min(titleBox.left, paraBox.left), right: Math.max(titleBox.right, paraBox.right) }
          : copy.getBoundingClientRect();
        if (box.height > 1 || (box.bottom - box.top) > 1) {
          if (state.aliceIntro) {
            const intro = state.aliceIntro.getBoundingClientRect();
            if (intro.height > 1 && overlaps(box, intro)) hold = true;
          }
          const puck = state.alicePuck;
          if (!hold && puck) {
            const pk = puck.getBoundingClientRect();
            if (pk.height > 1 && pk.width > 1) {
              const opaque = {
                top: pk.top + pk.height * (170 / 1052),
                bottom: pk.top + pk.height * (831 / 1052),
                left: pk.left,
                right: pk.right
              };
              if (overlaps(box, opaque)) hold = true;
            }
          }
        }
      }
      put(copy, "visibility", hold ? "hidden" : "");
      // Words go on the page color once Alice is about halfway down. The phone
      // and geometry come with them, under the words. This sheet stays at the
      // parked z-index from the stack loop (3): Alice is still the departing
      // card (5) and paints over the fragment. It opens from under her, not
      // on top. The plate and later sections stay down until this sheet starts.
      let sceneOn = false;
      if (!hold && state.talkCard) {
        put(state.talkCard.card, "pointerEvents", "none");
        put(copy, "zIndex", "2");
        put(copy, "background", "#DBDFE7");
        put(copy, "left", "0px");
        put(copy, "width", "375px");
        put(copy, "marginTop", "-36px");
        put(copy, "padding", "44px 21px 12px");
        put(copy, "boxSizing", "border-box");
        veilTalk(true);
        sceneOn = true;
      } else if (state.talkLifted) {
        if (state.talkCard) put(state.talkCard.card, "pointerEvents", "");
        put(copy, "zIndex", "");
        put(copy, "background", "");
        put(copy, "left", "21px");
        put(copy, "width", "333px");
        put(copy, "marginTop", "");
        put(copy, "padding", "");
        put(copy, "boxSizing", "");
        veilTalk(false);
      }
      placeScene(sceneOn, sceneOn);
    } else if (copy) {
      if (state.talkLifted) {
        if (state.talkCard) put(state.talkCard.card, "pointerEvents", "");
        put(copy, "zIndex", "");
        put(copy, "background", "");
        put(copy, "left", "21px");
        put(copy, "width", "333px");
        put(copy, "marginTop", "");
        put(copy, "padding", "");
        put(copy, "boxSizing", "");
        veilTalk(false);
      }
      put(copy, "visibility", "");
      placeScene(true, false);
    }
    const deviceSlider = state.deviceSlider || (state.deviceSlider = document.querySelector("[data-device-slider]"));
    if (deviceSlider && deviceSlider._pinDeviceRest) deviceSlider._pinDeviceRest();
    if (initLabWheel.flush) initLabWheel.flush();
    if (window.__pinScheme) window.__pinScheme();
  }

  function requestTick() {
    if (frame) return;
    frame = requestAnimationFrame(apply);
  }

  function requestLayout() {
    metrics = null;
    requestTick();
  }

  if (!initStackCards.bound) {
    initStackCards.bound = true;
    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestLayout, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", requestLayout, { passive: true });
      window.visualViewport.addEventListener("scroll", requestTick, { passive: true });
    }
    reduce.addEventListener("change", requestLayout);
    window.addEventListener("load", requestLayout);
  }
  apply();
  window.dispatchEvent(new Event("scroll"));
}

function initPreview() {
  if (initPreview.done) return;
  const preview = document.getElementById("preview");
  const sheet = document.getElementById("preview-sheet");
  const app = document.getElementById("app");
  if (!preview || !sheet) return;
  initPreview.done = true;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let peeled = false;
  let released = false;
  preview.classList.add("is-sealed");

  function maxScroll() {
    return Math.max(1, preview.clientHeight);
  }

  function setPeeled(on) {
    if (on === peeled) return;
    peeled = on;
    preview.classList.toggle("is-open", on);
    document.documentElement.classList.toggle("is-preview", !on);
    if (app && !app.hidden) app.inert = !on;
    preview.setAttribute("aria-hidden", on ? "true" : "false");
    if (!on) window.scrollTo(0, 0);
  }

  function apply() {
    const max = maxScroll();
    const y = preview.scrollTop;
    const p = Math.min(1, Math.max(0, y / max));
    const radius = !reduce.matches && p > 0 ? 120 * p : 0;
    const value = radius < 0.5 ? "0px" : radius.toFixed(2) + "px";
    sheet.style.borderBottomLeftRadius = value;
    sheet.style.borderBottomRightRadius = value;
    setPeeled(y >= max - 1);
  }

  window.pinPreviewOpen = () => {
    if (preview.hidden || released) return;
    released = true;
    const max = maxScroll();
    const start = performance.now();
    const duration = 720;
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      preview.scrollTop = max * eased;
      if (t < 1) requestAnimationFrame(step);
      else apply();
    };
    requestAnimationFrame(step);
  };

  preview.addEventListener("scroll", () => {
    if (!released) {
      if (preview.scrollTop !== 0) preview.scrollTop = 0;
      return;
    }
    apply();
  }, { passive: true });
  window.addEventListener("resize", apply);
  window.addEventListener("wheel", (event) => {
    if (preview.hidden || released) return;
    if (preview.contains(event.target)) event.preventDefault();
  }, { passive: false });
  window.addEventListener("touchmove", (event) => {
    if (preview.hidden || released) return;
    if (preview.contains(event.target)) event.preventDefault();
  }, { passive: false });
  if (!preview.hidden && app && !app.hidden) app.inert = true;
  apply();
}

function initHeroVideo() {
  const photo = document.querySelector(".hero-photo");
  const video = photo && photo.querySelector("video");
  if (!video) return;
  video.loop = false;
  video.muted = true;
  let away = true;
  const restart = () => {
    const go = () => {
      try { video.currentTime = 0; } catch (e) {}
      const pending = video.play();
      if (pending && pending.catch) pending.catch(() => {});
    };
    if (video.readyState >= 1) go();
    else video.addEventListener("loadedmetadata", go, { once: true });
  };
  const watch = () => {
    const box = photo.getBoundingClientRect();
    const onScreen = box.top < 80 && box.bottom > window.innerHeight * 0.35;
    if (onScreen) {
      if (!away) return;
      away = false;
      restart();
      return;
    }
    if (away) return;
    away = true;
    video.pause();
  };
  window.addEventListener("scroll", watch, { passive: true });
  window.addEventListener("resize", watch);
  watch();
}

initHeroVideo();
initStackCards();
initSchemeVideo();
document.querySelector(".pin-plaque")?.addEventListener("click", () => {
  const scroller = document.scrollingElement || document.documentElement;
  window.scrollTo(0, 0);
  scroller.scrollTop = 0;
});

function initSchemeVideo() {
  const shot = document.querySelector("[data-scheme-video]");
  const video = shot && shot.querySelector("video");
  if (!video) return;
  video.loop = false;
  video.muted = true;
  video.autoplay = false;
  video.preload = "auto";
  video.pause();
  const range = 1600;
  let want = 0;
  let sized = "";
  function zoomOf() {
    const stage = document.querySelector(".stage");
    const n = stage ? parseFloat(getComputedStyle(stage).zoom) : 1;
    return Number.isFinite(n) && n > 0 ? n : 1;
  }
  const hold = shot.parentElement;
  let anchor = -1;
  let mode = "";
  function layout() {
    const view = Math.max(1, window.innerHeight / zoomOf());
    const key = view.toFixed(2);
    if (key === sized) return;
    sized = key;
    shot.style.height = view + "px";
    if (hold && hold.classList.contains("hardware-shot-hold")) hold.style.height = (view + range) + "px";
  }
  function anchorOf() {
    const content = hold.closest(".stack-content");
    let y = 0;
    let node = hold;
    let guard = 0;
    while (node && node !== content && guard++ < 8) {
      y += node.offsetTop || 0;
      node = node.offsetParent;
    }
    return y;
  }
  function contentUp() {
    const content = hold.closest(".stack-content");
    const raw = content && content.style.transform || "";
    const match = /translate3d\(\s*0(?:px)?\s*,\s*(-?[\d.]+)px/.exec(raw);
    return match ? -parseFloat(match[1]) : 0;
  }
  function place(next) {
    if (next === mode) return;
    mode = next;
    shot.style.transform = "none";
    if (next === "pin") {
      const card = hold.closest(".stack-card");
      if (card && shot.parentElement !== card) card.appendChild(shot);
      shot.style.position = "absolute";
      shot.style.top = "0px";
      shot.style.left = "0px";
      shot.style.zIndex = "2";
      return;
    }
    if (shot.parentElement !== hold) hold.appendChild(shot);
    shot.style.position = "absolute";
    shot.style.left = "0px";
    shot.style.zIndex = "";
    shot.style.top = next === "after" ? range + "px" : "0px";
  }
  function canSeek() {
    if (!video.seekable || !video.seekable.length) return false;
    return video.readyState >= 2 && video.seekable.end(0) > 0.05;
  }
  function flush() {
    if (!canSeek()) return;
    if (Math.abs(video.currentTime - want) < 1 / 60) return;
    const next = want;
    try {
      if (typeof video.fastSeek === "function") video.fastSeek(next);
      else video.currentTime = next;
    } catch (e) {
      try { video.currentTime = next; } catch (err) {}
    }
  }
  function tick() {
    if (anchor < 0) anchor = anchorOf();
    const raw = contentUp() - anchor;
    const pin = Math.min(range, Math.max(0, raw));
    place(raw <= 0 ? "before" : raw >= range ? "after" : "pin");
    if (video.duration && isFinite(video.duration)) want = (pin / range) * video.duration;
    flush();
  }
  window.__pinScheme = tick;
  function onResize() {
    sized = "";
    anchor = -1;
    layout();
    tick();
  }
  layout();
  video.addEventListener("loadedmetadata", tick);
  window.addEventListener("resize", onResize);
  tick();
}
