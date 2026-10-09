const GATE_KEY = "pin-landing-unlocked";
const PASS = "8R+qfJt9m#i6#a-Xb0Q&_+#-0xUC%dbl";

function unlock() {
  sessionStorage.setItem(GATE_KEY, "1");
}

function showApp() {
  document.getElementById("gate").hidden = true;
  document.getElementById("app").hidden = false;
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
    document.body.style.overflow = "";
    openBtn.focus();
  }

  openBtn.addEventListener("click", (event) => {
    event.preventDefault();
    openSignup();
  });

  root.querySelector(".signup-backdrop").addEventListener("click", closeSignup);
  root.querySelector(".signup-close").addEventListener("click", closeSignup);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSignup();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
}

initGate();
initSignup();
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

function initContextCarousel() {
  const root = document.querySelector("[data-ctx-carousel]");
  if (!root) return;
  const track = root.querySelector(".ctx-track");
  const pager = root.parentElement.querySelector(".ctx-pager");
  const pips = pager ? [...pager.querySelectorAll(".ctx-pip")] : [];
  const count = track.children.length;
  const slideW = 292.364;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let index = 0;
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let origin = 0;
  let x = 0;
  let lastX = 0;
  let lastT = 0;
  let velocity = 0;
  let axis = null;
  let dragging = false;

  function zoom() {
    const width = root.getBoundingClientRect().width;
    return width > 0 ? width / slideW : 1;
  }

  function clamp(i) {
    return Math.max(0, Math.min(count - 1, i));
  }

  function rubber(px) {
    const min = -(count - 1) * slideW;
    if (px > 0) return px * 0.32;
    if (px < min) return min + (px - min) * 0.32;
    return px;
  }

  function render(px, animate) {
    const motion = animate && !reduce.matches;
    track.style.transition = motion ? "transform 0.52s cubic-bezier(0.22, 0.8, 0.28, 1)" : "none";
    track.style.transform = `translate3d(${px}px,0,0)`;
  }

  function paintPips(active) {
    pips.forEach((pip, n) => {
      const on = n === active;
      pip.classList.toggle("is-on", on);
      pip.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  function setIndex(i, animate) {
    index = clamp(i);
    x = -index * slideW;
    render(x, animate);
    paintPips(index);
  }

  function commit() {
    const delta = x - origin;
    let next = index;
    if (velocity <= -0.45 || delta <= -slideW * 0.18) next = index + 1;
    else if (velocity >= 0.45 || delta >= slideW * 0.18) next = index - 1;
    setIndex(next, true);
  }

  root.addEventListener("pointerdown", (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    origin = -index * slideW;
    x = origin;
    lastX = event.clientX;
    lastT = performance.now();
    velocity = 0;
    axis = null;
    dragging = false;
    if (event.pointerType === "mouse") event.preventDefault();
  });

  function lockHorizontal(pointer) {
    if (dragging) return;
    dragging = true;
    root.classList.add("is-dragging");
    track.style.transition = "none";
    if (pointer !== undefined && root.setPointerCapture) {
      try { root.setPointerCapture(pointer); } catch (err) { /* already released */ }
    }
  }

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
    }
    if (axis !== "x") return;
    lockHorizontal(event.pointerId);
    const now = performance.now();
    const dt = now - lastT;
    if (dt > 0) {
      const instant = (event.clientX - lastX) / dt / zoom();
      velocity = velocity * 0.65 + instant * 0.35;
    }
    lastX = event.clientX;
    lastT = now;
    x = rubber(origin + (event.clientX - startX) / zoom());
    render(x, false);
    paintPips(clamp(Math.round(-x / slideW)));
  });

  function end(event) {
    if (pointerId === null || event.pointerId !== pointerId) return;
    const moved = dragging;
    pointerId = null;
    dragging = false;
    axis = null;
    root.classList.remove("is-dragging");
    if (moved) commit();
  }

  root.addEventListener("pointerup", end);
  root.addEventListener("pointercancel", end);
  root.addEventListener("dragstart", (event) => event.preventDefault());
  root.addEventListener("touchmove", (event) => {
    if (pointerId === null) return;
    const touch = event.touches[0];
    if (!touch) return;
    if (!axis) {
      const dx = touch.clientX - startX;
      const dy = touch.clientY - startY;
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      axis = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      if (axis === "y") {
        pointerId = null;
        return;
      }
    }
    if (axis !== "x") return;
    event.preventDefault();
    lockHorizontal();
    const now = performance.now();
    const dt = now - lastT;
    if (dt > 0) {
      const instant = (touch.clientX - lastX) / dt / zoom();
      velocity = velocity * 0.65 + instant * 0.35;
    }
    lastX = touch.clientX;
    lastT = now;
    x = rubber(origin + (touch.clientX - startX) / zoom());
    render(x, false);
    paintPips(clamp(Math.round(-x / slideW)));
  }, { passive: false });

  if (pager) {
    pager.addEventListener("click", (event) => {
      const pip = event.target.closest(".ctx-pip");
      if (!pip) return;
      const next = pips.indexOf(pip);
      if (next >= 0) setIndex(next, true);
    });
  }

  setIndex(0, false);
}

initContextCarousel();
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
    const scale = viewport.clientWidth / designW;
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
    clipScrollports(viewport);
  }

  ui.querySelectorAll("img").forEach((img) => {
    if (!img.complete) img.addEventListener("load", relayout, { once: true });
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
  window.addEventListener("resize", relayout);
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
  const stage = document.querySelector(".stage");
  const app = document.getElementById("app");
  if (!track || !pin || !phone || shots.length !== 4 || caps.length !== 4 || !stage || !app) return;

  const sizes = [
    { w: 226.29, h: 461.46 },
    { w: 226.29, h: 461.46 },
    { w: 329.3, h: 486.26 },
    { w: 329.3, h: 486.26 },
  ];
  const blockDesign = 603;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;

  function zoomOf() {
    const n = parseFloat(getComputedStyle(stage).zoom);
    return Number.isFinite(n) && n > 0 ? n : 1;
  }

  function segmentAt(progress) {
    const segments = 3;
    const x = Math.min(segments, Math.max(0, progress * segments));
    const i = Math.min(segments - 1, Math.floor(x));
    const t = progress >= 1 ? 1 : x - i;
    return { a: i, b: Math.min(3, i + 1), t };
  }

  function hold(nodes, step, progress) {
    const index = progress >= 1 ? step.b : step.a;
    nodes.forEach((img, idx) => {
      if (idx !== index) img.style.opacity = "0";
    });
    if (nodes[index]) nodes[index].style.opacity = "1";
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
        const total = rect.height - blockV;
        progress = total > 0 ? (pinTop - rect.top) / total : 0;
      }
    }

    pin.style.left = rect.left + "px";
    pin.style.top = top + "px";
    pin.style.transform = "scale(" + zoom + ")";
    pin.classList.add("is-on");

    const shown = reduce.matches ? 0 : progress;
    const step = segmentAt(shown);
    hold(shots, step, shown);
    hold(caps, step, shown);
    const w = sizes[step.a].w + (sizes[step.b].w - sizes[step.a].w) * step.t;
    const h = sizes[step.a].h + (sizes[step.b].h - sizes[step.a].h) * step.t;
    phone.style.width = w.toFixed(2) + "px";
    phone.style.height = h.toFixed(2) + "px";
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
