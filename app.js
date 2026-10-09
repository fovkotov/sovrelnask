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

function initLabWheel() {
  const wheels = [...document.querySelectorAll(".lab-wheel")];
  const track = document.querySelector(".lab-wheel[data-lab-track]");
  if (!wheels.length || !track) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const parts = wheels.map((el) => ({ el, base: el.style.transform.trim() }));
  const turn = 90;
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
