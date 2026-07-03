const cocktails = [
  { id: "golden-hour", name: "Golden Hour", zh: "金色時刻", base: "Cognac · Citrus", description: "Silken citrus, warm spice and a bright, lingering finish.", tags: ["velvet", "lemon", "spiced"], strength: 3, sweetness: 2, layer: "./assets/cocktails/01-golden-hour.png" },
  { id: "ruby-fizz", name: "Ruby Fizz", zh: "紅寶石氣泡", base: "Vodka · Wild berry", description: "Crushed berries, cooling mint and a dry snap of soda.", tags: ["berry", "mint", "bright"], strength: 2, sweetness: 3, layer: "./assets/cocktails/02-ruby-fizz.png" },
  { id: "olive-theory", name: "Olive Theory", zh: "橄欖定理", base: "London dry gin · Vermouth", description: "Bone-dry, mineral and cold enough to sharpen the room.", tags: ["dry", "briny", "clean"], strength: 5, sweetness: 1, layer: "./assets/cocktails/03-olive-theory.png" },
  { id: "brass-tacks", name: "Brass Tacks", zh: "黃銅本色", base: "Bourbon · Bitters", description: "Oak, burnt orange and brown sugar over one patient cube.", tags: ["oak", "orange", "smoked"], strength: 5, sweetness: 2, layer: "./assets/cocktails/04-brass-tacks.png" },
  { id: "violet-hour", name: "Violet Hour", zh: "紫羅蘭時刻", base: "Botanical gin · Lavender", description: "A floral, electric cooler softened with citrus and tonic.", tags: ["floral", "citrus", "tonic"], strength: 3, sweetness: 2, layer: "./assets/cocktails/05-violet-hour.png" },
  { id: "sun-room", name: "Sun Room", zh: "日光房", base: "Aged rum · Pineapple", description: "Golden tropical fruit, toasted coconut and a whisper of sea salt.", tags: ["tropical", "creamy", "salt"], strength: 3, sweetness: 4, layer: "./assets/cocktails/06-sun-room.png" },
  { id: "night-shift", name: "Night Shift", zh: "夜班", base: "Vodka · Espresso", description: "Dark roast, cacao and a clean spirit edge built for late hours.", tags: ["coffee", "cacao", "bold"], strength: 4, sweetness: 2, layer: "./assets/cocktails/07-night-shift.png" },
  { id: "garden-after-rain", name: "Garden After Rain", zh: "雨後花園", base: "Gin · Cucumber", description: "Cucumber, mint and green citrus in a tall, rain-cold pour.", tags: ["green", "cool", "crisp"], strength: 2, sweetness: 1, layer: "./assets/cocktails/08-garden-after-rain.png" },
  { id: "last-light", name: "Last Light", zh: "最後一束光", base: "Aperitivo · Sparkling wine", description: "Bittersweet orange, bubbles and sunset-colored restraint.", tags: ["orange", "bitter", "sparkling"], strength: 2, sweetness: 3, layer: "./assets/cocktails/09-last-light.png" },
  { id: "red-letter", name: "Red Letter", zh: "紅字", base: "Rye whisky · Cherry", description: "Black cherry, rye spice and tart citrus with a midnight-red finish.", tags: ["cherry", "tart", "spice"], strength: 4, sweetness: 3, layer: "./assets/cocktails/10-red-letter.png" }
];

const scene = document.querySelector("#cocktail-scene");
const sceneImage = scene.querySelector(".scene-image");
const sceneGlow = scene.querySelector(".scene-glow");
const hotspots = [...document.querySelectorAll(".cocktail")];
const lineup = document.querySelector("#lineup-buttons");
const card = document.querySelector("#detail-card");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const canAnimate = Boolean(window.gsap) && !reducedMotion;
const ui = {
  index: document.querySelector("#detail-index"),
  base: document.querySelector("#detail-base"),
  name: document.querySelector("#detail-name"),
  zh: document.querySelector("#detail-zh"),
  description: document.querySelector("#detail-description"),
  tags: document.querySelector("#detail-tags"),
  strength: document.querySelector("#strength-meter"),
  sweetness: document.querySelector("#sweetness-meter")
};

let activeId = null;
let glowX;
let glowY;
let glowOpacity;

if (canAnimate) {
  glowX = gsap.quickTo(sceneGlow, "x", { duration: .22, ease: "power2.out" });
  glowY = gsap.quickTo(sceneGlow, "y", { duration: .22, ease: "power2.out" });
  glowOpacity = gsap.quickTo(sceneGlow, "opacity", { duration: .2, ease: "power2.out" });
}

hotspots.forEach((hotspot) => {
  const cocktail = cocktails.find((item) => item.id === hotspot.dataset.id);
  const layer = document.createElement("img");
  layer.className = "cocktail-layer";
  layer.src = cocktail.layer;
  layer.alt = "";
  layer.setAttribute("aria-hidden", "true");
  hotspot.appendChild(layer);
  hotspot.addEventListener("mouseenter", () => selectCocktail(cocktail.id));
  hotspot.addEventListener("focus", () => selectCocktail(cocktail.id));
  hotspot.addEventListener("click", () => selectCocktail(cocktail.id, true));
});

cocktails.forEach((cocktail, index) => {
  const button = document.createElement("button");
  button.className = "lineup-button";
  button.type = "button";
  button.textContent = String(index + 1).padStart(2, "0");
  button.dataset.id = cocktail.id;
  button.setAttribute("aria-label", `Select ${cocktail.name}`);
  button.addEventListener("mouseenter", () => selectCocktail(cocktail.id));
  button.addEventListener("focus", () => selectCocktail(cocktail.id));
  button.addEventListener("click", () => selectCocktail(cocktail.id, true));
  lineup.appendChild(button);
});

scene.addEventListener("pointermove", (event) => {
  if (!canAnimate) return;
  const bounds = scene.getBoundingClientRect();
  const x = event.clientX - bounds.left;
  const y = event.clientY - bounds.top;
  glowX(x);
  glowY(y);
  glowOpacity(activeId ? .8 : .36);
});

scene.addEventListener("mouseleave", () => {
  if (canAnimate) glowOpacity(0);
  if (!scene.contains(document.activeElement)) clearSelection();
});

scene.addEventListener("focusout", (event) => {
  if (!scene.contains(event.relatedTarget)) clearSelection();
});

function selectCocktail(id, shouldCenter = false) {
  const cocktail = cocktails.find((item) => item.id === id);
  const hotspot = hotspots.find((item) => item.dataset.id === id);
  if (!cocktail || !hotspot) return;
  if (activeId === id) return;

  const previous = hotspots.find((item) => item.dataset.id === activeId);
  const previousLayer = previous?.querySelector(".cocktail-layer");
  const activeLayer = hotspot.querySelector(".cocktail-layer");
  const isFirstSelection = !activeId;
  activeId = id;
  scene.dataset.active = "true";
  hotspots.forEach((item) => item.classList.toggle("is-active", item === hotspot));
  document.querySelectorAll(".lineup-button").forEach((item) => {
    const isActive = item.dataset.id === id;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });

  updateDetails(cocktail);

  if (canAnimate) {
    if (previousLayer) {
      gsap.to(previousLayer, { autoAlpha: 0, y: 0, scale: 1, duration: .16, ease: "power2.out", overwrite: true });
    }
    if (isFirstSelection) {
      gsap.to(sceneImage, { filter: "saturate(.58) contrast(1.08) brightness(.42)", duration: .32, ease: "power2.out", overwrite: true });
    }
    gsap.fromTo(activeLayer,
      { autoAlpha: .35, y: 3, scale: .995, filter: "brightness(1.06) saturate(1)" },
      { autoAlpha: 1, y: -15, scale: 1.05, filter: "brightness(1.2) saturate(1.12) drop-shadow(0 16px 16px rgba(216,174,104,.25))", duration: .3, ease: "power3.out", overwrite: true }
    );
    const detailParts = document.querySelectorAll(".detail-copy > *, .detail-meters");
    gsap.killTweensOf([card, ...detailParts]);
    if (isFirstSelection) {
      gsap.set(card, { visibility: "visible" });
      gsap.fromTo(card,
        { autoAlpha: 0, y: 10, scale: .99 },
        { autoAlpha: 1, y: 0, scale: 1, duration: .24, ease: "power2.out", overwrite: true }
      );
    } else {
      gsap.set(card, { autoAlpha: 1, y: 0, scale: 1, visibility: "visible" });
    }
    gsap.fromTo(detailParts, { y: 5, opacity: .25 }, { y: 0, opacity: 1, duration: .18, stagger: .012, ease: "power2.out", overwrite: true });
  } else {
    sceneImage.style.filter = "saturate(.58) contrast(1.08) brightness(.42)";
    activeLayer.style.opacity = "1";
    activeLayer.style.transform = "translateY(-12px) scale(1.04)";
    card.style.opacity = "1";
    card.style.visibility = "visible";
  }

  if (shouldCenter && window.innerWidth <= 820) {
    hotspot.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", inline: "center", block: "nearest" });
  }
}

function clearSelection() {
  const previous = hotspots.find((item) => item.dataset.id === activeId);
  const previousLayer = previous?.querySelector(".cocktail-layer");
  activeId = null;
  delete scene.dataset.active;
  hotspots.forEach((item) => item.classList.remove("is-active"));
  document.querySelectorAll(".lineup-button").forEach((item) => {
    item.classList.remove("is-active");
    item.setAttribute("aria-pressed", "false");
  });

  if (canAnimate) {
    gsap.to(sceneImage, { filter: "saturate(.92) contrast(1.05) brightness(.88)", duration: .45, ease: "power2.out", overwrite: true });
    if (previousLayer) gsap.to(previousLayer, { autoAlpha: 0, y: 0, scale: 1, duration: .2, ease: "power2.out", overwrite: true });
    gsap.to(card, { autoAlpha: 0, y: 12, duration: .24, ease: "power2.in", overwrite: true, onComplete: () => gsap.set(card, { visibility: "hidden" }) });
  } else {
    sceneImage.style.filter = "";
    hotspots.forEach((item) => {
      const layer = item.querySelector(".cocktail-layer");
      layer.style.opacity = "";
      layer.style.transform = "";
    });
    card.style.opacity = "";
    card.style.visibility = "";
  }
}

function updateDetails(cocktail) {
  const index = cocktails.indexOf(cocktail) + 1;
  ui.index.textContent = String(index).padStart(2, "0");
  ui.base.textContent = cocktail.base;
  ui.name.textContent = cocktail.name;
  ui.zh.textContent = cocktail.zh;
  ui.description.textContent = cocktail.description;
  ui.tags.replaceChildren(...cocktail.tags.map(makeTag));
  renderMeter(ui.strength, cocktail.strength, "Strength");
  renderMeter(ui.sweetness, cocktail.sweetness, "Sweetness");
}

function makeTag(text) {
  const span = document.createElement("span");
  span.className = "tag";
  span.textContent = text;
  return span;
}

function renderMeter(element, value, label) {
  element.replaceChildren();
  element.setAttribute("aria-label", `${label} ${value} out of 5`);
  for (let index = 1; index <= 5; index += 1) {
    const segment = document.createElement("i");
    segment.classList.toggle("is-filled", index <= value);
    element.appendChild(segment);
  }
}

function runIntro() {
  if (!canAnimate) return;
  gsap.set([".topbar", ".intro > *", ".lineup"], { visibility: "visible" });
  gsap.timeline({ defaults: { ease: "power3.out" } })
    .from(".topbar", { y: -70, duration: .7 })
    .from(".scene", { clipPath: "inset(0 50% 0 50%)", duration: 1.15, ease: "power4.inOut" }, "-=.35")
    .from(".scene-image", { scale: 1.035, duration: 1.3, ease: "power2.out" }, "-=1")
    .from(".eyebrow", { y: 14, opacity: 0, duration: .45 }, "-=.72")
    .from("h1 span, h1 em", { y: 38, opacity: 0, duration: .72, stagger: .1 }, "-=.52")
    .from(".instruction", { x: -12, opacity: 0, duration: .42 }, "-=.34")
    .from(".lineup", { y: 62, duration: .62 }, "-=.46")
    .from(".lineup-button", { opacity: 0, y: 8, duration: .3, stagger: .035 }, "-=.25");

  gsap.to(".cursor-glyph", { scale: 1.12, opacity: .55, duration: 1.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
}

window.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
  event.preventDefault();
  const currentIndex = Math.max(0, cocktails.findIndex((item) => item.id === activeId));
  const direction = event.key === "ArrowRight" ? 1 : -1;
  const nextIndex = (currentIndex + direction + cocktails.length) % cocktails.length;
  selectCocktail(cocktails[nextIndex].id, true);
  hotspots[nextIndex].focus({ preventScroll: true });
});

runIntro();
