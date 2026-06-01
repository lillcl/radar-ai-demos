# VoxelMorph — Step-by-Step Guide: From Design to Working 3D Object

> Every decision, every file, every function — explained. Build any voxel morph object (tree, guitar, ship, character) using this guide.

---

## Before You Start — What You're Building

A **voxel morph object** is a 3D scene containing:
- A **voxel object** (block-by-block construction, like Minecraft)
- **3+ visual variations** that the object morphs between on button click
- **Mouse hover repulsion** — voxels burst outward when you hover near them
- **Ambient particles** — dust motes and falling confetti
- **Cinematic lighting** — multiple lights with soft shadows, GTAO, SSR, Bloom
- **Works from any camera angle** — orbit the camera anywhere, all effects work

**Example projects using this guide:** Voxel Tree (floating island + 3 seasonal trees) | Voxel Guitar (acoustic → electric → bass morphs)

---

## Phase 1: Planning Your Object

### 1.1 Decide the Object

Choose an object with **3+ visually distinct variations** that share the same voxel structure. The variation morph reshapes positions AND colors. Good candidates:

| Object | Variation A | Variation B | Variation C |
|---|---|---|---|
| Tree | Autumn (orange leaves) | Snowy Pine (white tiers) | Cherry Blossom (pink spread) |
| Guitar | Acoustic (wood body) | Electric (solid body) | Bass (long neck) |
| Ship | Sailing Ship | Steamer | Battleship |
| Character | Knight | Wizard | Archer |

### 1.2 Map the Voxel Grid

Define the object's **footprint** (width × depth × height in voxels) and sketch each variation as position/color mutations.

**Guitar planning example:**

```
GUITAR GRID — 8 wide × 30 tall × 2 deep (centerline)

Y=28  [body]  ═════════════════════════════  ← neck top
Y=26  [body]  ═════════════════════════════
Y=24  [body]  ═════════════════════════════  ← nut
Y=22  [body]  ▓▓░░░░░░░░░░░░░░░░░░░░░░░░░▓▓  ← frets appear
Y=20  [body]  ▓▓░░░░░░░░░░░░░░░░░░░░░░░░░▓▓
Y=18  [body]  ▓▓░░░░░░░░░░░░░░░░░░░░░░░░░▓▓
Y=16  [body]  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ← body widens
Y=14  [body]  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
Y=12  [body]  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
Y=10  [body]  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
Y=8   [body]  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
Y=6   [body]    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
Y=4   [body]      ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
Y=2   [body]        ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
Y=0   [body]            ▓▓▓▓
```

### 1.3 Choose Color Palettes

Each variation needs a full palette across all categories:

```
ACOUSTIC:
  body     ["#8B4513", "#A0522D", "#6B3610", "#7B3F00"]  — mahogany wood
  neck     ["#5C3317", "#4A2810", "#6B3D1F"]              — dark wood
  frets    ["#C0C0C0", "#A8A8A8", "#D4AF37"]              — silver + gold
  strings ["#E8E8E8", "#D4D4D4", "#C0C0C0"]              — steel
  soundhole ["#1a0a00", "#2d1508", "#0d0800"]             — dark hollow

ELECTRIC:
  body     ["#1a1a2e", "#16213e", "#0f3460", "#0a0a1a"]  — dark body
  neck     ["#2c2c2c", "#1a1a1a", "#333333"]              — black
  pickups  ["#111111", "#222222", "#333333"]               — black
  bridge   ["#C0C0C0", "#A8A8A8", "#D4D4D4"]              — chrome

BASS:
  body     ["#2d2d2d", "#3d3d3d", "#1a1a1a", "#4d4d4d"]  — dark grey
  neck     ["#5c4033", "#4a3426", "#6b5444"]              — laminate
  pickups  ["#333333", "#222222", "#444444"]               — dark
  strings ["#E8E8E8", "#D4D4D4", "#C0C0C0"]              — steel
```

### 1.4 Plan Categories

Decide how many **material categories** your object needs. Fewer is better — each category = one draw call.

```
GUITAR CATEGORIES (6):
  body     → MeshStandardNodeMaterial, rough=0.85
  neck     → MeshStandardNodeMaterial, rough=0.80
  frets   → MeshPhysicalNodeMaterial (metalness=0.9, clearcoat=0.5)
  strings → MeshPhysicalNodeMaterial (metalness=1.0, rough=0.2)
  pickups → MeshStandardNodeMaterial, rough=0.6
  soundhole → MeshStandardNodeMaterial, rough=0.3
```

---

## Phase 2: Project Files

```
voxel-morph-guitar/          ← your project folder
├── index.html               ← page shell + UI buttons
└── scene.js                 ← ALL logic (no other files needed)
```

**index.html** contains:
- Importmap for Three.js CDN
- Hero container (`#app` or `.hero-scene`)
- Variation buttons (`.variation-btn[data-variation="0/1/2"]`)
- Loading screen
- `<script type="module" src="scene.js">`

**scene.js** contains ALL logic — no build step, no imports from other files.

### index.html Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Voxel Morph Guitar</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; background: #0a0a0f; }
    #app { width: 100%; height: 100%; position: relative; }
    canvas { display: block; }
    #ui {
      position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
      display: flex; gap: 12px; z-index: 10;
    }
    .variation-btn {
      padding: 10px 24px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px; color: rgba(255,255,255,0.85);
      font-size: 14px; font-weight: 500; cursor: pointer;
      transition: all 0.2s ease; letter-spacing: 0.5px;
    }
    .variation-btn:hover { background: rgba(255,255,255,0.15); }
    .variation-btn.active {
      transform: scale(1.02);
      background: rgba(139,90,43,0.9);
      border-color: rgba(210,105,30,0.9); color: #fff;
    }
    .variation-btn[data-variation="1"].active { background: rgba(192,192,192,0.15); border-color: rgba(192,192,192,0.5); color: #C0C0C0; }
    .variation-btn[data-variation="2"].active { background: rgba(74,144,217,0.2); border-color: rgba(74,144,217,0.6); color: #4A90D9; }
  </style>
</head>
<body>
  <div id="app"></div>
  <div id="ui">
    <button class="variation-btn active" data-variation="0">Acoustic</button>
    <button class="variation-btn" data-variation="1">Electric</button>
    <button class="variation-btn" data-variation="2">Bass</button>
  </div>

  <script type="importmap">
  {
    "imports": {
      "three": "https://unpkg.com/three@0.170.0/build/three.module.js",
      "three/addons/": "https://unpkg.com/three@0.170.0/examples/jsm/"
    }
  }
  </script>
  <script type="module" src="./scene.js"></script>
</body>
</html>
```

---

## Phase 3: scene.js — Step by Step

### Step 3.1 — Renderer

```javascript
import * as THREE from "three/webgpu";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ── Container ──
const container =
  document.querySelector("#app") ||
  document.querySelector(".hero-scene") ||
  document.body;

const containerW = () => container.clientWidth || window.innerWidth;
const containerH = () => container.clientHeight || window.innerHeight;

// ── Camera: centered, NO view offset ──
// Removing setViewOffset is critical — it was causing the tree to orbit off-center
const camera = new THREE.PerspectiveCamera(40, containerW() / containerH(), 0.5, 500);
camera.position.set(30, 30, 66);
camera.lookAt(0, 6, 0);           // ← orbit target AND lookAt must match

// ── Renderer ──
let renderer;
try {
  renderer = new THREE.WebGPURenderer({ antialias: true });
  renderer.setSize(containerW(), containerH());
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  container.appendChild(renderer.domElement);
  await renderer.init();
} catch (e) {
  // Fallback to WebGL if WebGPU unavailable
  renderer = new THREE.WebGPURenderer({ antialias: true, forceWebGL: true });
  renderer.setSize(containerW(), containerH());
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  container.appendChild(renderer.domElement);
  await renderer.init();
}
```

### Step 3.2 — Scene + Environment

```javascript
const scene = new THREE.Scene();

// ── Procedural sky (gradient, no external assets) ──
const skyGeo = new THREE.SphereGeometry(50, 32, 16);
const skyMat = new THREE.MeshBasicNodeMaterial({ side: THREE.BackSide });
// TSL: gradient from sky blue top to warm horizon
skyMat.colorNode = mix(
  color(0x87ceeb),
  color(0xffeedd),
  pow(max(float(0).sub(skyUV.y), float(0)), float(0.8)),
).add(mix(color(0x000000), color(0xfff5e0), max(skyUV.y, float(0)).mul(float(0.3))));
scene.add(new THREE.Mesh(skyGeo, skyMat));

// ── Deferred HDR (optional, loads after 3s idle) ──
// Keep procedural sky for initial fast load; swap for HDR if available
const rgbeLoader = new RGBELoader();
requestIdleCallback(() => {
  rgbeLoader.load("https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/kloofendal_48d_partly_cloudy_puresky_1k.hdr", (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = texture;
    scene.background = texture;
    scene.backgroundBlurriness = 0.25;
    scene.backgroundIntensity = 0.8;
  });
}, { timeout: 3000 });
```

### Step 3.3 — Lighting (5 lights)

```javascript
// Ambient — warm fill
scene.add(new THREE.AmbientLight(0xffeedd, 0.5));

// Key light — main shadow caster
const mainLight = new THREE.DirectionalLight(0xfff5e0, 2.5);
mainLight.position.set(6, 14, 5);
mainLight.castShadow = true;
mainLight.shadow.mapSize.set(2048, 2048);
mainLight.shadow.camera.left = -32;
mainLight.shadow.camera.right = 32;
mainLight.shadow.camera.top = 32;
mainLight.shadow.camera.bottom = -32;
mainLight.shadow.bias = 0.0001;
mainLight.shadow.normalBias = 0.05;
mainLight.shadow.radius = 5.0;
mainLight.shadow.blurSamples = 16;
scene.add(mainLight);

// Secondary soft shadow (offset for overlapping shadows)
const softShadow = new THREE.DirectionalLight(0xffeedd, 0.6);
softShadow.position.set(-3, 8, 6);
softShadow.castShadow = true;
softShadow.shadow.mapSize.set(512, 512);
softShadow.shadow.radius = 3.75;
scene.add(softShadow);

// Fill — cool blue (opposite side from key)
const fillLight = new THREE.DirectionalLight(0x88bbff, 1.0);
fillLight.position.set(-5, 8, -3);
scene.add(fillLight);

// Rim — warm backlight
const rimLight = new THREE.PointLight(0xffaa66, 1.5, 30);
rimLight.position.set(-4, 12, -5);
scene.add(rimLight);

// Accent — warm front-low
const accentLight = new THREE.PointLight(0xff8844, 1.2, 25);
accentLight.position.set(4, 10, 4);
scene.add(accentLight);
```

### Step 3.4 — Voxel Builder (Define Your Object)

```javascript
// ── Core data structures ──
const voxelSize = 1.0;
const step = voxelSize;
const voxelGeo = new THREE.BoxGeometry(voxelSize, voxelSize, voxelSize, 1, 1, 1);
// Note: 1,1,1 segments = minimum for flat shading (no smoothing between faces)

const categoryBatches = {};          // category → { rough, metal, geo, transforms[], colors[] }
const occupiedPositions = new Set();  // dedup
const voxels = [];                    // all InstancedMesh objects
const voxelMats = [];                // all materials (for global controls)

function posKey(x, y, z) {
  return `${Math.round(x * 100)},${Math.round(y * 100)},${Math.round(z * 100)}`;
}
function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// ── Standard voxel ──
// x, y, z = grid coordinates (will be multiplied by voxelSize)
// hex = color string
// category = material group (determines InstancedMesh + material)
function createVoxel(x, y, z, hex, category = "default") {
  const pk = posKey(x, y, z);
  if (occupiedPositions.has(pk)) return;     // no duplicates
  occupiedPositions.add(pk);

  if (!categoryBatches[category]) {
    categoryBatches[category] = {
      rough: 0.7, metal: 0.05, geo: "voxel",
      transforms: [], colors: [],
    };
  }
  categoryBatches[category].transforms.push({
    x: x * step,
    y: y * step + voxelSize / 2,            // center on Y grid
    z: z * step,
    sx: 1, sy: 1, sz: 1, rx: 0, rz: 0,
  });
  categoryBatches[category].colors.push(hex);
}

// ── Custom-sized voxel ──
// sx, sy, sz = size multipliers (0.25 = 1/4 voxelSize, 2.0 = 2x voxelSize)
function createCustomVoxel(hex, x, y, z, sx, sy, sz, rx, rz, category = "default") {
  const pk = posKey(x, y, z);
  if (occupiedPositions.has(pk)) return;
  occupiedPositions.add(pk);

  const geoKey = `${sx.toFixed(2)}_${sy.toFixed(2)}_${sz.toFixed(2)}`;
  const catKey = `${category}|${geoKey}`;    // unique batch per size

  if (!categoryBatches[catKey]) {
    categoryBatches[catKey] = { rough: 0.7, metal: 0.05, geo: geoKey, transforms: [], colors: [] };
  }
  categoryBatches[catKey].transforms.push({
    x: x * step, y: y * step + voxelSize / 2, z: z * step,
    sx, sy, sz, rx: rx || 0, rz: rz || 0,
  });
  categoryBatches[catKey].colors.push(hex);
}

// ── Geometry cache ──
const geoCache = { voxel: voxelGeo };
function getGeo(key) {
  if (key === "voxel") return voxelGeo;
  if (!geoCache[key]) {
    const [sx, sy, sz] = key.split("_").map(Number);
    geoCache[key] = new THREE.BoxGeometry(voxelSize * sx, voxelSize * sy, voxelSize * sz);
  }
  return geoCache[key];
}

// ══ DEFINE YOUR OBJECT HERE ══
// Example: guitar body outline (from the 2D grid sketch in Phase 1)
// Acoustic body (centered at x=0, z=0)
const bodyColors = ["#8B4513", "#A0522D", "#6B3610"];
for (let y = 0; y <= 28; y++) {
  const halfW = getBodyHalfWidth(y);   // your custom function for guitar body profile
  for (let x = -halfW; x <= halfW; x++) {
    createVoxel(x, y, 0, pickRandom(bodyColors), "body");
  }
}
// Strings (tall thin voxels along the neck)
const stringColors = ["#E8E8E8", "#D4D4D4"];
for (let y = 0; y <= 30; y++) {
  for (const sx of [-0.5, -0.3, 0, 0.3, 0.5]) {
    createVoxel(sx, y, 0, pickRandom(stringColors), "strings");
  }
}
// Frets (small raised rectangles at specific Y levels)
const fretYLevels = [24, 22, 20, 18, 16, 14, 12, 10, 8, 6, 4, 2];
const fretColors = ["#C0C0C0", "#D4AF37"];
fretYLevels.forEach(fy => {
  for (let x = -2; x <= 2; x++) {
    createCustomVoxel(
      pickRandom(fretColors), x, fy, 0,
      0.2, 0.1, 0.2,   // tiny flat box
      0, 0,
      "frets"
    );
  }
});
// Neck (dark wood, continuous column)
const neckColors = ["#5C3317", "#4A2810"];
for (let y = 0; y <= 26; y++) {
  createVoxel(0, y, 0, pickRandom(neckColors), "neck");
}
```

### Step 3.5 — Build InstancedMeshes

```javascript
// ── Material presets per category ──
const categoryMatPresets = {
  // physical: true → MeshPhysicalNodeMaterial (clearcoat for shiny surfaces)
  // physical: false → MeshStandardNodeMaterial
  body:    { rough: 0.85, metal: 0.05, clearcoat: 0,    physical: false },
  neck:    { rough: 0.80, metal: 0.05, clearcoat: 0,    physical: false },
  frets:   { rough: 0.20, metal: 0.90, clearcoat: 0.5,  physical: true  },
  strings: { rough: 0.20, metal: 1.00, clearcoat: 0.8,  physical: true  },
  pickups: { rough: 0.60, metal: 0.20, clearcoat: 0,    physical: false },
};

function buildInstancedMeshes() {
  const dummy = new THREE.Object3D();
  const tmpColor = new THREE.Color();

  for (const catKey in categoryBatches) {
    const batch = categoryBatches[catKey];
    const count = batch.transforms.length;
    if (count === 0) continue;

    const baseCat = catKey.split("|")[0];         // strip "|geoKey" suffix
    const preset = categoryMatPresets[baseCat] || { rough: 0.6, metal: 0.15, clearcoat: 0, physical: true };

    // ── Material ──
    const mat = preset.physical
      ? new THREE.MeshPhysicalNodeMaterial()
      : new THREE.MeshStandardNodeMaterial();

    if (preset.physical) {
      mat.clearcoat = preset.clearcoat;
      mat.clearcoatRoughness = 0.5;
      mat.reflectivity = 0.3;
      mat.ior = 1.5;
    }
    mat.roughness = preset.rough;
    mat.metalness = preset.metal;
    mat.envMapIntensity = 1.2;
    mat.flatShading = true;                     // ← CRITICAL for chunky voxel look
    mat.polygonOffset = true;                   // ← CRITICAL for z-fighting prevention
    mat.polygonOffsetFactor = 1;
    mat.polygonOffsetUnits = 1;
    voxelMats.push(mat);

    // ── Geometry ──
    const geo = batch.geo === "voxel" ? voxelGeo : getGeo(batch.geo);

    // ── InstancedMesh ──
    const im = new THREE.InstancedMesh(geo, mat, count);
    im.name = "cat_" + catKey.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 40);
    im.castShadow = true;
    im.receiveShadow = true;

    for (let i = 0; i < count; i++) {
      const t = batch.transforms[i];
      dummy.position.set(t.x, t.y, t.z);
      dummy.rotation.set(t.rx, 0, t.rz);
      dummy.scale.set(t.sx, t.sy, t.sz);
      dummy.updateMatrix();
      im.setMatrixAt(i, dummy.matrix);
      tmpColor.set(batch.colors[i]);
      im.setColorAt(i, tmpColor);
    }
    im.instanceMatrix.needsUpdate = true;
    if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.frustumCulled = true;

    scene.add(im);
    voxels.push(im);
  }
  console.log(`Built ${voxels.length} instanced meshes`);
}
buildInstancedMeshes();
```

### Step 3.6 — Instance Data (for Repulsion)

```javascript
// Extract per-instance base positions + random scatter directions
// Run ONCE after buildInstancedMeshes()
const instanceData = new Map();     // im → { origPositions, offsets, randDirs, count }
let _islandBBox = new THREE.Box3();

{
  const dummy = new THREE.Object3D();
  const mat4 = new THREE.Matrix4();

  voxels.forEach(im => {
    const count = im.count;
    const orig = new Float32Array(count * 3);
    const offsets = new Float32Array(count * 3);  // zeros initially
    const randDirs = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      im.getMatrixAt(i, mat4);
      mat4.decompose(dummy.position, dummy.quaternion, dummy.scale);
      orig[i * 3]     = dummy.position.x;
      orig[i * 3 + 1] = dummy.position.y;
      orig[i * 3 + 2] = dummy.position.z;
      _islandBBox.expandByPoint(dummy.position);

      // Random unit-sphere direction for scatter in repulsion
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      randDirs[i * 3]     = Math.sin(phi) * Math.cos(theta);
      randDirs[i * 3 + 1] = Math.sin(phi) * Math.sin(theta);
      randDirs[i * 3 + 2] = Math.cos(phi);
    }
    instanceData.set(im, { origPositions: orig, offsets, randDirs, count });
  });
  _islandBBox.expandByScalar(3.0);
}
```

### Step 3.7 — Category Detection

```javascript
// Names are assigned during buildInstancedMeshes() via im.name = "cat_" + catKey
// Used by variation generators to apply category-specific transforms
function meshCategory(im) {
  const n = im.name || "";
  if (n.startsWith("cat_body"))    return "body";
  if (n.startsWith("cat_neck"))    return "neck";
  if (n.startsWith("cat_frets"))  return "frets";
  if (n.startsWith("cat_strings")) return "strings";
  if (n.startsWith("cat_pickups")) return "pickups";
  return "other";
}
```

### Step 3.8 — Variation Generation

**Variation 0** is always the base snapshot (call `snapshotVariation()` once after building).

**Variations 1..N** are generated by mutating positions and colors per category:

```javascript
// ══ VARIATION 1: Electric Guitar ══
function generateElectricVariation() {
  const snap = new Map();
  const occupied = new Set();

  voxels.forEach(im => {
    const data = instanceData.get(im);
    if (!data) return;
    const count = im.count;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const origPositions = data.origPositions;
    const cat = meshCategory(im);

    for (let i = 0; i < count; i++) {
      const ox = origPositions[i * 3];
      const oy = origPositions[i * 3 + 1];
      const oz = origPositions[i * 3 + 2];
      let cr, cg, cb;

      // Read current color
      if (im.instanceColor) {
        const tmp = new THREE.Color();
        im.getColorAt(i, tmp);
        cr = tmp.r; cg = tmp.g; cb = tmp.b;
      } else {
        cr = im.material.color.r; cg = im.material.color.g; cb = im.material.color.b;
      }

      let nx = ox, ny = oy, nz = oz;

      if (cat === "body") {
        // Darken body
        nx = ox * 1.05;                  // slightly wider
        ny = oy * 0.9;                   // lower body
        cr = 0.10; cg = 0.10; cb = 0.18; // dark blue-black

      } else if (cat === "neck") {
        cr = 0.17; cg = 0.17; cb = 0.17; // flat black

      } else if (cat === "strings") {
        // Keep metallic but thinner
        cr = 0.85; cg = 0.85; cb = 0.85;
      }

      positions[i * 3] = nx;
      positions[i * 3 + 1] = ny;
      positions[i * 3 + 2] = nz;
      colors[i * 3] = cr;
      colors[i * 3 + 1] = cg;
      colors[i * 3 + 2] = cb;
    }
    snap.set(im, { positions, colors });
  });
  return snap;
}

// ══ VARIATION 2: Bass Guitar ══
function generateBassVariation() {
  // Similar pattern: elongate neck, deepen body, darken colors
  // ...
}

// ── Snapshot all variations ──
const variationData = [snapshotVariation()];   // [0] = base
variationData[1] = generateElectricVariation();
variationData[2] = generateBassVariation();

const VARIATION_NAMES = ["Acoustic", "Electric", "Bass"];
const VARIATION_BLOOM = [0.3, 0.4, 0.35];
```

### Step 3.9 — Morph Controller

```javascript
let isMorphing = false;
let morphFrom = 0, morphTo = 0;
let morphStartTime = 0;
let morphBasePositions = null;
let morphBaseColors = null;
let currentVariation = 0;
const morphDuration = 1.8;          // seconds

// Capture live state (not including repulsion offsets) as morph base
function snapshotCurrentState() {
  const posMap = new Map();
  const colMap = new Map();
  const tmpColor = new THREE.Color();
  const dummy = new THREE.Object3D();
  const mat4 = new THREE.Matrix4();

  voxels.forEach(im => {
    const data = instanceData.get(im);
    if (!data) return;
    const count = data.count;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Use origPositions, not live matrix — excludes repulsion offsets
      pos[i * 3]     = data.origPositions[i * 3];
      pos[i * 3 + 1] = data.origPositions[i * 3 + 1];
      pos[i * 3 + 2] = data.origPositions[i * 3 + 2];

      if (im.instanceColor) {
        im.getColorAt(i, tmpColor);
        col[i * 3] = tmpColor.r; col[i * 3 + 1] = tmpColor.g; col[i * 3 + 2] = tmpColor.b;
      } else {
        col[i * 3] = im.material.color.r; col[i * 3 + 1] = im.material.color.g; col[i * 3 + 2] = im.material.color.b;
      }
    }
    posMap.set(im, pos);
    colMap.set(im, col);
  });
  return { posMap, colMap };
}

function startMorph(toVariation) {
  if (isMorphing && morphTo === toVariation) return;
  if (currentVariation === toVariation && !isMorphing) return;

  const current = snapshotCurrentState();
  morphBasePositions = current.posMap;
  morphBaseColors = current.colMap;
  morphFrom = currentVariation;
  morphTo = toVariation;
  morphStartTime = performance.now();
  isMorphing = true;
}

// ── updateMorph() — called every frame inside animate() ──
function updateMorph() {
  if (!isMorphing) return;

  const elapsed = (performance.now() - morphStartTime) / 1000;
  let t = Math.min(elapsed / morphDuration, 1.0);
  t = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;  // cubic ease

  const toSnap = variationData[morphTo];
  const baseSnap = variationData[0];                   // ALWAYS base for stagger
  const _morphColor = new THREE.Color();
  const dummy = new THREE.Object3D();

  voxels.forEach(im => {
    const data = instanceData.get(im);
    if (!data) return;
    const toData = toSnap.get(im);
    const basePos = morphBasePositions.get(im);
    const baseCol = morphBaseColors.get(im);
    const baseSnapData = baseSnap.get(im);
    if (!toData || !basePos || !baseCol) return;

    const count = data.count;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // ── STAGGER WAVE ──
      // Phase from base positions (not live) — wave always flows same direction
      const bx = baseSnapData ? baseSnapData.positions[i3]     : basePos[i3];
      const bz = baseSnapData ? baseSnapData.positions[i3 + 2] : basePos[i3 + 2];
      const stagger = (Math.sin(bx * 0.5 + bz * 0.7) * 0.5 + 0.5) * 0.3;
      const localT = Math.max(0, Math.min(1, (t - stagger) / (1.0 - stagger)));

      // ── POSITION LERP ──
      const nx = basePos[i3]     + (toData.positions[i3]     - basePos[i3])     * localT;
      const ny = basePos[i3 + 1] + (toData.positions[i3 + 1] - basePos[i3 + 1]) * localT;
      const nz = basePos[i3 + 2] + (toData.positions[i3 + 2] - basePos[i3 + 2]) * localT;

      data.origPositions[i3]     = nx;
      data.origPositions[i3 + 1] = ny;
      data.origPositions[i3 + 2] = nz;

      // Apply repulsion offset on top
      const ox = data.offsets[i3];
      const oy = data.offsets[i3 + 1];
      const oz = data.offsets[i3 + 2];

      dummy.position.set(nx + ox, ny + oy, nz + oz);
      dummy.updateMatrix();
      im.setMatrixAt(i, dummy.matrix);

      // ── COLOR LERP ──
      if (im.instanceColor) {
        _morphColor.setRGB(
          baseCol[i3]     + (toData.colors[i3]     - baseCol[i3])     * localT,
          baseCol[i3 + 1] + (toData.colors[i3 + 1] - baseCol[i3 + 1]) * localT,
          baseCol[i3 + 2] + (toData.colors[i3 + 2] - baseCol[i3 + 2]) * localT,
        );
        im.setColorAt(i, _morphColor);
      }
    }
    im.instanceMatrix.needsUpdate = true;
    if (im.instanceColor) im.instanceColor.needsUpdate = true;
  });

  // Bloom lerp
  if (bloomPass && bloomEnabled) {
    const fb = VARIATION_BLOOM[morphFrom];
    const tb = VARIATION_BLOOM[morphTo];
    bloomPass.strength.value = fb + (tb - fb) * t;
  }

  if (t >= 1.0) {
    isMorphing = false;
    currentVariation = morphTo;
    morphBasePositions = null;
    morphBaseColors = null;
  }
}
```

### Step 3.10 — Mouse Repulsion

```javascript
// ── State ──
const _bboxCenter = new THREE.Vector3();
_islandBBox.getCenter(_bboxCenter);

const _rayPlane = new THREE.Plane();
const _planeIntersect = new THREE.Vector3();
const _smoothHitPoint = new THREE.Vector3(9999, 9999, 9999);
let _hasSmoothedHit = false;

const repulsionRadius = 10.0;
const repulsionStrength = 18.0;
const returnSpeed = 2.5;
const mouseIdleTimeout = 0.08;
const hitSmoothSpeed = 12.0;
const radialMix = 0.6;

let lastMouseMoveTime = 0;
const mouse = new THREE.Vector2(9999, 9999);

// ── Mouse tracking ──
window.addEventListener("mousemove", (e) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  lastMouseMoveTime = performance.now();
});
window.addEventListener("mouseleave", () => { mouse.x = 9999; mouse.y = 9999; });

// ── Per-frame update ──
const _dummy = new THREE.Object3D();
const _dir = new THREE.Vector3();

function updateRepulsion(dt, camera) {
  const mouseIdle = (performance.now() - lastMouseMoveTime) / 1000 > mouseIdleTimeout;

  // Camera-facing plane: normal points TOWARD camera (NOT negate()d)
  // This ensures rays from inside the scene intersect the plane from any angle
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  _rayPlane.setFromNormalAndCoplanarPoint(
    raycaster.ray.direction,    // NOT negated — plane faces camera
    _bboxCenter,
  );
  const rawHit = raycaster.ray.intersectPlane(_rayPlane, _planeIntersect) !== null;

  const maxProxyDist = Math.max(_islandBBox.getSize(new THREE.Vector3()).length() * 0.55, 15);
  const validHit = rawHit && _planeIntersect.distanceTo(_bboxCenter) < maxProxyDist;

  if (validHit) {
    if (!_hasSmoothedHit) { _smoothHitPoint.copy(_planeIntersect); _hasSmoothedHit = true; }
    else if (!mouseIdle) {
      const sf = 1.0 - Math.exp(-hitSmoothSpeed * Math.min(dt, 0.05));
      _smoothHitPoint.lerp(_planeIntersect, sf);
    }
  } else {
    _hasSmoothedHit = false;
  }

  const hasHit = validHit;
  const dtClamped = Math.min(dt, 0.05);

  voxels.forEach(im => {
    const data = instanceData.get(im);
    if (!data) return;
    const { origPositions, offsets, randDirs, count } = data;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const ox = origPositions[i3];
      const oy = origPositions[i3 + 1];
      const oz = origPositions[i3 + 2];

      let tx = 0, ty = 0, tz = 0;

      if (hasHit) {
        _dir.set(ox - _smoothHitPoint.x, oy - _smoothHitPoint.y, oz - _smoothHitPoint.z);
        const dist = _dir.length();

        if (dist < repulsionRadius && dist > 0.01) {
          const falloff = 1.0 - dist / repulsionRadius;
          const strength = falloff * falloff * falloff * repulsionStrength;
          _dir.normalize();

          // Breathing pulse (two frequencies, spatial phase)
          const pulsePhase = ox * 1.3 + oy * 0.7 + oz * 1.1;
          const pulseTime = performance.now();
          const pulseAmount =
            Math.sin(pulseTime * 0.003 + pulsePhase) * 0.15 +
            Math.sin(pulseTime * 0.0017 + pulsePhase * 0.6) * 0.1;
          const breathScale = 1.0 + pulseAmount * falloff;

          // Radial + random scatter
          const mx = _dir.x * radialMix + randDirs[i3]     * (1 - radialMix);
          const my = _dir.y * radialMix + randDirs[i3 + 1] * (1 - radialMix);
          const mz = _dir.z * radialMix + randDirs[i3 + 2] * (1 - radialMix);
          const ml = Math.sqrt(mx * mx + my * my + mz * mz) || 1;

          tx = (mx / ml) * strength * breathScale;
          ty = (my / ml) * strength * breathScale;
          tz = (mz / ml) * strength * breathScale;
        }
      }

      const activeSpeed = hasHit ? 8.0 : returnSpeed;
      const lerpFactor = 1.0 - Math.exp(-activeSpeed * dtClamped);
      offsets[i3]     += (tx - offsets[i3])     * lerpFactor;
      offsets[i3 + 1] += (ty - offsets[i3 + 1]) * lerpFactor;
      offsets[i3 + 2] += (tz - offsets[i3 + 2]) * lerpFactor;

      dummy.position.set(ox + offsets[i3], oy + offsets[i3 + 1], oz + offsets[i3 + 2]);
      dummy.updateMatrix();
      im.setMatrixAt(i, dummy.matrix);
    }
    im.instanceMatrix.needsUpdate = true;
  });
}
```

### Step 3.11 — Particles

```javascript
// Dust motes
const dustCount = 120;
const dustGeo = new THREE.BufferGeometry();
const dustPos = new Float32Array(dustCount * 3);
const dustVel = new Float32Array(dustCount * 3);
const dustSizes = new Float32Array(dustCount);
const dustLife = new Float32Array(dustCount);
const dustSpeeds = new Float32Array(dustCount);

for (let i = 0; i < dustCount; i++) {
  dustPos[i*3] = (Math.random()-0.5)*30; dustPos[i*3+1] = Math.random()*35-5; dustPos[i*3+2] = (Math.random()-0.5)*24;
  dustVel[i*3] = (Math.random()-0.5)*0.3; dustVel[i*3+1] = (Math.random()-0.5)*0.1; dustVel[i*3+2] = (Math.random()-0.5)*0.3;
  dustSizes[i] = 0.18 + Math.random()*0.25; dustLife[i] = Math.random(); dustSpeeds[i] = 0.02 + Math.random()*0.04;
}
dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
dustGeo.setAttribute("aSize", new THREE.BufferAttribute(dustSizes, 1));

const dustMat = new THREE.PointsNodeMaterial({ transparent:true, depthWrite:false, blending:THREE.AdditiveBlending, sizeAttenuation:true });
dustMat.colorNode = color(0xffffcc); dustMat.opacityNode = float(0.65);
scene.add(new THREE.Points(dustGeo, dustMat));

// Falling particles
const fallingCount = 40;
const falling = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.5,0.5), new THREE.MeshBasicNodeMaterial({ transparent:true, depthWrite:false, side:THREE.DoubleSide }), fallingCount);
falling.frustumCulled = false;
scene.add(falling);

// Particle palettes (indexed by variation)
const particlePalettes = [
  ["#e63c2e","#d4452f","#f05a3a","#ff6b45"],           // warm autumn
  ["#1a1a2e","#16213e","#0f3460"],                    // cool electric
  ["#5c4033","#4a3426","#6b5444"],                    // earth bass
];

const leafState = [];
for (let i = 0; i < fallingCount; i++) {
  leafState[i] = { /* velocity, rotation, scale, life... */ };
  leafState[i].life = Math.random() * leafState[i].maxLife;  // stagger
}

function updateParticles(dt) {
  const time = performance.now() * 0.001;
  // update dust...
  // update falling...
}
```

### Step 3.12 — Post-Processing

```javascript
import { PostProcessing, pass, mrt, output, normalView, metalness, roughness } from "three/tsl";
import { ao } from "three/addons/tsl/display/GTAONode.js";
import { ssr } from "three/addons/tsl/display/SSRNode.js";
import { bloom } from "three/addons/tsl/display/BloomNode.js";

const postProcessing = new THREE.PostProcessing(renderer);
const scenePass = pass(scene, camera);

// MRT: REQUIRED for GTAO + SSR — provides normal + PBR buffers
scenePass.setMRT(mrt({
  output, normal: normalView, metalness, roughness,
}));

let currentOutput = scenePass.getTextureNode("output");
let bloomPass = null;

try {
  const aoNode = ao(scenePass.getTextureNode("depth"), scenePass.getTextureNode("normal"), camera);
  aoNode.samples.value = 16; aoNode.radius.value = 0.6; aoNode.thickness.value = 1.6;
  currentOutput = vec3(currentOutput.rgb.mul(aoNode.getTextureNode().r)).toVec4(currentOutput.a);
} catch (e) { console.warn("GTAO:", e.message); }

try {
  const ssrNode = ssr(scenePass.getTextureNode("output"), scenePass.getTextureNode("depth"),
    scenePass.getTextureNode("normal"), scenePass.getTextureNode("metalness"), scenePass.getTextureNode("roughness"), camera);
  ssrNode.resolutionScale = 0.25; ssrNode.thickness.value = 0.2; ssrNode.maxDistance.value = 4.0;
  const s = uniform(0.25);
  currentOutput = vec3(currentOutput.rgb.add(ssrNode.getTextureNode().rgb.mul(s))).toVec4(currentOutput.a);
} catch (e) { console.warn("SSR:", e.message); }

try {
  bloomPass = bloom(currentOutput, 0.5, 0.2, 0.8);
  currentOutput = currentOutput.add(bloomPass);
} catch (e) { console.warn("Bloom:", e.message); }

postProcessing.outputNode = currentOutput;
```

### Step 3.13 — Animation Loop

```javascript
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 500;
controls.target.set(0, 6, 0);    // ← MUST match camera.lookAt(0, 6, 0)
let lastTime = performance.now();

function animate() {
  const now = performance.now();
  const dt = (now - lastTime) / 1000;
  lastTime = now;

  controls.update();
  updateMorph();
  updateRepulsion(dt, camera);
  updateParticles(dt);

  if (postProcessing) {
    postProcessing.render();
  } else {
    renderer.render(scene, camera);
  }
}
renderer.setAnimationLoop(animate);

// Resize
window.addEventListener("resize", () => {
  camera.aspect = containerW() / containerH();
  camera.updateProjectionMatrix();
  renderer.setSize(containerW(), containerH());
});
```

### Step 3.14 — UI Buttons

```javascript
document.querySelectorAll(".variation-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    startMorph(parseInt(btn.dataset.variation));
    document.querySelectorAll(".variation-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});
```

---

## Phase 4: Testing

### Test Sequence

| Order | Test | Pass Criteria |
|---|---|---|
| 1 | Load page | No console errors (warnings OK) |
| 2 | Object centered | Object is visible at center, not offset |
| 3 | Orbit camera | Drag to orbit — object rotates around its own center, not wobbling off |
| 4 | Morph button 1 | Click → wave travels outward from outside to inside over ~1.8s |
| 5 | Mid-morph switch | Click button 2 while morphing to 1 → morph chains smoothly |
| 6 | Repulsion front | Hover over object → voxels burst outward from mouse |
| 7 | Repulsion side | Rotate camera 90° → hover over object → repulsion still works |
| 8 | Repulsion top | Rotate camera to top-down → hover → repulsion still works |
| 9 | Idle settle | Leave mouse still → voxels settle smoothly after ~0.1s |
| 10 | Particles | Dust motes visible and drifting; falling particles spawn and tumble |
| 11 | Post-processing | Bloom glow visible on bright areas; soft shadows on ground |

### Angle-Specific Repulsion Test

If repulsion fails from certain angles but not others, the cause is almost always the **raycast plane direction**:

```
WRONG (breaks from most angles):
  _rayPlane.setFromNormalAndCoplanarPoint(camDir.clone().negate(), _bboxCenter);

RIGHT (works from ALL angles):
  _rayPlane.setFromNormalAndCoplanarPoint(camDir, _bboxCenter);
```

The `.negate()` makes the plane face away from the camera, so rays from inside the scene won't hit it.

---

## Phase 5: Key Constants

| Constant | Value | Tuned For |
|---|---|---|
| `voxelSize` | 1.0 | Default voxel scale |
| `morphDuration` | 1.8s | Smooth but not slow |
| `repulsionRadius` | 10.0 | Reaches entire object |
| `repulsionStrength` | 18.0 | Dramatic burst on hover |
| `returnSpeed` | 2.5 | Satisfying spring-back |
| `radialMix` | 0.6 | Chaotic but not random |
| `breathFreq1` | 0.003 | Subtle organic pulse |
| `breathFreq2` | 0.0017 | Secondary pulse |
| `breathAmp` | 0.15 | ±15% variation |
| `hitSmoothSpeed` | 12.0 | Eliminates jitter |
| `mouseIdleTimeout` | 0.08s | Freezes stale hit point |
| `dustCount` | 120 | Enough to be atmospheric |
| `fallingCount` | 40 | Visible without overwhelming |

---

## Phase 6: Troubleshooting

| Symptom | Fix |
|---|---|
| Object orbits off-center | Remove `camera.setViewOffset`; set `controls.target` to match `camera.lookAt` |
| Repulsion fails from side/top | Remove `.negate()` from `camDir` in `setFromNormalAndCoplanarPoint` |
| Voxels disappear during morph | Deduplication collision → add `Set` + collapse duplicates to `(0, 20, 0)` |
| Morph wave flips direction mid-morph | Always seed stagger from `variationData[0]`, not live positions |
| Post-processing black / errors | GTAO/SSR may be unavailable → all wrapped in `try/catch` |
| Dust particles invisible | Ensure `depthWrite: false` + `AdditiveBlending` on PointsMaterial |
| Falling particles stay grey | Initialize `instanceColor` after first `resetLeaf()` loop |
| WebGPU errors | Auto-fallback to `forceWebGL: true` handles this |