const GATE_KEY = "pin-landing-unlocked";
const PASS = "8R+qfJt9m#i6#a-Xb0Q&_+#-0xUC%dbl";

function unlock() {
  sessionStorage.setItem(GATE_KEY, "1");
}

function showApp() {
  document.getElementById("gate").hidden = true;
  document.getElementById("app").hidden = false;
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

  openBtn.addEventListener("click", (event) => {
    event.preventDefault();
    openSignup();
  });

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
  const scroller = sheet.querySelector(".terms-panels");

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
    if (!moved || Math.abs(velocity) < 0.05) return;
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
    cancelAnimationFrame(frame);
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
  if (!track || !pin || !phone || !dim || !jewel || !ask || !home || !keyboard || !keyboardLip || shots.length !== 4 || caps.length !== 4 || !stage || !app) return;

  const baseW = 226.29;
  const largeW = 329.3;
  const fullScale = largeW / baseW;
  const scales = [1, 1, fullScale, fullScale];
  const blockDesign = 603;
  const scrubDesign = 2000;
  const askMs = 200;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;
  let askK = 0;
  let askFrom = 0;
  let askTo = 0;
  let askStarted = 0;
  let askPlaying = false;

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

  function seekAsk(now, on) {
    const target = on ? 1 : 0;
    if (reduce.matches) {
      askK = target;
      askTo = target;
      askPlaying = false;
      return;
    }
    if (!askPlaying && askK === target) return;
    if (askTo !== target) {
      askFrom = askK;
      askTo = target;
      askStarted = now;
      askPlaying = true;
    }
    if (!askPlaying) return;
    const t = Math.min(1, (now - askStarted) / askMs);
    askK = askFrom + (askTo - askFrom) * easeAsk(t);
    if (t >= 1) {
      askK = askTo;
      askPlaying = false;
    }
  }

  function zoomOf() {
    const n = parseFloat(getComputedStyle(stage).zoom);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }

  function segmentAt(progress) {
    const dist = progress >= 1 ? scrubDesign : Math.min(scrubDesign, Math.max(0, progress * scrubDesign));
    if (dist < 600) return { a: 0, b: 1, t: dist / 600 };
    if (dist < 1000) return { a: 1, b: 1, t: 0 };
    if (dist < 1600) return { a: 1, b: 2, t: (dist - 1000) / 600 };
    return { a: 2, b: 2, t: 0 };
  }

  function keyboardHeight() {
    const h = keyboard.offsetHeight;
    if (h > 0) return h;
    const w = keyboard.offsetWidth || phone.clientWidth * 0.89151874;
    return w * (528 / 679);
  }

  function hold(nodes, step, progress) {
    const index = progress >= 1 ? step.b : step.a;
    nodes.forEach((img, idx) => {
      if (idx !== index) img.style.opacity = "0";
    });
    if (nodes[index]) nodes[index].style.opacity = "1";
  }

  function paintShots(step, progress) {
    const overlay = !reduce.matches && progress < 1 && step.a === 0;
    shots[1].style.transform = "";
    if (!overlay) {
      dim.style.opacity = "0";
      hold(shots, step, progress);
      return;
    }
    const t = step.t;
    shots[0].style.opacity = "1";
    shots[2].style.opacity = "0";
    shots[3].style.opacity = "0";
    dim.style.opacity = String(0.25 * t);
    if (t <= 0) {
      shots[1].style.opacity = "0";
      return;
    }
    shots[1].style.opacity = "1";
    shots[1].style.transform = "translateX(" + ((1 - t) * 100) + "%)";
  }

  function tick() {
    frame = 0;
    if (app.hidden) {
      pin.classList.remove("is-on");
      return;
    }
    const zoom = zoomOf();
    const rect = track.getBoundingClientRect();
    const blockV = blockDesign * zoom;
    const cta = document.querySelector(".buy-cta-pos");
    const ctaTop = cta ? cta.getBoundingClientRect().top : window.innerHeight;
    const gap = 12 * zoom;
    const space = Math.max(0, ctaTop - gap);
    let pinTop = (space - blockV) / 2;
    if (pinTop < 8 * zoom) pinTop = Math.max(0, space - blockV);

    let top = rect.top;
    let progress = 0;
    const canPin = !reduce.matches && rect.height > blockV + 1;
    if (canPin) {
      if (rect.top > pinTop) {
        top = rect.top;
        progress = 0;
      } else if (rect.bottom - blockV < pinTop) {
        top = rect.bottom - blockV;
        progress = 1;
      } else {
        top = pinTop;
        const scrubV = scrubDesign * zoom;
        progress = scrubV > 0 ? Math.min(1, (pinTop - rect.top) / scrubV) : 0;
      }
    }

    pin.style.left = rect.left + "px";
    pin.style.top = top + "px";
    pin.style.transform = "scale(" + zoom + ")";
    pin.classList.add("is-on");

    const shown = reduce.matches ? 0 : progress;
    const step = segmentAt(shown);
    const past = shown >= 1;
    seekAsk(performance.now(), past);
    const stage4 = past && !askPlaying && askK >= 1;
    paintShots(step, shown);
    hold(caps, step, shown);
    if (stage4) {
      shots.forEach((img, idx) => {
        img.style.opacity = idx === 3 ? "1" : "0";
      });
      shots[1].style.transform = "";
      dim.style.opacity = "0";
      caps.forEach((cap, idx) => {
        cap.style.opacity = idx === 3 ? "1" : "0";
      });
    }
    const askShot = stage4 ? 3 : (shown >= 1 ? step.b : step.a);
    const k = askK;
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
    ask.style.opacity = askShot === 1 || askShot === 2 || askShot === 3 ? "1" : "0";
    home.style.opacity = askShot === 1 || askShot === 2 || askShot === 3 ? "1" : "0";
    const scale = scales[step.a] + (scales[step.b] - scales[step.a]) * step.t;
    phone.style.transform = "scale(" + scale + ")";

    if (reduce.matches) {
      jewel.style.visibility = "hidden";
    } else {
      const dist = shown >= 1 ? scrubDesign : Math.min(scrubDesign, Math.max(0, shown * scrubDesign));
      let off = 1;
      if (dist < 600) off = Math.pow(1 - dist / 600, 3);
      else if (dist < 1000) off = 0;
      else if (dist < 1600) off = Math.pow((dist - 1000) / 600, 3);
      jewel.style.visibility = "";
      jewel.style.transform = "translateX(" + (off * 100) + "px)";
    }
    if (askPlaying) requestTick();
  }

  function requestTick() {
    if (frame) return;
    frame = requestAnimationFrame(tick);
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

  function likePark() {
    if (!like) return 0;
    const offerLeft = parseFloat(getComputedStyle(root).left) || 0;
    const likeLeft = parseFloat(getComputedStyle(like).left) || 0;
    const width = like.offsetWidth || 44;
    return -(offerLeft + likeLeft + width + 8);
  }

  function paint(value) {
    dx = value;
    if (active) active.style.transform = "translateX(" + value + "px)";
    if (!like) return;
    const park = likePark();
    const travel = Math.abs(park) || 1;
    const t = Math.max(0, Math.min(1, value / travel));
    like.style.opacity = t > 0 ? "1" : "0";
    like.style.transform = "translateX(" + (park * (1 - t)).toFixed(2) + "px)";
  }

  function clearMotion() {
    if (active) {
      active.style.transition = "";
      active.style.transform = "";
      active.style.transformOrigin = "";
    }
    if (like) {
      like.style.transition = "";
      like.style.opacity = "";
      like.style.transform = "";
    }
    active = null;
    dx = 0;
    root.classList.remove("is-dragging", "is-settling");
  }

  function rotate() {
    const list = cards();
    if (list.length < 2) return false;
    const next = flipRotatedSlots(list.map((card) => card.getAttribute("data-slot")));
    list.forEach((card, index) => {
      card.setAttribute("data-slot", String(next[index]));
    });
    return true;
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
    card.style.transition = "transform 0.32s ease";
    card.style.transform = "translateX(0px)";
    if (like) {
      like.style.transition = "transform 0.32s ease";
      like.style.opacity = "1";
      like.style.transform = "translateX(" + likePark().toFixed(2) + "px)";
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
    const list = cards();
    if (list.length < 2) {
      springBack();
      return;
    }
    busy = true;
    const token = gesture;
    root.classList.remove("is-dragging");
    if (reduce.matches) {
      card.style.transform = "";
      rotate();
      clearMotion();
      busy = false;
      return;
    }
    const before = new Map();
    list.forEach((el) => before.set(el, el.getBoundingClientRect()));
    root.classList.add("is-settling");
    card.style.transition = "none";
    card.style.transform = "";
    if (like) {
      like.style.transition = "transform 0.32s ease";
      like.style.opacity = "1";
      like.style.transform = "translateX(" + likePark().toFixed(2) + "px)";
    }
    rotate();
    void root.offsetWidth;
    const scale = zoom() || 1;
    list.forEach((el) => {
      const from = before.get(el);
      const to = el.getBoundingClientRect();
      const tx = (from.left - to.left) / scale;
      const ty = (from.top - to.top) / scale;
      const sx = to.width ? from.width / to.width : 1;
      const sy = to.height ? from.height / to.height : 1;
      el.style.transition = "none";
      el.style.transformOrigin = "top left";
      el.style.transform = "translate(" + tx + "px," + ty + "px) scale(" + sx + "," + sy + ")";
    });
    void root.offsetWidth;
    list.forEach((el) => {
      el.style.transition = "transform 0.42s cubic-bezier(.22,.7,.3,1)";
      el.style.transform = "";
    });
    window.setTimeout(() => {
      if (token !== gesture) return;
      list.forEach((el) => {
        el.style.transition = "";
        el.style.transform = "";
        el.style.transformOrigin = "";
      });
      clearMotion();
      busy = false;
    }, 460);
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
    pointerId = null;
    dragging = false;
    axis = null;
    if (!moved) {
      clearMotion();
      return;
    }
    if (width > 0 && pulled >= width * 0.4) commit();
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
    if (el.dataset.section === "memory" || el.dataset.section === "itogi") return 3;
    if (el.classList.contains("hardware-pack")) return 5;
    const head = (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80);
    if (head.includes("Помогает") && head.includes("важное")) return 0;
    if (head.includes("подпиской")) return 4;
    if (head.includes("конфиденциально")) return 6;
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
      if (group >= 0 && group < 7) item.group = group;
    }

    const groups = [[], [], [], [], [], [], []];
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
      const bare = index === 4;
      const memory = index === 3;
      const hardware = index === 5;
      const flush = index === 6;
      const dock = index === 0;
      card.className = "stack-card" + (plain ? " is-plain" : "") + (bare ? " is-bare" : "") + (memory ? " is-memory" : "") + (hardware ? " is-hardware" : "") + (flush ? " is-flush" : "") + (dock ? " is-dock" : "");
      const plate = document.createElement("div");
      plate.className = "stack-plate";
      const leadEl = document.createElement("div");
      leadEl.className = "stack-lead";
      const content = document.createElement("div");
      content.className = "stack-content";
      const arc = document.createElement("div");
      arc.className = "stack-arc";
      const origin = index === 0 && anchorY != null ? anchorY : Math.min(...items.map((item) => item.y));
      const lead = index === 0 || plain ? 0 : 120;
      items.forEach((item) => {
        item.el.style.position = "absolute";
        item.el.dataset.stackTop = String(item.y - origin);
        item.el.style.top = (item.y - origin) + "px";
        item.el.style.translate = "none";
        content.appendChild(item.el);
      });
      card.appendChild(plate);
      card.appendChild(leadEl);
      card.appendChild(content);
      card.appendChild(arc);
      host.appendChild(card);
      return { card, plate, content, arc, origin, lead, leadEl, dock, cover: plain };
    });
    app.appendChild(host);
    footer.style.translate = "none";

    initStackCards.state = {
      host,
      gap,
      cards,
      footer,
      base: anchorY != null ? anchorY : groups[0].reduce((min, item) => Math.min(min, item.y), Infinity)
    };
  }

  const state = initStackCards.state;
  if (!state) return;

  function measure() {
    const zoom = zoomOf();
    const view = Math.max(1, window.innerHeight / zoom);
    const rise = reduce.matches ? 0 : 120;
    const exit = reduce.matches ? 0 : view;
    const spans = state.cards.map((card, index) => {
      const lead = reduce.matches ? 0 : (card.lead || 0);
      const tail = parseFloat(getComputedStyle(card.content).paddingBottom) || 0;
      let contentH = 0;
      for (const child of card.content.children) {
        const base = parseFloat(child.dataset.stackTop);
        const top = (Number.isFinite(base) ? base : (parseFloat(child.style.top) || 0)) + lead;
        if (Number.isFinite(base)) child.style.top = top + "px";
        contentH = Math.max(contentH, top + child.offsetHeight);
      }
      contentH += tail;
      card.content.classList.toggle("has-lead", lead > 0);
      const bodyH = Math.max(0, contentH - lead);
      const contentLen = bodyH > view ? bodyH - view : Math.min(200, view);
      card.content.style.height = contentH + "px";
      const enter = index === 0 ? rise : lead;
      return { enter, lead, content: contentLen, exit, total: enter + contentLen + exit, contentH };
    });
    let cursor = 0;
    spans.forEach((span) => {
      span.start = cursor;
      cursor += span.total;
    });
    const hostTop = state.base + flowShift();
    const timeline = cursor;
    state.footer.style.top = (hostTop + timeline) + "px";
    app.style.height = (hostTop + timeline + state.footer.offsetHeight) + "px";
    state.host.style.top = hostTop + "px";
    const firstEnter = spans[0] ? spans[0].enter : 0;
    return { view, spans, hostTop, timeline, origin: hostTop - firstEnter, zoom };
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
  // Bottom cap of the subscription blob (plans-blob.png rotated into a 375-wide stadium).
  const purpleCap = 187.5;
  function sheetTop(span, stuck, inFlow, F, hostTop, scroll, firstEnter) {
    if (inFlow) return hostTop - scroll;
    if (stuck) return F;
    return hostTop + (span.start + span.enter + span.content - firstEnter) - scroll;
  }
  function purpleClip(tip, view) {
    const y0 = tip - purpleCap;
    if (y0 >= view) return "inset(100%)";
    if (tip <= 0.5) return "none";
    const steps = 32;
    const parts = [];
    for (let i = 0; i <= steps; i++) {
      const theta = Math.PI * (1 - i / steps);
      const x = purpleCap + purpleCap * Math.cos(theta);
      const y = y0 + purpleCap * Math.sin(theta);
      parts.push(px(x) + "px " + px(y) + "px");
    }
    parts.push(px(375) + "px " + px(view) + "px");
    parts.push("0px " + px(view) + "px");
    return "polygon(" + parts.join(", ") + ")";
  }
  function apply() {
    frame = 0;
    if (app.hidden) return;
    if (!metrics) metrics = measure();
    const scroller = document.scrollingElement || document.documentElement;
    const scroll = (window.scrollY || scroller.scrollTop || 0) / metrics.zoom;
    const { view, spans, hostTop, origin } = metrics;
    const firstEnter = hostTop - origin;
    let purpleScreenTip = null;
    state.cards.forEach((card, index) => {
      const span = spans[index];
      const local = scroll - origin - span.start;
      const prev = index > 0 ? spans[index - 1] : null;
      // Next sheet is already parked under the current one for the whole
      // content phase, not only during exit. Turning it on at exit is the pop.
      // The pin sheet is the exception: it stays hidden until the wheel has
      // finished, then rises over that stopped sheet instead of waiting under it.
      const showFrom = prev ? (card.cover ? -prev.exit : -(prev.content + prev.exit)) : 0;
      const lead = span.lead || 0;
      // First cluster is already in the page. Pin starts when its top arrives;
      // visibility must not flip on that frame.
      const inFlow = index === 0 && local < span.enter;
      // Wheel stays put after its own content, under the rising pin sheet,
      // until Alice's field has covered the viewport. Release before halfway
      // so «Оставайся» can still show through Alice, under her, not under the wheel.
      const pinSpan = spans[1];
      const pinLocal = pinSpan ? scroll - origin - pinSpan.start : Infinity;
      const pinCover = pinSpan ? Math.min(640, pinSpan.content * 0.45) : 0;
      const pinStillOverWheel = !!(pinSpan && pinLocal < (pinSpan.enter || 0) + pinCover);
      const holding = !!(card.dock && pinStillOverWheel && local >= span.enter + span.content);
      const visible = inFlow || (local >= showFrom && local < span.total) || holding;
      let F = 0;
      let O = 0;
      if (local < 0) {
        F = card.cover ? -local : (lead > 0 ? 0 : span.enter);
      } else if (local < span.enter) {
        if (lead > 0) O = -local;
        else F = span.enter === 0 ? 0 : span.enter * (1 - local / span.enter);
      } else if (local < span.enter + span.content) {
        O = -(lead + (local - span.enter));
      } else if (holding) {
        F = 0;
        O = -(lead + span.content);
      } else {
        F = -(local - span.enter - span.content);
        O = -(lead + span.content);
      }
      const stuck = visible && !inFlow && (local < span.enter + span.content || holding);
      card.card.classList.toggle("is-pinned", stuck);
      card.card.classList.toggle("is-live", inFlow || (visible && local >= 0 && local < span.enter + span.content));
      put(card.card, "visibility", visible ? "visible" : "hidden");
      put(card.card, "height", px(view) + "px");
      let z = local >= 0 ? "5" : "3";
      if (holding) z = "4";
      if (card.cover && visible && local < span.enter + span.content) z = "6";
      put(card.card, "zIndex", z);
      let shiftText;
      if (!visible) shiftText = "translate3d(0,-20000px,0)";
      else if (inFlow) shiftText = "none";
      else if (stuck) shiftText = Math.abs(F) < 0.005 ? "none" : "translate3d(0," + px(F) + "px,0)";
      else shiftText = "translate3d(0," + px(span.start + span.enter + span.content - firstEnter) + "px,0)";
      put(card.card, "transform", shiftText);
      const contentShift = Math.abs(O) < 0.005 ? "none" : "translate3d(0," + px(O) + "px,0)";
      put(card.content, "transform", contentShift);
      if (card.plate) {
        put(card.plate, "height", px(span.contentH) + "px");
        put(card.plate, "transform", contentShift);
      }
      if (card.leadEl) put(card.leadEl, "height", px(Math.max(0, lead + O)) + "px");
      const endY = span.contentH + O;
      card.card.classList.toggle("is-ended", visible && endY <= view + 1 && endY >= view - 1.5);
      if (card.arc) {
        put(card.arc, "top", px(Math.max(0, span.contentH - 140)) + "px");
        put(card.arc, "transform", contentShift);
      }
      const topNow = visible ? sheetTop(span, stuck, inFlow, F, hostTop, scroll, firstEnter) : null;
      if (card.card.classList.contains("is-bare")) {
        purpleScreenTip = topNow == null ? null : topNow + endY;
      }
      const prevEl = index > 0 ? state.cards[index - 1].card : null;
      if (prevEl && prevEl.classList.contains("is-bare")) {
        const clip = visible && topNow != null && purpleScreenTip != null
          ? purpleClip(purpleScreenTip - topNow, view)
          : "none";
        put(card.card, "clipPath", clip);
        card.card.classList.toggle("is-arc-clip", clip.indexOf("polygon") === 0);
      }
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
          if (src.includes("talk-bg") || src.includes("pin-home")) scene.push(el);
          else veil.push(el);
        }
      }
      state.talkVeil = veil;
      state.talkScene = scene;
      state.talkSceneBg = scene.find((el) => {
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
    const inAlice = copy && aliceSpan && aliceLocal > -120 && aliceLocal < aliceSpan.total;
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

initStackCards();
