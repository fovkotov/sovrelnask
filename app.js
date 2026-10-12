const GATE_KEY = "pin-landing-unlocked";
const PASS = "8R+qfJt9m#i6#a-Xb0Q&_+#-0xUC%dbl";

function unlock() {
  sessionStorage.setItem(GATE_KEY, "1");
}

let recheckTalkTitle = function () {};

function showApp() {
  document.getElementById("gate").hidden = true;
  document.getElementById("app").hidden = false;
  recheckTalkTitle();
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
  const openBtn = document.getElementById("hardware-open");
  const root = document.getElementById("hardware");
  if (!openBtn || !root) return;
  const closeBtn = root.querySelector(".hardware-close");

  function syncScroll() {
    const signup = document.getElementById("signup");
    const terms = document.getElementById("terms");
    const specs = document.getElementById("specs");
    const open = !root.hidden || (signup && !signup.hidden) || (terms && !terms.hidden) || (specs && !specs.hidden);
    document.body.style.overflow = open ? "hidden" : "";
  }

  function openHardware() {
    root.hidden = false;
    syncScroll();
    if (closeBtn) closeBtn.focus();
  }

  function closeHardware() {
    if (root.hidden) return;
    root.hidden = true;
    syncScroll();
    openBtn.focus();
  }

  openBtn.addEventListener("click", openHardware);
  openBtn.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    openHardware();
  });

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
  if (!wheels.length || !track) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const parts = wheels.map((el) => ({ el, base: el.style.transform.trim() }));
  const flies = [...track.querySelectorAll(".lab-fly")].map((el) => ({
    el,
    x: Number(el.dataset.flyX),
    y: Number(el.dataset.flyY),
  }));
  const turn = 30;
  const flightPx = 260;
  const regularLagPx = 400;
  let frame = 0;

  function easeOut(t) {
    const x = Math.min(1, Math.max(0, t));
    return 1 - (1 - x) ** 3;
  }

  function slotTop(el, progress, top, height, zoom) {
    const localX = el.offsetLeft + el.offsetWidth / 2 - track.offsetWidth / 2;
    const localY = el.offsetTop - track.offsetHeight / 2;
    const rad = (progress * turn * Math.PI) / 180;
    const rotY = localX * Math.sin(rad) + localY * Math.cos(rad);
    return top + height / 2 + rotY * zoom;
  }

  function placeFlies(progress, metrics) {
    if (!metrics) {
      for (const fly of flies) fly.el.style.transform = "translate(0px, 0px)";
      return;
    }
    const { top, height, zoom, vh } = metrics;
    const span = flightPx * zoom;
    const entered = new Map();
    for (const fly of flies) {
      entered.set(fly, vh - slotTop(fly.el, progress, top, height, zoom));
    }
    const regular = flies.find((fly) => fly.el.dataset.labFly === "regular");
    const tariffs = flies.find((fly) => fly.el.dataset.labFly === "tariffs");
    const gap = regular && tariffs ? entered.get(regular) - entered.get(tariffs) : span;
    const delay = Math.max(0, span - gap);
    const total = height + vh;
    let regularShift = 0;
    if (regular && total > 0) {
      const localX = regular.el.offsetLeft + regular.el.offsetWidth / 2 - track.offsetWidth / 2;
      const localY = regular.el.offsetTop - track.offsetHeight / 2;
      let entry = 0.13;
      for (let i = 0; i < 6; i++) {
        const rad = (entry * turn * Math.PI) / 180;
        const rotY = localX * Math.sin(rad) + localY * Math.cos(rad);
        entry = (height / 2 + rotY * zoom) / total;
      }
      const delayed = entry + (regularLagPx * zoom) / total;
      const delayedTop = vh - delayed * total;
      regularShift = vh - slotTop(regular.el, delayed, delayedTop, height, zoom);
    }
    for (const fly of flies) {
      const travel = entered.get(fly) - (fly === regular ? regularShift : 0) - (fly === tariffs ? delay : 0);
      const k = 1 - easeOut(span > 0 ? travel / span : 1);
      fly.el.style.transform = `translate(${(fly.x * k).toFixed(2)}px, ${(fly.y * k).toFixed(2)}px)`;
    }
  }

  function apply() {
    frame = 0;
    if (reduce.matches) {
      for (const { el, base } of parts) el.style.transform = base;
      placeFlies(1, null);
      return;
    }
    const rect = track.getBoundingClientRect();
    const stage = document.querySelector(".stage");
    const stageBox = stage.getBoundingClientRect();
    const zoom = stage.offsetWidth ? stageBox.width / stage.offsetWidth : 1;
    const height = track.offsetHeight * zoom;
    const top = rect.top + rect.height / 2 - height / 2;
    const vh = window.innerHeight;
    const total = height + vh;
    const progress = total > 0 ? Math.min(1, Math.max(0, (vh - top) / total)) : 0;
    const spin = `rotate(${(progress * turn).toFixed(3)}deg)`;
    for (const { el, base } of parts) {
      el.style.transform = base ? `${base} ${spin}` : spin;
    }
    placeFlies(progress, { top, height, zoom, vh });
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

  let placed = false;
  function frameRest() {
    if (placed || dragging || Number.isNaN(rest) || limit() <= 0) return;
    root.scrollLeft = clamp(rest);
    placed = true;
  }

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
  const keyboard = pin && pin.querySelector(".meet-keyboard");
  const stage = document.querySelector(".stage");
  const app = document.getElementById("app");
  if (!track || !pin || !phone || !dim || !jewel || !ask || !keyboard || shots.length !== 4 || caps.length !== 4 || !stage || !app) return;

  const baseW = 226.29;
  const largeW = 329.3;
  const fullScale = largeW / baseW;
  const scales = [1, 1, fullScale, fullScale];
  const blockDesign = 603;
  const scrubDesign = 2200;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;

  function zoomOf() {
    const n = parseFloat(getComputedStyle(stage).zoom);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }

  function segmentAt(progress) {
    const dist = progress >= 1 ? scrubDesign : Math.min(scrubDesign, Math.max(0, progress * scrubDesign));
    if (progress >= 1) return { a: 2, b: 3, t: 1 };
    if (dist < 600) return { a: 0, b: 1, t: dist / 600 };
    if (dist < 1000) return { a: 1, b: 1, t: 0 };
    if (dist < 1600) return { a: 1, b: 2, t: (dist - 1000) / 600 };
    return { a: 2, b: 3, t: (dist - 1600) / 600 };
  }

  function keyboardHeight() {
    const h = keyboard.offsetHeight;
    if (h > 0) return h;
    const w = keyboard.offsetWidth || phone.clientWidth * 0.89151874;
    return w * (528 / 679);
  }

  function keyboardT(step, shown) {
    const index = shown >= 1 ? step.b : step.a;
    if (reduce.matches) return index === 3 ? 1 : 0;
    if (shown >= 1) return 1;
    if (step.a === 2 && step.b === 3) return step.t;
    return 0;
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
    paintShots(step, shown);
    hold(caps, step, shown);
    const askShot = shown >= 1 ? step.b : step.a;
    const k = keyboardT(step, shown);
    const kbH = keyboardHeight();
    keyboard.style.transform = "translate3d(0," + ((1 - k) * (kbH + 2)).toFixed(2) + "px,0)";
    ask.style.transform = "translate3d(0," + ((-k) * kbH).toFixed(2) + "px,0)";
    ask.style.opacity = askShot === 1 || askShot === 2 ? "1" : "0";
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


function initTalkTitle() {
  const titles = [...document.querySelectorAll(".talk-title")];
  if (!titles.length) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const duration = 504;
  const stagger = 17;
  const easing = "cubic-bezier(0.2, 0.8, 0.2, 1)";
  const yFrom = Math.round(32 * 0.58 * 100) / 100;
  const pending = new Set();
  let observer = null;

  function pose(y) {
    return "translate3d(0px, " + y + "px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1)";
  }

  function glyphs(title) {
    return [...title.querySelectorAll(".text-animation-unit")];
  }

  function showSettled(title) {
    glyphs(title).forEach((unit) => {
      unit.style.opacity = "1";
      unit.style.transform = pose(0);
      unit.style.willChange = "auto";
    });
  }

  function split(title) {
    const source = title.innerHTML;
    let rank = 0;
    function visit(node) {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === 1) {
          if (child.tagName !== "BR") visit(child);
          return;
        }
        if (child.nodeType !== 3) return;
        const text = child.textContent.replace(/^[ \t\r\n]+|[ \t\r\n]+$/g, "");
        if (!text) {
          child.remove();
          return;
        }
        const frag = document.createDocumentFragment();
        function appendUnits(parent, value) {
          Array.from(value).forEach((ch) => {
            const unit = document.createElement("span");
            unit.className = "text-animation-unit";
            unit.textContent = ch;
            unit.dataset.rank = String(rank);
            unit.style.opacity = "0";
            unit.style.transform = pose(yFrom);
            rank += 1;
            parent.appendChild(unit);
          });
        }
        text.split(/([ \t]+)/).forEach((part) => {
          if (!part) return;
          if (/^[ \t]+$/.test(part)) {
            appendUnits(frag, part);
            return;
          }
          const word = document.createElement("span");
          word.className = "text-animation-word";
          appendUnits(word, part);
          frag.appendChild(word);
        });
        child.replaceWith(frag);
      });
    }
    try {
      visit(title);
      if (!rank) throw new Error("empty title");
      return true;
    } catch {
      title.innerHTML = source;
      return false;
    }
  }

  function stopWatching() {
    if (observer) observer.disconnect();
    observer = null;
    window.removeEventListener("scroll", recheckTalkTitle);
    window.removeEventListener("resize", recheckTalkTitle);
    if (window.visualViewport) {
      window.visualViewport.removeEventListener("scroll", recheckTalkTitle);
      window.visualViewport.removeEventListener("resize", recheckTalkTitle);
    }
    recheckTalkTitle = function () {};
  }

  function play(title) {
    if (!pending.has(title)) return;
    pending.delete(title);
    if (observer) observer.unobserve(title);
    try {
      glyphs(title).forEach((unit) => {
        const rank = Number(unit.dataset.rank) || 0;
        const anim = unit.animate(
          [
            { opacity: 0, transform: pose(yFrom) },
            { opacity: 1, transform: pose(0) },
          ],
          { delay: rank * stagger, duration: duration, easing: easing, fill: "forwards" }
        );
        anim.finished.then(() => {
          unit.style.opacity = "1";
          unit.style.transform = pose(0);
          unit.style.willChange = "auto";
        }).catch(() => {
          unit.style.opacity = "1";
          unit.style.transform = pose(0);
          unit.style.willChange = "auto";
        });
      });
    } catch {
      showSettled(title);
    }
    if (!pending.size) stopWatching();
  }

  function appearsInViewport(title) {
    const app = document.getElementById("app");
    if (!app || app.hidden || title.closest("[hidden]")) return false;
    const rect = title.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return false;
    const vv = window.visualViewport;
    const viewTop = vv ? vv.offsetTop : 0;
    const viewLeft = vv ? vv.offsetLeft : 0;
    const viewH = vv ? vv.height : (window.innerHeight || document.documentElement.clientHeight);
    const viewW = vv ? vv.width : (window.innerWidth || document.documentElement.clientWidth);
    const overlapsX = rect.right > viewLeft && rect.left < viewLeft + viewW;
    if (!overlapsX) return false;
    const center = (rect.top + rect.bottom) / 2;
    const mid = viewTop + viewH * 0.75;
    return center <= mid;
  }

  titles.forEach((title) => {
    if (split(title)) pending.add(title);
  });
  if (!pending.size) return;

  recheckTalkTitle = function () {
    [...pending].forEach((title) => {
      if (appearsInViewport(title)) play(title);
    });
  };

  if (typeof IntersectionObserver !== "function") {
    pending.forEach(showSettled);
    pending.clear();
    return;
  }

  window.addEventListener("scroll", recheckTalkTitle, { passive: true });
  window.addEventListener("resize", recheckTalkTitle);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("scroll", recheckTalkTitle, { passive: true });
    window.visualViewport.addEventListener("resize", recheckTalkTitle);
  }

  try {
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (appearsInViewport(entry.target)) play(entry.target);
      });
    }, { root: null, rootMargin: "0px", threshold: 0 });
    pending.forEach((title) => observer.observe(title));
  } catch {
    pending.forEach(showSettled);
    pending.clear();
    stopWatching();
    return;
  }

  recheckTalkTitle();
}

initTalkTitle();
initSecuritySlider();

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
