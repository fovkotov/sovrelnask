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
