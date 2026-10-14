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
  if (!wheels.length || !track) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const parts = wheels.map((el) => ({ el, base: el.style.transform.trim() }));
  const turn = 30;
  let frame = 0;

  function apply() {
    frame = 0;
    if (reduce.matches) {
      for (const { el, base } of parts) el.style.transform = base;
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
      card.className = "stack-card" + (plain ? " is-plain" : "") + (bare ? " is-bare" : "") + (memory ? " is-memory" : "") + (hardware ? " is-hardware" : "");
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
      return { card, plate, content, arc, origin, lead, leadEl };
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
      const showFrom = prev ? -(prev.content + prev.exit) : 0;
      const lead = span.lead || 0;
      // First cluster is already in the page. Pin starts when its top arrives;
      // visibility must not flip on that frame.
      const inFlow = index === 0 && local < span.enter;
      const visible = inFlow || (local >= showFrom && local < span.total);
      let F = 0;
      let O = 0;
      if (local < 0) {
        F = lead > 0 ? 0 : span.enter;
      } else if (local < span.enter) {
        if (lead > 0) O = -local;
        else F = span.enter === 0 ? 0 : span.enter * (1 - local / span.enter);
      } else if (local < span.enter + span.content) {
        O = -(lead + (local - span.enter));
      } else {
        F = -(local - span.enter - span.content);
        O = -(lead + span.content);
      }
      const stuck = visible && !inFlow && local < span.enter + span.content;
      card.card.classList.toggle("is-pinned", stuck);
      card.card.classList.toggle("is-live", inFlow || (visible && local >= 0 && local < span.enter + span.content));
      put(card.card, "visibility", visible ? "visible" : "hidden");
      put(card.card, "height", px(view) + "px");
      put(card.card, "zIndex", local >= 0 ? "5" : "3");
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
    // Alice has no plate, so the parked «Оставайся» sheet shows through it.
    // Keep the sheet; hide its copy while it still shares pixels with Alice
    // (paragraph, device, background, later copy). Empty visibility inherits
    // the card, so a hidden card does not leak the copy.
    if (!state.talkCopy) {
      const talk = document.querySelector('[data-section="talk"]');
      const title = talk && [...talk.querySelectorAll(".talk-title")].find((el) => (el.textContent || "").replace(/\s+/g, " ").includes("Оставайся"));
      state.talkCopy = title ? title.parentElement : null;
      const alice = document.querySelector('[data-section="alice"]');
      state.aliceBlockers = alice ? [...alice.children] : [];
    }
    const copy = state.talkCopy;
    if (copy) {
      const box = copy.getBoundingClientRect();
      let hold = false;
      if (box.height > 1 && box.width > 1) {
        for (const blocker of state.aliceBlockers) {
          const other = blocker.getBoundingClientRect();
          if (other.height < 1 || other.width < 1) continue;
          const y = box.top < other.bottom - 0.5 && box.bottom > other.top + 0.5;
          const x = box.left < other.right - 0.5 && box.right > other.left + 0.5;
          if (y && x) {
            hold = true;
            break;
          }
        }
      }
      put(copy, "visibility", hold ? "hidden" : "");
    }
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
