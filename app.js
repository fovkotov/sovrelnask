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
