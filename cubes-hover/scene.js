import * as THREE from "three";

// ─── PALETTE ──────────────────────────────────────────────────────────────────
const PALETTE = {
  deepBackground: 0x1c2420,
  shadowLayer: 0x2d3733,
  ambientMist: 0x4d5d57,
  cyanCore: 0xa6dbdc,
  cyanSecondary: 0x89bcbd,
  whiteHighlight: 0xf8fcfc,
  neonGreen: 0x23e85f,
  acidGreen: 0x4cff6a,
  greenReflection: 0x71c980,
};

// ─── PARAMS ───────────────────────────────────────────────────────────────────
const params = {
  gridSize: 1.0, // 1 world unit per grid cell
  gridHalfX: 12,
  gridHalfZ: 8,
  maxCubesDesktop: 120,
  maxCubesMobile: 60,
  birthDuration: 520,
  birthOvershoot: 0.12, // amplitude of birth bounce
  decayDuration: 900,
  decayShrink: 0.95, // size multiplier applied to a cube while decaying
  decayTriggerMs: 240, // grace period before pointer-leave decay kicks in
  idleLifetimeMs: 2400, // how long a cube lives before auto-decay
  spawnMin: 3,
  spawnMax: 7,
  spawnInterval: 90, // ms between spawn ticks
  spawnSampleStride: 3, // sample pointer every N frames
  hoverRadius: 7.0, // world units
  hoverHeightBoost: 0.9,
  idleAmplitude: 0.08,
  baseCubeSize: 0.62,
  pointerNudge: 0.55,
  pointerNudgeLerp: 4.0,
  faceBrightnessBase: 0.55,
  faceBrightnessHoverGain: 0.9,
  edgeBrightnessBase: 0.7,
  edgeBrightnessHoverGain: 1.1,
  rotationDamping: 0.985, // multiplicative damp on rotSpeed per frame
  idleSwayX: 0.4, // time scale for X-axis idle sway
  idleSwayZ: 0.3, // time scale for Z-axis idle sway
  idleSwayAmp: 0.04, // radians of X/Z idle sway
  idleSpin: 0.2, // Y-axis spin rate
};

const isMobile =
  /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
  window.matchMedia("(max-width: 700px)").matches;
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const MAX_CUBES = isMobile ? params.maxCubesMobile : params.maxCubesDesktop;
const SPAWN_INTERVAL = prefersReducedMotion ? 9999 : params.spawnInterval;
const SPAWN_STRIDE = prefersReducedMotion ? 60 : params.spawnSampleStride;

// ─── SETUP ────────────────────────────────────────────────────────────────────
const canvas = document.getElementById("scene-canvas");
const scene = new THREE.Scene();
scene.background = null;
scene.fog = new THREE.Fog(PALETTE.deepBackground, 14, 38);

const camera = new THREE.PerspectiveCamera(
  32,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
// Camera shifted slightly left so the cube field reads as center/right of
// the viewport (asymmetric layout: copy is lower-left, scene is center/right).
camera.position.set(-2.4, 9.5, 14);
camera.lookAt(1.6, 0.4, 0);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

// ─── LIGHTING ─────────────────────────────────────────────────────────────────
scene.add(new THREE.AmbientLight(PALETTE.ambientMist, 0.55));

const dirLight = new THREE.DirectionalLight(PALETTE.cyanCore, 1.2);
dirLight.position.set(6, 10, 8);
scene.add(dirLight);

const rimLight = new THREE.DirectionalLight(PALETTE.neonGreen, 0.55);
rimLight.position.set(-8, 4, -6);
scene.add(rimLight);

const fillLight = new THREE.DirectionalLight(PALETTE.cyanSecondary, 0.35);
fillLight.position.set(-4, 2, 6);
scene.add(fillLight);

// ─── PARTICLES (floor scan dots) ──────────────────────────────────────────────
function buildParticles() {
  const count = isMobile ? 220 : 520;
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const phases = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 36;
    positions[i * 3 + 1] = -0.4 - Math.random() * 0.6;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 22 - 1;
    sizes[i] = 0.02 + Math.random() * 0.05;
    phases[i] = Math.random() * Math.PI * 2;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
  geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));

  const mat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color(PALETTE.cyanCore) },
      uColorB: { value: new THREE.Color(PALETTE.neonGreen) },
    },
    vertexShader: /* glsl */ `
      attribute float aSize;
      attribute float aPhase;
      uniform float uTime;
      varying float vAlpha;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float pulse = 0.5 + 0.5 * sin(uTime * 1.6 + aPhase);
        vAlpha = 0.25 + pulse * 0.6;
        gl_PointSize = aSize * (300.0 / -mv.z) * (0.6 + pulse * 0.6);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      varying float vAlpha;
      void main() {
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c);
        if (d > 0.5) discard;
        float falloff = smoothstep(0.5, 0.0, d);
        vec3 col = mix(uColorA, uColorB, smoothstep(0.0, 1.0, vAlpha));
        gl_FragColor = vec4(col, falloff * vAlpha);
      }
    `,
  });

  return new THREE.Points(geo, mat);
}

const particles = buildParticles();
scene.add(particles);

// ─── CUBE MESHES ──────────────────────────────────────────────────────────────
// Faces: InstancedMesh of box geometry, per-instance color via setColorAt.
const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const faceMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.42,
  metalness: 0.25,
  flatShading: true,
});
const faceMesh = new THREE.InstancedMesh(boxGeo, faceMaterial, MAX_CUBES);
faceMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
faceMesh.count = MAX_CUBES;
faceMesh.frustumCulled = false;
scene.add(faceMesh);

// Initialize per-instance color buffer (all black, will be overwritten).
const initColor = new THREE.Color(0, 0, 0);
for (let i = 0; i < MAX_CUBES; i++) faceMesh.setColorAt(i, initColor);
faceMesh.instanceColor.setUsage(THREE.DynamicDrawUsage);

// Edges: a single LineSegments. We allocate MAX_CUBES * 24 vertices (each
// cube has 12 edges = 24 vertices). We update positions and colors per frame
// on the CPU. The base local edge positions come from EdgesGeometry.
const edgesSrcGeo = new THREE.EdgesGeometry(boxGeo);
const edgeLocalPositions = edgesSrcGeo.attributes.position.array; // Float32Array
const VERTS_PER_CUBE = edgeLocalPositions.length / 3; // 24

const edgePositions = new Float32Array(MAX_CUBES * VERTS_PER_CUBE * 3);
const edgeColors = new Float32Array(MAX_CUBES * VERTS_PER_CUBE * 3);
const edgeGeo = new THREE.BufferGeometry();
edgeGeo.setAttribute(
  "position",
  new THREE.BufferAttribute(edgePositions, 3).setUsage(THREE.DynamicDrawUsage),
);
edgeGeo.setAttribute(
  "color",
  new THREE.BufferAttribute(edgeColors, 3).setUsage(THREE.DynamicDrawUsage),
);
// Each cube contributes 24 vertices but is drawn as 12 line segments.
// We use LineSegments with a draw range that we update.
const edgeMaterial = new THREE.LineBasicMaterial({
  vertexColors: true,
  transparent: true,
  opacity: 0.95,
});
const edgeLines = new THREE.LineSegments(edgeGeo, edgeMaterial);
edgeLines.frustumCulled = false;
scene.add(edgeLines);
edgesSrcGeo.dispose();

// ─── CUBE DATA ────────────────────────────────────────────────────────────────
const cubeData = new Array(MAX_CUBES);
const cellOccupancy = new Map();

function makeCubeData(i) {
  return {
    index: i,
    active: false,
    decaying: false,
    age: 0,
    decayStart: 0,
    baseX: 0,
    baseY: 0,
    baseZ: 0,
    gridX: 0,
    gridZ: 0,
    size: params.baseCubeSize,
    phase: 0,
    rotSpeed: 0,
    color: new THREE.Color(),
    edgeColor: new THREE.Color(),
    scale: 0,
  };
}
for (let i = 0; i < MAX_CUBES; i++) cubeData[i] = makeCubeData(i);

const colorChoices = [
  new THREE.Color(PALETTE.shadowLayer),
  new THREE.Color(PALETTE.deepBackground),
  new THREE.Color(PALETTE.ambientMist),
  new THREE.Color(PALETTE.cyanCore),
  new THREE.Color(PALETTE.cyanSecondary),
  new THREE.Color(PALETTE.greenReflection),
];
const edgeColorChoices = [
  new THREE.Color(PALETTE.cyanCore),
  new THREE.Color(PALETTE.cyanSecondary),
  new THREE.Color(PALETTE.neonGreen),
  new THREE.Color(PALETTE.acidGreen),
  new THREE.Color(PALETTE.whiteHighlight),
];
const tmpWhite = new THREE.Color(PALETTE.whiteHighlight);
const tmpNeon = new THREE.Color(PALETTE.neonGreen);
const tmpBg = new THREE.Color(PALETTE.deepBackground);

// ─── POINTER ──────────────────────────────────────────────────────────────────
const pointer = {
  ndc: new THREE.Vector2(0, 0),
  has: false,
  world: new THREE.Vector3(0, 0, 0),
  targetWorld: new THREE.Vector3(0, 0, 0),
  raycaster: new THREE.Raycaster(),
  groundPlane: new THREE.Plane(new THREE.Vector3(0, 1, 0), 0),
};

window.addEventListener(
  "pointermove",
  (e) => {
    pointer.ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ndc.y = -(e.clientY / window.innerHeight) * 2 + 1;
    pointer.has = true;
  },
  { passive: true },
);
window.addEventListener("pointerleave", () => {
  pointer.has = false;
});

// ─── GRID HELPERS ─────────────────────────────────────────────────────────────
function worldToGrid(x, z) {
  return {
    gx: Math.round(x / params.gridSize),
    gz: Math.round(z / params.gridSize),
  };
}
function gridToWorld(gx, gz) {
  return { x: gx * params.gridSize, z: gz * params.gridSize };
}

// ─── CUBE LIFECYCLE ───────────────────────────────────────────────────────────
function startDecay(i) {
  const c = cubeData[i];
  if (c.decaying || !c.active) return;
  c.active = false;
  c.decaying = true;
  c.decayStart = performance.now();
  const key = `${c.gridX},${c.gridZ}`;
  if (cellOccupancy.get(key) === i) cellOccupancy.delete(key);
}

function findFreeSlot() {
  // Prefer a non-active, non-decaying slot.
  for (let i = 0; i < MAX_CUBES; i++) {
    if (!cubeData[i].active && !cubeData[i].decaying) return i;
  }
  // Recycle the oldest active cube.
  let oldest = -1;
  let oldestAge = -1;
  for (let i = 0; i < MAX_CUBES; i++) {
    if (cubeData[i].active && cubeData[i].age > oldestAge) {
      oldestAge = cubeData[i].age;
      oldest = i;
    }
  }
  if (oldest !== -1) {
    startDecay(oldest);
    return oldest;
  }
  // All decaying — pick the one with smallest progress.
  let best = -1;
  let bestProgress = Infinity;
  const now = performance.now();
  for (let i = 0; i < MAX_CUBES; i++) {
    if (cubeData[i].decaying) {
      const progress = (now - cubeData[i].decayStart) / params.decayDuration;
      if (progress < bestProgress) {
        bestProgress = progress;
        best = i;
      }
    }
  }
  return best === -1 ? 0 : best;
}

function spawnCube(gridX, gridZ) {
  const key = `${gridX},${gridZ}`;
  if (cellOccupancy.has(key)) return false;
  const slot = findFreeSlot();
  const c = cubeData[slot];

  // If we picked an active slot, free its old cell first.
  if (c.active) {
    const oldKey = `${c.gridX},${c.gridZ}`;
    if (cellOccupancy.get(oldKey) === slot) cellOccupancy.delete(oldKey);
  }

  const { x, z } = gridToWorld(gridX, gridZ);
  c.active = true;
  c.decaying = false;
  c.age = 0;
  c.decayStart = 0;
  c.baseX = x;
  c.baseY = 0.2 + Math.random() * 0.4;
  c.baseZ = z;
  c.gridX = gridX;
  c.gridZ = gridZ;
  c.size = params.baseCubeSize * (0.85 + Math.random() * 0.4);
  c.phase = Math.random() * Math.PI * 2;
  c.rotSpeed = (Math.random() - 0.5) * 0.4;
  // Pick a face color biased toward the palette.
  c.color.copy(
    colorChoices[Math.floor(Math.random() * colorChoices.length)],
  );
  // 18% chance of white-hot accent.
  if (Math.random() < 0.18) c.color.lerp(tmpWhite, 0.4);
  c.edgeColor.copy(
    edgeColorChoices[Math.floor(Math.random() * edgeColorChoices.length)],
  );
  c.scale = 0.2;
  cellOccupancy.set(key, slot);
  return true;
}

function spawnClusterAtPointer() {
  pointer.raycaster.setFromCamera(pointer.ndc, camera);
  const hit = new THREE.Vector3();
  if (!pointer.raycaster.ray.intersectPlane(pointer.groundPlane, hit)) return;
  pointer.targetWorld.copy(hit);
  pointer.world.lerp(pointer.targetWorld, 0.35);

  const { gx, gz } = worldToGrid(pointer.world.x, pointer.world.z);
  const count =
    params.spawnMin +
    Math.floor(
      Math.random() * (params.spawnMax - params.spawnMin + 1),
    );

  const tries = count * 4;
  let placed = 0;
  for (let t = 0; t < tries && placed < count; t++) {
    // Slightly diagonal cluster (offset dx more than dz sometimes).
    const dx = Math.round((Math.random() - 0.5) * 4);
    const dz = Math.round((Math.random() - 0.5) * 3.4);
    const dist = Math.hypot(dx, dz);
    if (dist > 3.5) continue;
    const targetGx = gx + dx;
    const targetGz = gz + dz;
    if (
      Math.abs(targetGx) > params.gridHalfX ||
      Math.abs(targetGz) > params.gridHalfZ
    )
      continue;
    if (spawnCube(targetGx, targetGz)) placed++;
  }
}

// ─── UPDATE LOOP ──────────────────────────────────────────────────────────────
const tmpMatrix = new THREE.Matrix4();
const tmpPos = new THREE.Vector3();
const tmpQuat = new THREE.Quaternion();
const tmpScale = new THREE.Vector3();
const tmpEuler = new THREE.Euler();
const finalColor = new THREE.Color();

let lastTime = performance.now();
let frameCount = 0;
let lastSpawn = 0;
let visible = !document.hidden;
let pointerNudgeX = 0;
let pointerNudgeY = 0;
let targetNudgeX = 0;
let targetNudgeY = 0;

document.addEventListener("visibilitychange", () => {
  visible = !document.hidden;
  if (visible) lastTime = performance.now();
});

function transformEdgePositions(outOffset, matrix, s) {
  // For each of the 24 local edge vertices, multiply by the cube's matrix
  // and write to the global edgePositions array starting at outOffset.
  const e = matrix.elements;
  // e[0..15] is column-major 4x4
  for (let v = 0; v < VERTS_PER_CUBE; v++) {
    const li = v * 3;
    const lx = edgeLocalPositions[li];
    const ly = edgeLocalPositions[li + 1];
    const lz = edgeLocalPositions[li + 2];
    const wx = e[0] * lx + e[4] * ly + e[8] * lz + e[12];
    const wy = e[1] * lx + e[5] * ly + e[9] * lz + e[13];
    const wz = e[2] * lx + e[6] * ly + e[10] * lz + e[14];
    const oi = (outOffset + v) * 3;
    edgePositions[oi] = wx;
    edgePositions[oi + 1] = wy;
    edgePositions[oi + 2] = wz;
  }
}

function writeEdgeColor(outOffset, r, g, b) {
  for (let v = 0; v < VERTS_PER_CUBE; v++) {
    const oi = (outOffset + v) * 3;
    edgeColors[oi] = r;
    edgeColors[oi + 1] = g;
    edgeColors[oi + 2] = b;
  }
}

function collapseCube(i) {
  // Visually remove cube i: zero its instance matrix, reset its color, and
  // collapse all 24 edge vertices to the origin so the LineSegments have
  // nothing to draw for this slot. Used by both decay-complete and the
  // "hidden" branch.
  tmpMatrix.makeScale(0, 0, 0);
  faceMesh.setMatrixAt(i, tmpMatrix);
  faceMesh.setColorAt(i, initColor);
  const baseVertex = i * VERTS_PER_CUBE;
  for (let v = 0; v < VERTS_PER_CUBE; v++) {
    const oi = (baseVertex + v) * 3;
    edgePositions[oi] = 0;
    edgePositions[oi + 1] = 0;
    edgePositions[oi + 2] = 0;
    edgeColors[oi] = 0;
    edgeColors[oi + 1] = 0;
    edgeColors[oi + 2] = 0;
  }
}

function updateCubes(now, dt) {
  const px = pointer.world.x;
  const pz = pointer.world.z;
  const tSec = now / 1000;
  const idleAmp = prefersReducedMotion ? 0.0 : params.idleAmplitude;
  const decayDur = prefersReducedMotion ? 0.001 : params.decayDuration;
  const birthDur = prefersReducedMotion ? 0.001 : params.birthDuration;
  const pointerGone = !pointer.has;
  const idleLife = prefersReducedMotion ? Infinity : params.idleLifetimeMs;

  for (let i = 0; i < MAX_CUBES; i++) {
    const c = cubeData[i];

    if (c.active) {
      c.age += dt * 1000;

      // Birth — scale 0.2 → 1 with settle bounce AND opacity 0 → 1 fade.
      const birthT = Math.min(c.age / birthDur, 1);
      const settle = 1 - Math.pow(1 - birthT, 3);
      const overshoot = Math.sin(birthT * Math.PI) * params.birthOvershoot;
      const birthScale = 0.2 + (1 - 0.2) * settle + overshoot * 0.6;
      c.scale = birthScale;
      // Opacity equivalent: ease-out fade used to lerp the color toward the
      // background so the cube appears to emerge from the scene.
      const birthAlpha = 1 - Math.pow(1 - birthT, 2);
      const bgBlend = 1 - birthAlpha;

      // Decay trigger
      if (pointerGone && c.age > params.decayTriggerMs) {
        startDecay(i);
        continue;
      }
      if (c.age > idleLife) {
        startDecay(i);
        continue;
      }

      // Idle float
      const floatY = Math.sin(tSec * 1.1 + c.phase) * idleAmp;

      // Hover influence
      const dx = c.baseX - px;
      const dz = c.baseZ - pz;
      const d2 = dx * dx + dz * dz;
      const r = params.hoverRadius;
      const falloff = Math.max(0, 1 - Math.sqrt(d2) / r);
      const hover = Math.pow(falloff, 1.4);
      const hoverY = hover * params.hoverHeightBoost;

      // Position
      tmpPos.set(c.baseX, c.baseY + floatY + hoverY, c.baseZ);

      // Rotation
      c.rotSpeed *= params.rotationDamping;
      tmpEuler.set(
        Math.sin(tSec * params.idleSwayX + c.phase) * params.idleSwayAmp,
        c.phase + tSec * c.rotSpeed * params.idleSpin,
        Math.cos(tSec * params.idleSwayZ + c.phase) * params.idleSwayAmp,
      );
      tmpQuat.setFromEuler(tmpEuler);

      const s = c.size * c.scale;
      tmpScale.set(s, s, s);
      tmpMatrix.compose(tmpPos, tmpQuat, tmpScale);
      faceMesh.setMatrixAt(i, tmpMatrix);

      // Color (face) — modulated by hover, then faded toward background during birth.
      finalColor
        .copy(c.color)
        .multiplyScalar(params.faceBrightnessBase + hover * params.faceBrightnessHoverGain);
      finalColor.lerp(tmpNeon, hover * 0.18);
      finalColor.lerp(tmpBg, bgBlend);
      faceMesh.setColorAt(i, finalColor);

      // Edges — also faded toward background during birth.
      transformEdgePositions(i * VERTS_PER_CUBE, tmpMatrix, s);
      const eR =
        c.edgeColor.r *
        (params.edgeBrightnessBase + hover * params.edgeBrightnessHoverGain);
      const eG =
        c.edgeColor.g *
        (params.edgeBrightnessBase + hover * params.edgeBrightnessHoverGain);
      const eB =
        c.edgeColor.b *
        (params.edgeBrightnessBase + hover * params.edgeBrightnessHoverGain);
      const eFinalR = eR * birthAlpha + tmpBg.r * bgBlend;
      const eFinalG = eG * birthAlpha + tmpBg.g * bgBlend;
      const eFinalB = eB * birthAlpha + tmpBg.b * bgBlend;
      writeEdgeColor(i * VERTS_PER_CUBE, eFinalR, eFinalG, eFinalB);
    } else if (c.decaying) {
      const elapsed = (now - c.decayStart) / decayDur;
      if (elapsed >= 1) {
        collapseCube(i);
        c.decaying = false;
        continue;
      }
      const fade = 1 - elapsed;
      const s = c.size * fade * params.decayShrink;
      tmpPos.set(c.baseX, c.baseY, c.baseZ);
      tmpQuat.identity();
      tmpScale.set(s, s, s);
      tmpMatrix.compose(tmpPos, tmpQuat, tmpScale);
      faceMesh.setMatrixAt(i, tmpMatrix);

      // Color fade
      const fr = c.color.r * fade;
      const fg = c.color.g * fade;
      const fb = c.color.b * fade;
      finalColor.setRGB(fr, fg, fb);
      faceMesh.setColorAt(i, finalColor);

      // Edges fade
      transformEdgePositions(i * VERTS_PER_CUBE, tmpMatrix, s);
      const eR = c.edgeColor.r * fade;
      const eG = c.edgeColor.g * fade;
      const eB = c.edgeColor.b * fade;
      writeEdgeColor(i * VERTS_PER_CUBE, eR, eG, eB);
    } else {
      collapseCube(i);
    }
  }

  faceMesh.instanceMatrix.needsUpdate = true;
  if (faceMesh.instanceColor) faceMesh.instanceColor.needsUpdate = true;
  edgeGeo.attributes.position.needsUpdate = true;
  edgeGeo.attributes.color.needsUpdate = true;
}

function maybeSpawn(now) {
  if (prefersReducedMotion) return;
  if (now - lastSpawn < SPAWN_INTERVAL) return;
  if (!pointer.has) return;
  lastSpawn = now;
  spawnClusterAtPointer();
}

function updateCamera(dt) {
  if (pointer.has) {
    targetNudgeX = pointer.ndc.x * params.pointerNudge;
    targetNudgeY = pointer.ndc.y * params.pointerNudge * 0.5;
  } else {
    targetNudgeX *= 0.95;
    targetNudgeY *= 0.95;
  }
  const lerp = 1 - Math.exp(-params.pointerNudgeLerp * dt);
  pointerNudgeX += (targetNudgeX - pointerNudgeX) * lerp;
  pointerNudgeY += (targetNudgeY - pointerNudgeY) * lerp;
  camera.position.x = -2.4 + pointerNudgeX;
  camera.position.y = 9.5 + pointerNudgeY;
  camera.lookAt(1.6, 0.4, 0);
}

function tick() {
  requestAnimationFrame(tick);
  if (!visible) return;
  const now = performance.now();
  const dt = Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;
  frameCount++;

  if (frameCount % SPAWN_STRIDE === 0) {
    maybeSpawn(now);
  }

  // Seed an initial cluster on first frames so the canvas is non-blank.
  if (frameCount === 2 && !prefersReducedMotion) {
    for (let i = 0; i < 6; i++) {
      spawnCube(
        Math.round((Math.random() - 0.5) * 6),
        Math.round((Math.random() - 0.5) * 5),
      );
    }
  }
  if (frameCount === 60 && !prefersReducedMotion) {
    for (let i = 0; i < 4; i++) {
      spawnCube(
        Math.round((Math.random() - 0.5) * 5),
        Math.round((Math.random() - 0.5) * 4),
      );
    }
  }

  updateCubes(now, dt);
  updateCamera(dt);
  particles.material.uniforms.uTime.value = now / 1000;

  renderer.render(scene, camera);
}

// ─── RESIZE ───────────────────────────────────────────────────────────────────
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onResize);

// ─── START ────────────────────────────────────────────────────────────────────
tick();
