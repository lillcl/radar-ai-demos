const frameCount = 101;
const frame = document.querySelector(".scrub-frame");
const scrubSection = document.querySelector(".scrub-section");
const progressBar = document.querySelector(".scrub-progress span");
const popLines = Array.from(document.querySelectorAll(".pop-line"));

const frameSrc = (index) => `frames/noodle/frame_${String(index).padStart(4, "0")}.jpg`;
const preloaded = new Set();
let currentFrame = 1;
let rafId = 0;

function preloadFrame(index) {
  const safeIndex = Math.max(1, Math.min(frameCount, index));
  if (preloaded.has(safeIndex)) return;
  preloaded.add(safeIndex);
  const image = new Image();
  image.src = frameSrc(safeIndex);
}

function preloadFrames() {
  let index = 1;
  const loadChunk = () => {
    for (let count = 0; count < 8 && index <= frameCount; count += 1) {
      preloadFrame(index);
      index += 1;
    }
    if (index <= frameCount) window.setTimeout(loadChunk, 24);
  };
  loadChunk();
}

function scrubProgress() {
  const rect = scrubSection.getBoundingClientRect();
  const scrollable = Math.max(1, scrubSection.offsetHeight - window.innerHeight);
  return Math.max(0, Math.min(1, -rect.top / scrollable));
}

function updatePopCopy(progress) {
  popLines.forEach((line) => {
    const start = Number(line.dataset.start);
    const end = Number(line.dataset.end);
    line.classList.toggle("is-active", progress >= start && progress <= end);
  });
}

function renderFrame(progress) {
  const nextFrame = Math.max(1, Math.min(frameCount, Math.round(progress * (frameCount - 1)) + 1));
  if (nextFrame !== currentFrame) {
    currentFrame = nextFrame;
    frame.src = frameSrc(currentFrame);
    frame.dataset.frame = String(currentFrame);
    preloadFrame(currentFrame + 1);
    preloadFrame(currentFrame + 2);
    preloadFrame(currentFrame - 1);
  }

  progressBar.style.height = `${progress * 100}%`;
  updatePopCopy(progress);
}

function onScroll() {
  if (rafId) return;
  rafId = requestAnimationFrame(() => {
    rafId = 0;
    renderFrame(scrubProgress());
  });
}

const revealItems = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 42, 260)}ms`;
  observer.observe(item);
});

document.querySelectorAll(".magnetic").forEach((button) => {
  button.addEventListener("pointermove", (event) => {
    const rect = button.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) * 0.08;
    const y = (event.clientY - rect.top - rect.height / 2) * 0.12;
    button.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });

  button.addEventListener("pointerleave", () => {
    button.style.transform = "";
  });
});

preloadFrames();
renderFrame(0);
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
window.setInterval(() => renderFrame(scrubProgress()), 120);
