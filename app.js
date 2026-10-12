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
  const cards = [...track.children];
  const count = cards.length;
  if (!count) return;
  const slideW = 292.364;
  const threshold = slideW * 0.35;
  const autoplayMs = 5000;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const bars = pips.map((pip) => {
    const bar = document.createElement("span");
    bar.className = "ctx-pip-bar";
    bar.setAttribute("aria-hidden", "true");
    pip.appendChild(bar);
    return bar;
  });

  let index = 0;
  let pointerId = null;
  let startX = 0;
  let startY = 0;
  let axis = null;
  let dragging = false;
  let animating = false;
  let dragX = 0;
  let springToken = 0;
  let progress = 0;
  let remaining = autoplayMs;
  let playing = false;
  let inView = false;
  let pausedByDrag = false;
  let playRaf = 0;
  let lastTs = 0;
  const posed = cards.map(() => ({ tx: 0, rot: 0, scale: 1 }));

  function zoom() {
    const width = root.getBoundingClientRect().width;
    return width > 0 ? width / slideW : 1;
  }

  function pose(position, offset) {
    const scale = position === 0 ? 1 : Math.max(0.82, 1 - position * 0.075);
    const rotateAbs = position === 0 ? 0 : Math.max(0, 6 - (position - 1));
    let rot = position === 0 ? 0 : (position % 2 === 1 ? -rotateAbs : rotateAbs);
    const tx = position === 0 ? offset : 0;
    if (offset !== 0) {
      const normalized = Math.max(-1, Math.min(1, offset / (slideW / 2)));
      const rotateFactor = Math.max(0, 1 - position * 0.3);
      rot += normalized * 12 * rotateFactor;
    }
    return { tx, rot, scale, z: Math.max(1, 100 - position) };
  }

  function place(position, offset) {
    const cardIndex = (index + position) % count;
    const next = pose(position, offset);
    posed[cardIndex] = { tx: next.tx, rot: next.rot, scale: next.scale };
    const card = cards[cardIndex];
    card.style.zIndex = String(next.z);
    card.style.transform = `translate3d(${next.tx.toFixed(3)}px,0,0) rotate(${next.rot.toFixed(3)}deg) scale(${next.scale.toFixed(4)})`;
  }

  function layout(offset) {
    for (let position = 0; position < count; position += 1) place(position, offset);
  }

  function stepSpring(value, velocity, target, dt) {
    const accel = -420 * (value - target) - 20 * velocity;
    const nextVelocity = velocity + accel * dt;
    return [value + nextVelocity * dt, nextVelocity];
  }

  function springToRest() {
    const token = ++springToken;
    if (reduce.matches) {
      animating = false;
      layout(0);
      return;
    }
    animating = true;
    const velocity = cards.map(() => ({ tx: 0, rot: 0, scale: 0 }));
    let prev = 0;
    const frame = (now) => {
      if (token !== springToken) return;
      const dt = Math.min(0.032, prev ? (now - prev) / 1000 : 0.016);
      prev = now;
      let done = true;
      for (let cardIndex = 0; cardIndex < count; cardIndex += 1) {
        const position = (cardIndex - index + count) % count;
        const target = pose(position, 0);
        const state = posed[cardIndex];
        const speed = velocity[cardIndex];
        [state.tx, speed.tx] = stepSpring(state.tx, speed.tx, target.tx, dt);
        [state.rot, speed.rot] = stepSpring(state.rot, speed.rot, target.rot, dt);
        [state.scale, speed.scale] = stepSpring(state.scale, speed.scale, target.scale, dt);
        const card = cards[cardIndex];
        card.style.zIndex = String(target.z);
        card.style.transform = `translate3d(${state.tx.toFixed(3)}px,0,0) rotate(${state.rot.toFixed(3)}deg) scale(${state.scale.toFixed(4)})`;
        if (Math.abs(state.tx - target.tx) > 0.4 || Math.abs(speed.tx) > 8) done = false;
        if (Math.abs(state.rot - target.rot) > 0.05 || Math.abs(speed.rot) > 2) done = false;
        if (Math.abs(state.scale - target.scale) > 0.001 || Math.abs(speed.scale) > 0.02) done = false;
      }
      if (!done) {
        requestAnimationFrame(frame);
        return;
      }
      animating = false;
      layout(0);
    };
    requestAnimationFrame(frame);
  }

  function paintPips() {
    pips.forEach((pip, n) => {
      const on = n === index;
      pip.classList.toggle("is-on", on);
      pip.setAttribute("aria-selected", on ? "true" : "false");
    });
  }

  function paintBars() {
    bars.forEach((bar, n) => {
      const scaleX = n < index ? 1 : n === index ? progress : 0;
      bar.style.transform = `scaleX(${scaleX})`;
    });
  }

  function stopPlay() {
    playing = false;
    lastTs = 0;
    if (playRaf) cancelAnimationFrame(playRaf);
    playRaf = 0;
  }

  function playFrame(now) {
    if (!playing) return;
    const dt = lastTs ? now - lastTs : 0;
    lastTs = now;
    remaining = Math.max(0, remaining - dt);
    progress = 1 - remaining / autoplayMs;
    paintBars();
    if (remaining <= 0) {
      index = (index + 1) % count;
      remaining = autoplayMs;
      progress = 0;
      paintPips();
      paintBars();
      springToRest();
    }
    playRaf = requestAnimationFrame(playFrame);
  }

  function startPlay() {
    if (playing || reduce.matches || !inView || pausedByDrag) return;
    playing = true;
    lastTs = 0;
    playRaf = requestAnimationFrame(playFrame);
  }

  function restartAutoplay() {
    remaining = autoplayMs;
    progress = reduce.matches ? 1 : 0;
    pausedByDrag = false;
    paintBars();
    stopPlay();
    startPlay();
  }

  function enterView() {
    if (inView) return;
    inView = true;
    remaining = autoplayMs;
    progress = reduce.matches ? 1 : 0;
    pausedByDrag = false;
    paintPips();
    paintBars();
    startPlay();
  }

  function leaveView() {
    if (!inView) return;
    inView = false;
    pausedByDrag = false;
    remaining = autoplayMs;
    progress = reduce.matches ? 1 : 0;
    stopPlay();
    paintBars();
  }

  const view = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting && entry.intersectionRatio >= 0.2) enterView();
    else leaveView();
  }, { threshold: [0, 0.2] });
  view.observe(root);

  root.addEventListener("pointerdown", (event) => {
    if (animating || dragging) return;
    if (event.button !== undefined && event.button !== 0) return;
    const front = cards[index];
    if (!front.contains(event.target) && event.target !== front) return;
    pointerId = event.pointerId;
    startX = event.clientX;
    startY = event.clientY;
    axis = null;
    dragX = 0;
    pausedByDrag = true;
    stopPlay();
    if (event.pointerType === "mouse") event.preventDefault();
  });

  function lockHorizontal(pointer) {
    if (dragging) return;
    dragging = true;
    pausedByDrag = true;
    stopPlay();
    root.classList.add("is-dragging");
    cards[index].classList.add("is-dragging");
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
        pausedByDrag = false;
        startPlay();
        return;
      }
    }
    if (axis !== "x") return;
    lockHorizontal(event.pointerId);
    dragX = dx / zoom();
    layout(dragX);
  });

  function finish(commit) {
    root.classList.remove("is-dragging");
    cards.forEach((card) => card.classList.remove("is-dragging"));
    if (commit && (dragX > threshold || dragX < -threshold)) {
      index = (index + 1) % count;
      paintPips();
      restartAutoplay();
    } else {
      pausedByDrag = false;
      startPlay();
    }
    springToRest();
  }

  function end(event) {
    if (pointerId === null || event.pointerId !== pointerId) return;
    const moved = dragging;
    pointerId = null;
    dragging = false;
    axis = null;
    if (moved) finish(true);
    else {
      pausedByDrag = false;
      startPlay();
    }
  }

  window.addEventListener("pointerup", end);
  window.addEventListener("pointercancel", end);
  root.addEventListener("dragstart", (event) => event.preventDefault());
  root.addEventListener("touchmove", (event) => {
    if (axis !== "x") return;
    event.preventDefault();
  }, { passive: false });

  if (pager) {
    pager.addEventListener("click", (event) => {
      const pip = event.target.closest(".ctx-pip");
      if (!pip || dragging) return;
      const next = pips.indexOf(pip);
      if (next < 0 || next === index) return;
      index = next;
      paintPips();
      restartAutoplay();
      springToRest();
    });
  }

  reduce.addEventListener("change", () => {
    if (reduce.matches) {
      stopPlay();
      progress = 1;
      paintBars();
      layout(0);
      return;
    }
    progress = 0;
    remaining = autoplayMs;
    paintBars();
    startPlay();
  });

  layout(0);
  paintPips();
  paintBars();
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
