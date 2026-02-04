const CONFIG = {
  startDate: "2025-03-23",
  note: 'Искам да знаеш че ти си всичко за което някога съм мечтал, допълваш ме истински. Имам само едно опредление за теб когато ме попитат хората каква си и то е - Прекрасна❤️. (или пират, но нека не задълбаваме 🤣)',
  slides: ["photos/1.jpg","photos/2.jpg","photos/3.jpg","photos/4.jpg"],
  slideMs: 3000
};

// Days counter
function daysSince(dateStr) {
  const start = new Date(dateStr + "T00:00:00");
  const now = new Date();
  const ms = now - start;
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}
document.getElementById("daysCount").textContent = String(daysSince(CONFIG.startDate));

// Music toggle (browser requires user interaction)
const musicBtn = document.getElementById("musicBtn");
const bgm = document.getElementById("bgm");
musicBtn.addEventListener("click", async () => {
  const isOn = musicBtn.getAttribute("aria-pressed") === "true";
  if (isOn) {
    bgm.pause();
    musicBtn.setAttribute("aria-pressed", "false");
    musicBtn.textContent = "Музика: Изкл.";
  } else {
    try { await bgm.play(); } catch {}
    musicBtn.setAttribute("aria-pressed", "true");
    musicBtn.textContent = "Музика: Вкл.";
  }
});

// Sections
const slideshow = document.getElementById("slideshow");
const noteSec   = document.getElementById("note");
const surprise  = document.getElementById("surprise");

// Typewriter
const typewriter = document.getElementById("typewriter");
function runTypewriter(text) {
  typewriter.textContent = "";
  let i = 0;
  const speed = 18;
  const tick = () => {
    typewriter.textContent = text.slice(0, i);
    i++;
    if (i <= text.length) requestAnimationFrame(() => setTimeout(tick, speed));
  };
  tick();
}

// Slideshow
const slideImg = document.getElementById("slideImg");
const dotsWrap = document.getElementById("dots");
const prevBtn  = document.getElementById("prevBtn");
const nextBtn  = document.getElementById("nextBtn");

let slideIndex = 0;
let slideTimer = null;

function renderDots() {
  dotsWrap.innerHTML = "";
  CONFIG.slides.forEach((_, i) => {
    const d = document.createElement("div");
    d.className = "dot" + (i === slideIndex ? " on" : "");
    dotsWrap.appendChild(d);
  });
}

function showSlide(i) {
  slideIndex = Math.max(0, Math.min(CONFIG.slides.length - 1, i));
  renderDots();

  slideImg.classList.add("fade");
  setTimeout(() => {
    slideImg.src = CONFIG.slides[slideIndex];
    slideImg.onload = () => slideImg.classList.remove("fade");
  }, 220);
}

function stopAuto() {
  if (slideTimer) {
    clearInterval(slideTimer);
    slideTimer = null;
  }
}

function startAuto() {
  stopAuto();
  slideTimer = setInterval(() => {
    if (slideIndex < CONFIG.slides.length - 1) {
      showSlide(slideIndex + 1);
    } else {
      stopAuto();
      setTimeout(() => {
        noteSec.classList.remove("hidden");
        noteSec.scrollIntoView({ behavior: "smooth", block: "start" });
        runTypewriter(CONFIG.note);
      }, 700);
    }
  }, CONFIG.slideMs);
}

function startSlideshow() {
  slideshow.classList.remove("hidden");
  slideshow.scrollIntoView({ behavior: "smooth", block: "start" });
  slideIndex = 0;
  slideImg.src = CONFIG.slides[0];
  renderDots();
  startAuto();
}

function manualNav(fn) {
  fn();
  startAuto(); // restart timer after manual
}

// Wire controls
if (prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => manualNav(() => showSlide(slideIndex - 1)));
  nextBtn.addEventListener("click", () => manualNav(() => showSlide(slideIndex + 1)));
}
document.addEventListener("keydown", (e) => {
  if (slideshow.classList.contains("hidden")) return;
  if (e.key === "ArrowLeft") manualNav(() => showSlide(slideIndex - 1));
  if (e.key === "ArrowRight") manualNav(() => showSlide(slideIndex + 1));
});

// Start button: start slideshow + try start music
document.getElementById("startBtn").addEventListener("click", async () => {
  try {
    await bgm.play();
    musicBtn.setAttribute("aria-pressed", "true");
    musicBtn.textContent = "Музика: Вкл.";
  } catch {}
  startSlideshow();
});

// Open button: show yes/no section
document.getElementById("openBtn").addEventListener("click", () => {
  surprise.classList.remove("hidden");
  surprise.scrollIntoView({ behavior: "smooth", block: "start" });
});

// YES/NO + overlay
const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");
const yesMsg = document.getElementById("yesMsg");
const noMsg  = document.getElementById("noMsg");
const noOverlay = document.getElementById("noOverlay");

let confettiInterval = null;

yesBtn.addEventListener("click", () => {
  if (yesMsg) yesMsg.classList.remove("hidden");
  if (noMsg)  noMsg.classList.add("hidden");

  if (!confettiInterval) {
    confettiBurst();
    confettiInterval = setInterval(confettiBurst, 700);
  }
});

noBtn.addEventListener("click", () => {
  if (noOverlay) {
    noOverlay.classList.remove("hidden");
    setTimeout(() => noOverlay.classList.add("hidden"), 4000);
  } else {
    // fallback
    if (noMsg) noMsg.classList.remove("hidden");
  }
});

// Confetti (no libs)
function confettiBurst() {
  const count = 120;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.style.position = "fixed";
    p.style.left = Math.random() * 100 + "vw";
    p.style.top = "-10px";
    p.style.width = "8px";
    p.style.height = "12px";
    p.style.borderRadius = "2px";
    p.style.background = `hsl(${Math.random() * 360}, 90%, 70%)`;
    p.style.zIndex = 9999;
    p.style.opacity = 0.95;

    const fall = 2400 + Math.random() * 1400;
    const drift = (Math.random() * 2 - 1) * 180;

    p.animate([
      { transform: "translate(0,0) rotate(0deg)" },
      { transform: `translate(${drift}px, 110vh) rotate(${Math.random() * 720}deg)` }
    ], { duration: fall, easing: "cubic-bezier(.2,.6,.2,1)" });

    document.body.appendChild(p);
    setTimeout(() => p.remove(), fall + 100);
  }
}
