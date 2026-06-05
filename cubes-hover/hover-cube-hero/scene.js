import * as THREE from "three";

const canvas = document.querySelector("#cube-scene");
const hero = document.querySelector(".hero");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const palette = {
  deep: new THREE.Color("#1C2420"),
  shadow: new THREE.Color("#2D3733"),
  mist: new THREE.Color("#4D5D57"),
  cyan: new THREE.Color("#A6DBDC"),
  cyanSecondary: new THREE.Color("#89BCBD"),
  white: new THREE.Color("#F8FCFC"),
  electric: new THREE.Color("#00FF5A"),
  neon: new THREE.Color("#23E85F"),
  acid: new THREE.Color("#4CFF6A"),
  reflection: new THREE.Color("#71C980"),
};

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  canvas,
  powerPreference: "high-performance",
});
renderer.setClearColor(palette.deep, 0);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2("#1C2420", 0.035);

const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 120);
const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const pointerNdc = new THREE.Vector2();
const planeHit = new THREE.Vector3();
const dummy = new THREE.Object3D();
const edgeDummy = new THREE.Object3D();
const localDummy = new THREE.Object3D();

const fieldLift = window.innerWidth < 720 ? 0.32 : 1.34;
const pointerPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -fieldLift);
const cubeSize = window.innerWidth < 720 ? 0.58 : 1.06;
const cubeHeight = window.innerWidth < 720 ? 0.44 : 0.76;
const gridStep = cubeSize * 1.32;
const maxCubes = reducedMotion ? 24 : window.innerWidth < 720 ? 38 : 64;
const edgesPerCube = 12;
const hoverRadius = window.innerWidth < 720 ? 2.0 : 2.75;

const pointer = {
  active: false,
  world: new THREE.Vector3(0.9, 0, 0.2),
  target: new THREE.Vector3(0.9, 0, 0.2),
  lastSpawn: 0,
  lastCell: "",
};

const faceGeometry = new THREE.BoxGeometry(cubeSize, cubeHeight, cubeSize);
faceGeometry.translate(0, cubeHeight / 2, 0);
const faceMaterial = new THREE.MeshStandardMaterial({
  color: "#1C2420",
  emissive: "#2D3733",
  emissiveIntensity: 0.42,
  metalness: 0.12,
  roughness: 0.72,
  transparent: true,
  opacity: 0.78,
  vertexColors: true,
});
const faces = new THREE.InstancedMesh(faceGeometry, faceMaterial, maxCubes);
faces.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
faces.frustumCulled = false;
scene.add(faces);

const edgeThickness = window.innerWidth < 720 ? 0.038 : 0.062;
const edgeGeometry = new THREE.BoxGeometry(1, 1, 1);
const edgeMaterial = new THREE.MeshBasicMaterial({
  color: "#A6DBDC",
  transparent: true,
  opacity: 1,
  vertexColors: false,
  toneMapped: false,
});
const edges = new THREE.InstancedMesh(edgeGeometry, edgeMaterial, maxCubes * edgesPerCube);
edges.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
edges.frustumCulled = false;
scene.add(edges);

const glowGeometry = new THREE.PlaneGeometry(10.8, 6.2, 1, 1);
const glowMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uCyan: { value: palette.cyan },
    uGreen: { value: palette.neon },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    precision highp float;
    uniform float uTime;
    uniform vec3 uCyan;
    uniform vec3 uGreen;
    varying vec2 vUv;

    float hash(vec2 p) {
      p = fract(p * vec2(123.34, 456.21));
      p += dot(p, p + 45.32);
      return fract(p.x * p.y);
    }

    void main() {
      vec2 p = vUv - 0.5;
      float d = length(p * vec2(1.15, 0.82));
      float haze = smoothstep(0.58, 0.08, d);
      float n = hash(floor((vUv + uTime * 0.015) * 84.0));
      vec3 color = mix(uCyan, uGreen, smoothstep(-0.2, 0.45, p.x));
      gl_FragColor = vec4(color, haze * (0.12 + n * 0.035));
    }
  `,
  transparent: true,
  depthWrite: false,
});
const haze = new THREE.Mesh(glowGeometry, glowMaterial);
haze.position.set(1.2, 0.02, -0.1);
haze.rotation.x = -Math.PI / 2;
scene.add(haze);

const dotCount = reducedMotion ? 100 : window.innerWidth < 720 ? 150 : 260;
const dotPositions = new Float32Array(dotCount * 3);
const dotColors = new Float32Array(dotCount * 3);
for (let i = 0; i < dotCount; i += 1) {
  dotPositions[i * 3] = (Math.random() - 0.5) * 17 + 1.4;
  dotPositions[i * 3 + 1] = Math.random() * 0.08 - 0.03;
  dotPositions[i * 3 + 2] = (Math.random() - 0.5) * 9 + 1.2;
  const c = Math.random() > 0.48 ? palette.cyan.clone() : palette.neon.clone();
  c.lerp(palette.mist, Math.random() * 0.44);
  dotColors[i * 3] = c.r;
  dotColors[i * 3 + 1] = c.g;
  dotColors[i * 3 + 2] = c.b;
}
const dotGeometry = new THREE.BufferGeometry();
dotGeometry.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
dotGeometry.setAttribute("color", new THREE.BufferAttribute(dotColors, 3));
const dots = new THREE.Points(
  dotGeometry,
  new THREE.PointsMaterial({
    size: window.innerWidth < 720 ? 0.024 : 0.032,
    transparent: true,
    opacity: 0.55,
    vertexColors: true,
  }),
);
scene.add(dots);

const topPlateGeometry = new THREE.PlaneGeometry(5.2, 2.75);
const topPlateMaterial = new THREE.MeshBasicMaterial({
  color: "#00FF5A",
  transparent: true,
  opacity: 0.06,
  side: THREE.DoubleSide,
  toneMapped: false,
});
const topPlate = new THREE.Mesh(topPlateGeometry, topPlateMaterial);
topPlate.position.set(0.1, fieldLift + 0.015, 0.05);
topPlate.rotation.x = -Math.PI / 2;
scene.add(topPlate);

scene.add(new THREE.AmbientLight("#4D5D57", 2.1));
const keyLight = new THREE.DirectionalLight("#A6DBDC", 2.6);
keyLight.position.set(-4, 8, 7);
const rimLight = new THREE.DirectionalLight("#4CFF6A", 1.5);
rimLight.position.set(6, 5, -7);
scene.add(keyLight, rimLight);

const cubeState = [];
const occupied = new Map();
for (let i = 0; i < maxCubes; i += 1) {
  cubeState.push({
    active: false,
    gx: 0,
    gz: 0,
    x: 0,
    z: 0,
    scale: 0,
    targetScale: 1,
    life: 0,
    age: 0,
    rise: 0,
    influence: 0,
    seed: Math.random(),
    variant: Math.random(),
  });
}

const localEdges = [];
function addLocalEdge(x, y, z, sx, sy, sz) {
  localDummy.position.set(x, y, z);
  localDummy.rotation.set(0, 0, 0);
  localDummy.scale.set(sx, sy, sz);
  localDummy.updateMatrix();
  localEdges.push(localDummy.matrix.clone());
}

const h = cubeHeight;
const s = cubeSize;
const t = edgeThickness;
[-1, 1].forEach((yy) => {
  [-1, 1].forEach((zz) => addLocalEdge(0, (yy * h) / 2 + h / 2, (zz * s) / 2, s + t, t, t));
  [-1, 1].forEach((xx) => addLocalEdge((xx * s) / 2, (yy * h) / 2 + h / 2, 0, t, t, s + t));
});
[-1, 1].forEach((xx) => {
  [-1, 1].forEach((zz) => addLocalEdge((xx * s) / 2, h / 2, (zz * s) / 2, t, h + t, t));
});

function cellKey(gx, gz) {
  return `${gx}:${gz}`;
}

function worldToGrid(value) {
  return Math.round(value / gridStep);
}

function easeOutBack(x) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}

function smooth(current, target, speed, delta) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-speed * delta));
}

function getAvailableIndex() {
  let oldestIndex = 0;
  let oldestAge = -1;
  for (let i = 0; i < cubeState.length; i += 1) {
    if (!cubeState[i].active || cubeState[i].life <= 0.02) return i;
    if (cubeState[i].age > oldestAge) {
      oldestIndex = i;
      oldestAge = cubeState[i].age;
    }
  }
  occupied.delete(cellKey(cubeState[oldestIndex].gx, cubeState[oldestIndex].gz));
  return oldestIndex;
}

function spawnCube(gx, gz, lift = 0) {
  const key = cellKey(gx, gz);
  const existing = occupied.get(key);
  if (existing !== undefined) {
    const cube = cubeState[existing];
    cube.life = 1;
    cube.rise = Math.max(cube.rise, lift);
    cube.age = Math.max(0, cube.age - 0.35);
    return;
  }

  const index = getAvailableIndex();
  const cube = cubeState[index];
  occupied.delete(cellKey(cube.gx, cube.gz));
  cube.active = true;
  cube.gx = gx;
  cube.gz = gz;
  cube.x = gx * gridStep;
  cube.z = gz * gridStep;
  cube.scale = 0.18;
  cube.targetScale = 1;
  cube.life = 1;
  cube.age = 0;
  cube.rise = lift;
  cube.influence = lift;
  cube.seed = Math.random();
  cube.variant = Math.random();
  occupied.set(key, index);
}

function spawnCluster(worldPoint, intensity = 1) {
  const gx = worldToGrid(worldPoint.x);
  const gz = worldToGrid(worldPoint.z);
  const key = cellKey(gx, gz);
  const now = performance.now();
  if (key === pointer.lastCell && now - pointer.lastSpawn < 150) return;
  pointer.lastCell = key;
  pointer.lastSpawn = now;

  spawnCube(gx, gz, 0.7 * intensity);
  if (reducedMotion) return;

  const offsets = [
    [1, 0],
    [0, 1],
    [-1, 0],
    [0, -1],
    [1, -1],
  ];
  const count = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i += 1) {
    const [ox, oz] = offsets[(i + Math.floor(Math.random() * offsets.length)) % offsets.length];
    if (Math.random() > 0.2) spawnCube(gx + ox, gz + oz, 0.28 * intensity);
  }
}

function seedInitialField() {
  const cells = [
    [-2, 1],
    [-1, 1],
    [0, 1],
    [1, 1],
    [-2, 0],
    [-1, 0],
    [0, 0],
    [1, 0],
    [2, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
    [2, -1],
  ];
  cells.forEach(([gx, gz], i) => {
    window.setTimeout(() => spawnCube(gx, gz, 0.08), reducedMotion ? 0 : i * 42);
  });
}

function setPointerFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  pointerNdc.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointerNdc.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
  raycaster.setFromCamera(pointerNdc, camera);
  raycaster.ray.intersectPlane(pointerPlane, planeHit);
  pointer.target.copy(planeHit);
  pointer.target.x = THREE.MathUtils.clamp(pointer.target.x, -6.2, 6.8);
  pointer.target.z = THREE.MathUtils.clamp(pointer.target.z, -4.4, 4.8);
  pointer.active = true;
  spawnCluster(pointer.target, 1);
}

hero.addEventListener("pointerenter", setPointerFromEvent);
hero.addEventListener("pointermove", setPointerFromEvent);
hero.addEventListener("pointerleave", () => {
  pointer.active = false;
});

function colorForCube(cube, influence) {
  const edgeColor = cube.variant > 0.68 ? palette.neon.clone() : cube.variant > 0.34 ? palette.cyan.clone() : palette.cyanSecondary.clone();
  edgeColor.lerp(palette.acid, influence * 0.55);
  edgeColor.lerp(palette.white, Math.pow(influence, 3) * 0.36);
  return edgeColor;
}

function setHidden(index) {
  dummy.position.set(999, 999, 999);
  dummy.scale.setScalar(0.001);
  dummy.updateMatrix();
  faces.setMatrixAt(index, dummy.matrix);
  for (let e = 0; e < edgesPerCube; e += 1) {
    edges.setMatrixAt(index * edgesPerCube + e, dummy.matrix);
  }
}

function updateCubes(delta, elapsed) {
  pointer.world.lerp(pointer.target, 1 - Math.exp(-10 * delta));

  let activeCount = 0;
  let influencedCount = 0;
  let maxRise = 0;

  for (let i = 0; i < cubeState.length; i += 1) {
    const cube = cubeState[i];
    if (!cube.active) {
      setHidden(i);
      continue;
    }

    activeCount += 1;
    cube.age += delta;
    const dx = cube.x - pointer.world.x;
    const dz = cube.z - pointer.world.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    const influenceTarget = pointer.active ? Math.max(0, 1 - distance / hoverRadius) : 0;
    const keyLift = Math.pow(influenceTarget, 2.6) * 1.38;
    const idle = reducedMotion ? 0 : Math.sin(elapsed * 1.2 + cube.seed * 11) * 0.035;
    const reveal = easeOutBack(Math.min(cube.age / 0.48, 1));

    cube.influence = smooth(cube.influence, influenceTarget, pointer.active ? 14 : 4.2, delta);
    cube.rise = smooth(cube.rise, keyLift, 16, delta);
    cube.scale = smooth(cube.scale, cube.targetScale, 10, delta);
    cube.life = pointer.active || cube.age < 3.8 ? smooth(cube.life, 1, 5, delta) : cube.life - delta * 0.075;

    if (cube.life <= 0) {
      cube.active = false;
      occupied.delete(cellKey(cube.gx, cube.gz));
      setHidden(i);
      continue;
    }

    if (cube.influence > 0.08) influencedCount += 1;
    maxRise = Math.max(maxRise, cube.rise);

    const fadeScale = THREE.MathUtils.smoothstep(cube.life, 0, 0.36);
    const scale = Math.max(0.001, cube.scale * Math.min(reveal, 1) * (1 - fadeScale * 0.3));
    const pulse = reducedMotion ? 0 : Math.sin(elapsed * 3 + cube.seed * 6) * cube.influence * 0.012;
    const y = cube.rise + idle;

    dummy.position.set(cube.x, fieldLift + y, cube.z);
    dummy.rotation.set(0, 0, 0);
    dummy.scale.setScalar(scale + pulse);
    dummy.updateMatrix();
    faces.setMatrixAt(i, dummy.matrix);

    const faceColor = palette.deep.clone().lerp(palette.shadow, 0.62 + cube.influence * 0.25);
    faceColor.lerp(palette.reflection, cube.influence * 0.12);
    faces.setColorAt(i, faceColor);

    const edgeColor = colorForCube(cube, cube.influence);
    const alphaScale = cube.life * Math.min(reveal, 1);
    for (let e = 0; e < edgesPerCube; e += 1) {
      edgeDummy.matrix.multiplyMatrices(dummy.matrix, localEdges[e]);
      edges.setMatrixAt(i * edgesPerCube + e, edgeDummy.matrix);
      edges.setColorAt(i * edgesPerCube + e, edgeColor.clone().multiplyScalar(0.9 + alphaScale * 0.74));
    }
  }

  faces.count = maxCubes;
  edges.count = maxCubes * edgesPerCube;
  faces.instanceMatrix.needsUpdate = true;
  edges.instanceMatrix.needsUpdate = true;
  if (faces.instanceColor) faces.instanceColor.needsUpdate = true;
  if (edges.instanceColor) edges.instanceColor.needsUpdate = true;

  window.__cubeHeroStats = {
    activeCount,
    influencedCount,
    maxRise: Number(maxRise.toFixed(3)),
    pointerActive: pointer.active,
  };
}

function resize() {
  const { innerWidth, innerHeight } = window;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;

  if (innerWidth < 720) {
    camera.position.set(5.1, 5.25, 6.2);
    camera.lookAt(0.22, 0.12, 0);
  } else {
    camera.position.set(6.1, 6.2, 6.9);
    camera.lookAt(0.2, 0.58, 0);
  }
  camera.updateProjectionMatrix();
}

function animate() {
  const delta = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.elapsedTime;
  glowMaterial.uniforms.uTime.value = elapsed;
  dots.rotation.y = Math.sin(elapsed * 0.08) * 0.035;
  dots.material.opacity = 0.48 + Math.sin(elapsed * 0.75) * 0.07;

  if (!document.hidden) {
    updateCubes(delta, elapsed);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);
}

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) clock.getDelta();
});

seedInitialField();
resize();
window.addEventListener("resize", resize, { passive: true });
animate();
