import * as THREE from "three";

const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;

if (!gsap || !ScrollTrigger) {
  throw new Error("GSAP ScrollTrigger is required for this scene.");
}

gsap.registerPlugin(ScrollTrigger);
if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const sceneEl = document.getElementById("brain-scene");
const progressEl = document.querySelector(".scroll-progress span");

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
});
renderer.setClearColor(0xffffff, 0);
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
renderer.setSize(sceneEl.clientWidth, sceneEl.clientHeight);
sceneEl.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  34,
  sceneEl.clientWidth / sceneEl.clientHeight,
  0.1,
  100,
);
camera.position.set(0, 0.24, 10.8);

const brainRig = new THREE.Group();
const neuralField = new THREE.Group();
brainRig.add(neuralField);
scene.add(brainRig);

const pointer = new THREE.Vector2(0, 0);
const targetPointer = new THREE.Vector2(0, 0);
const startTime = performance.now();

function seededRandom(seed) {
  let t = seed + 0x6d2b79f5;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = seededRandom(8471928);

function brainRadius(theta, phi) {
  const leftRight = Math.abs(Math.cos(theta));
  const frontalFold = Math.sin(theta * 3.2 + phi * 1.6) * 0.09;
  const temporalFold = Math.cos(theta * 5.6 - phi * 2.4) * 0.065;
  const lowerCut = Math.max(0, -Math.sin(phi));
  return 1.66 + leftRight * 0.24 + frontalFold + temporalFold - lowerCut * 0.34;
}

function createBrainSurface() {
  const count = 1450;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const base = [];

  for (let i = 0; i < count; i += 1) {
    const theta = rand() * Math.PI * 2;
    const yRand = rand() * 2 - 1;
    const phi = Math.asin(yRand) * 0.78;
    const radius = brainRadius(theta, phi);
    const bridge = Math.abs(Math.cos(theta)) < 0.08 ? 0.42 : 1;
    const x = Math.cos(theta) * Math.cos(phi) * radius * 1.42 * bridge;
    const y = Math.sin(phi) * radius * 1.03 + Math.sin(theta * 2.0) * 0.075;
    const z = Math.sin(theta) * Math.cos(phi) * radius * 0.84;
    const crease = Math.sin(theta * 11.5 + phi * 8.4) * 0.035;
    const lobe = x > 0 ? 0.04 : -0.04;

    positions[i * 3] = x + lobe + crease;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z + Math.cos(theta * 9.0) * 0.045;

    base.push(new THREE.Vector3(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]));

    const warmth = 0.62 + rand() * 0.18;
    colors[i * 3] = warmth;
    colors[i * 3 + 1] = warmth * 0.93;
    colors[i * 3 + 2] = warmth * 0.82;
    sizes[i] = 8 + rand() * 13;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    vertexColors: true,
    uniforms: {
      uTime: { value: 0 },
      uDpr: { value: renderer.getPixelRatio() },
    },
    vertexShader: `
      attribute float size;
      varying vec3 vColor;
      uniform float uTime;
      uniform float uDpr;

      void main() {
        vColor = color;
        vec3 p = position;
        float pulse = sin(uTime * 0.9 + p.x * 2.4 + p.y * 1.7) * 0.035;
        p += normalize(p) * pulse;
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = size * uDpr * (7.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;

      void main() {
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        float alpha = smoothstep(0.5, 0.18, dist);
        gl_FragColor = vec4(vColor, alpha * 0.82);
      }
    `,
  });

  const points = new THREE.Points(geometry, material);
  points.userData.base = base;
  return { points, base };
}

function createNeuralLines(basePoints) {
  const linePositions = [];
  const lineColors = [];
  const lineCount = 420;

  for (let i = 0; i < lineCount; i += 1) {
    const a = basePoints[Math.floor(rand() * basePoints.length)];
    let b = basePoints[Math.floor(rand() * basePoints.length)];
    let tries = 0;

    while ((a.distanceTo(b) > 0.82 || a.distanceTo(b) < 0.32) && tries < 20) {
      b = basePoints[Math.floor(rand() * basePoints.length)];
      tries += 1;
    }

    linePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
    const tone = 0.23 + rand() * 0.18;
    lineColors.push(tone, tone * 0.96, tone * 0.84, tone, tone * 0.96, tone * 0.84);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(lineColors, 3));

  const material = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.2,
  });

  return new THREE.LineSegments(geometry, material);
}

function createCorpusCallosum() {
  const group = new THREE.Group();
  const material = new THREE.MeshBasicMaterial({
    color: 0x1d1f22,
    transparent: true,
    opacity: 0.28,
  });

  for (let i = 0; i < 32; i += 1) {
    const t = i / 31;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.56 + t * 1.12, -0.16 + Math.sin(t * Math.PI) * 0.1, -0.15),
      new THREE.Vector3(-0.46 + t * 0.92, -0.04 + Math.sin(t * Math.PI) * 0.2, 0.08),
      new THREE.Vector3(-0.38 + t * 0.76, 0.08 + Math.sin(t * Math.PI) * 0.16, 0.24),
    ]);
    const tube = new THREE.TubeGeometry(curve, 10, 0.008 + rand() * 0.008, 6, false);
    const mesh = new THREE.Mesh(tube, material);
    mesh.rotation.z = (rand() - 0.5) * 0.4;
    group.add(mesh);
  }

  return group;
}

function createHaloRings() {
  const group = new THREE.Group();
  const material = new THREE.LineBasicMaterial({
    color: 0x101113,
    transparent: true,
    opacity: 0.12,
  });

  for (let i = 0; i < 5; i += 1) {
    const curve = new THREE.EllipseCurve(0, 0, 2.65 + i * 0.19, 1.52 + i * 0.12, 0, Math.PI * 2);
    const points = curve.getPoints(180).map((p) => new THREE.Vector3(p.x, p.y, 0));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const ring = new THREE.LineLoop(geometry, material);
    ring.rotation.x = Math.PI * 0.5 + i * 0.09;
    ring.rotation.z = i * 0.31;
    group.add(ring);
  }

  return group;
}

const surface = createBrainSurface();
const lines = createNeuralLines(surface.base);
const corpus = createCorpusCallosum();
const rings = createHaloRings();

neuralField.add(lines);
neuralField.add(surface.points);
neuralField.add(corpus);
brainRig.add(rings);

brainRig.scale.setScalar(1.04);
brainRig.rotation.set(-0.12, -0.22, 0.02);

const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
keyLight.position.set(2.2, 3.4, 5.6);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xd8cbb4, 1.2);
fillLight.position.set(-4, -2, 3);
scene.add(fillLight);

scene.add(new THREE.AmbientLight(0xffffff, 1.8));

function setupSmoothScroll() {
  if (reduceMotion) return null;

  let current = window.scrollY;
  let target = current;
  let maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  let internalScroll = false;
  let touchStartY = 0;

  function clampTarget(value) {
    maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    return Math.min(maxScroll, Math.max(0, value));
  }

  function setTarget(value) {
    target = clampTarget(value);
  }

  function onWheel(event) {
    event.preventDefault();
    setTarget(target + event.deltaY * 0.92);
  }

  function onKeydown(event) {
    const keyDistances = {
      ArrowDown: 88,
      ArrowUp: -88,
      PageDown: window.innerHeight * 0.86,
      PageUp: window.innerHeight * -0.86,
      Home: -Infinity,
      End: Infinity,
      Space: event.shiftKey ? window.innerHeight * -0.86 : window.innerHeight * 0.86,
    };

    if (!(event.key in keyDistances)) return;
    event.preventDefault();
    const distance = keyDistances[event.key];
    setTarget(distance === Infinity || distance === -Infinity ? distance : target + distance);
  }

  function onTouchStart(event) {
    touchStartY = event.touches[0]?.clientY ?? 0;
  }

  function onTouchMove(event) {
    const nextY = event.touches[0]?.clientY ?? touchStartY;
    const delta = touchStartY - nextY;
    touchStartY = nextY;
    setTarget(target + delta * 1.12);
  }

  function onNativeScroll() {
    if (internalScroll) return;
    current = window.scrollY;
    target = current;
  }

  function tick() {
    const delta = target - current;
    if (Math.abs(delta) > 0.35) {
      current += delta * 0.16;
      internalScroll = true;
      window.scrollTo(0, current);
      internalScroll = false;
    } else if (Math.abs(window.scrollY - target) > 0.5) {
      current = target;
      internalScroll = true;
      window.scrollTo(0, current);
      internalScroll = false;
    }
  }

  window.addEventListener("wheel", onWheel, { passive: false });
  window.addEventListener("keydown", onKeydown);
  window.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: true });
  window.addEventListener("scroll", onNativeScroll, { passive: true });
  window.addEventListener("resize", () => setTarget(target));
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  return {
    destroy() {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeydown);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("scroll", onNativeScroll);
      gsap.ticker.remove(tick);
    },
  };
}

const smoothScroll = setupSmoothScroll();

function splitPanelText() {
  document.querySelectorAll(".copy-panel h2, .copy-panel p, .panel-kicker").forEach((el) => {
    if (el.dataset.split === "true") return;
    const text = el.textContent;
    el.textContent = "";
    el.dataset.split = "true";

    const mask = document.createElement("span");
    mask.style.display = "block";
    mask.style.overflow = "hidden";

    const inner = document.createElement("span");
    inner.className = "reveal-line";
    inner.style.display = "block";
    inner.textContent = text;

    mask.appendChild(inner);
    el.appendChild(mask);
  });
}

splitPanelText();

const centerPanel = document.querySelector('[data-panel="center"]');
const rightPanel = document.querySelector('[data-panel="right"]');
const leftPanel = document.querySelector('[data-panel="left"]');
const specStrip = document.querySelector(".spec-strip");

gsap.set([rightPanel, leftPanel], { autoAlpha: 0 });
gsap.set(centerPanel.querySelectorAll(".reveal-line"), { yPercent: 0 });
gsap.set(specStrip, { autoAlpha: 0, y: 28 });

function buildScrollTimeline() {
  const isMobile = window.innerWidth <= 900;
  const leftX = isMobile ? -1.05 : -2.65;
  const rightX = isMobile ? 1.05 : 2.72;
  const rightLines = rightPanel.querySelectorAll(".reveal-line");
  const leftLines = leftPanel.querySelectorAll(".reveal-line");

  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    paused: true,
  });

  timeline
    .to(brainRig.position, { x: 0, y: 0, z: 0, duration: 0.12 })
    .to(brainRig.rotation, { x: -0.08, y: 0.18, z: -0.02, duration: 0.26 }, 0)
    .to(
      centerPanel,
      {
        autoAlpha: 0,
        y: -26,
        filter: "blur(8px)",
        duration: 0.12,
        ease: "power2.inOut",
      },
      0.17,
    )
    .to(brainRig.position, { x: leftX, y: 0.05, z: 0, duration: 0.35 }, 0.2)
    .to(brainRig.scale, { x: 1.72, y: 1.72, z: 1.72, duration: 0.35 }, 0.2)
    .to(brainRig.rotation, { x: -0.18, y: -0.84, z: -0.08, duration: 0.35 }, 0.2)
    .fromTo(
      rightPanel,
      { autoAlpha: 0, y: 34, filter: "blur(10px)" },
      {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.16,
        ease: "power3.out",
        immediateRender: false,
      },
      0.31,
    )
    .fromTo(
      rightLines,
      { yPercent: 112, rotate: 2.5 },
      {
        yPercent: 0,
        rotate: 0,
        duration: 0.18,
        stagger: 0.02,
        ease: "power4.out",
        immediateRender: false,
      },
      0.31,
    )
    .to(lines.material, { opacity: 0.34, duration: 0.25 }, 0.32)
    .to(rings.children.map((ring) => ring.material), { opacity: 0.18, duration: 0.25 }, 0.32)
    .to(
      rightPanel,
      {
        autoAlpha: 0,
        y: -26,
        filter: "blur(8px)",
        duration: 0.12,
        ease: "power2.inOut",
      },
      0.57,
    )
    .to(brainRig.position, { x: rightX, y: -0.02, z: 0, duration: 0.34 }, 0.61)
    .to(brainRig.scale, { x: 0.92, y: 0.92, z: 0.92, duration: 0.34 }, 0.61)
    .to(brainRig.rotation, { x: -0.03, y: 0.78, z: 0.05, duration: 0.34 }, 0.61)
    .fromTo(
      leftPanel,
      { autoAlpha: 0, y: 34, filter: "blur(10px)" },
      {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.16,
        ease: "power3.out",
        immediateRender: false,
      },
      0.68,
    )
    .fromTo(
      leftLines,
      { yPercent: 112, rotate: 2.5 },
      {
        yPercent: 0,
        rotate: 0,
        duration: 0.18,
        stagger: 0.02,
        ease: "power4.out",
        immediateRender: false,
      },
      0.68,
    )
    .fromTo(
      specStrip,
      { autoAlpha: 0, y: 28 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.17,
        ease: "power2.out",
        immediateRender: false,
      },
      0.84,
    );

  return timeline;
}

const scrollTimeline = reduceMotion ? null : buildScrollTimeline();
let storyTrigger = null;
let storyCurrentProgress = 0;
let storyTargetProgress = 0;

function clampProgress(value) {
  return Math.min(1, Math.max(0, value));
}

function readStoryProgress() {
  const story = document.querySelector(".story");
  if (!story) return 0;

  const start = story.offsetTop;
  const end = start + story.offsetHeight - window.innerHeight;
  const distance = Math.max(1, end - start);
  return clampProgress((window.scrollY - start) / distance);
}

function renderStoryProgress(progress) {
  if (!scrollTimeline) return;
  scrollTimeline.progress(progress);
  document.body.dataset.storyProgress = progress.toFixed(3);
  if (progressEl) progressEl.style.height = `${Math.round(progress * 100)}%`;
}

function syncStoryProgress() {
  storyTargetProgress = readStoryProgress();
  storyCurrentProgress += (storyTargetProgress - storyCurrentProgress) * 0.22;

  if (Math.abs(storyTargetProgress - storyCurrentProgress) < 0.001) {
    storyCurrentProgress = storyTargetProgress;
  }

  renderStoryProgress(storyCurrentProgress);
}

if (!reduceMotion) {
  storyTrigger = ScrollTrigger.create({
    trigger: ".story",
    start: "top top",
    end: "bottom bottom",
    invalidateOnRefresh: true,
    onUpdate: (self) => {
      storyTargetProgress = self.progress;
    },
  });
  gsap.ticker.add(syncStoryProgress);
  syncStoryProgress();
  ScrollTrigger.refresh();
}

if (reduceMotion) {
  brainRig.position.x = window.innerWidth <= 900 ? 0 : 2.5;
  brainRig.scale.setScalar(0.96);
  gsap.set([centerPanel, rightPanel], { autoAlpha: 0 });
  gsap.set([leftPanel, specStrip], { autoAlpha: 1, y: 0 });
}

window.addEventListener("pointermove", (event) => {
  targetPointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
  targetPointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
});

function resize() {
  const width = sceneEl.clientWidth;
  const height = sceneEl.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
  surface.points.material.uniforms.uDpr.value = renderer.getPixelRatio();
  ScrollTrigger.refresh();
}

const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(sceneEl);
window.addEventListener("resize", resize);

function animate() {
  const elapsed = (performance.now() - startTime) * 0.001;
  pointer.lerp(targetPointer, 0.06);

  surface.points.material.uniforms.uTime.value = elapsed;
  neuralField.rotation.y += 0.0022;
  neuralField.rotation.x = Math.sin(elapsed * 0.32) * 0.026 + pointer.y * 0.025;
  neuralField.rotation.z = pointer.x * 0.018;
  rings.rotation.y -= 0.0015;
  rings.rotation.z = Math.sin(elapsed * 0.18) * 0.05;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

window.addEventListener("beforeunload", () => {
  resizeObserver.disconnect();
  smoothScroll?.destroy();
  scrollTimeline?.kill();
  storyTrigger?.kill();
  gsap.ticker.remove(syncStoryProgress);
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  renderer.dispose();
});
