// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(0xf0f2f5, 1);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2.8;
controls.maxDistance = 50;



// Load real Earth textures from reliable CDN
const textureLoader = new THREE.TextureLoader();
const baseURL = 'https://unpkg.com/three-globe@2.34.0/example/img/';

const earthTexture = textureLoader.load(baseURL + 'earth-blue-marble.jpg');
const earthBumpMap = textureLoader.load(baseURL + 'earth-topology.png');
const earthSpecMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg');
const earthNightTexture = textureLoader.load(baseURL + 'earth-night.jpg');

// Main sunlight - bright and warm for light mode
const sunLight = new THREE.DirectionalLight(0xfff8f0, 4.0);
sunLight.position.set(15, 10, 15);
scene.add(sunLight);

// Fill light from the other side
const fillLight = new THREE.DirectionalLight(0xe8eeff, 1.5);
fillLight.position.set(-10, 5, 10);
scene.add(fillLight);

// Soft ambient so the whole globe is visible
const ambientLight = new THREE.AmbientLight(0xc8d0e0, 1.2);
scene.add(ambientLight);

// Subtle back rim light
const rimLight = new THREE.DirectionalLight(0xffffff, 1.0);
rimLight.position.set(-5, 0, -15);
scene.add(rimLight);



// Earth
const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
const earthMaterial = new THREE.MeshStandardMaterial({
  map: earthTexture,
  bumpMap: earthBumpMap,
  bumpScale: 0.04,
  roughness: 0.85,
  metalness: 0.05,
  emissiveMap: earthNightTexture,
  emissive: new THREE.Color(0x998866),
  emissiveIntensity: 0.15,
});

// Remove green tint from the earth day texture
earthTexture.colorSpace = THREE.SRGBColorSpace;
earthNightTexture.colorSpace = THREE.SRGBColorSpace;

earthMaterial.onBeforeCompile = (shader) => {
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <map_fragment>',
    `
    #include <map_fragment>
    // Black and white desaturated look
    float grey = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114));
    diffuseColor.rgb = vec3(grey);
    diffuseColor.rgb = pow(diffuseColor.rgb, vec3(0.9));
    `
  );
  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <emissivemap_fragment>',
    `
    #include <emissivemap_fragment>
    // Desaturated city lights
    float emGrey = dot(totalEmissiveRadiance.rgb, vec3(0.299, 0.587, 0.114));
    totalEmissiveRadiance.rgb = vec3(emGrey) * 0.7;
    `
  );
};
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.rotation.z = 0.0; // Remove tilt so planet appears centered
scene.add(earth);

// Fresnel rim effect layer
const fresnelGeometry = new THREE.SphereGeometry(2.02, 64, 64);
const fresnelMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec3 vWorldNormal;
    varying vec3 vViewDir;
    void main() {
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldNormal = normalize(mat3(modelMatrix) * normal);
      vViewDir = normalize(cameraPosition - worldPos.xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vWorldNormal;
    varying vec3 vViewDir;
    void main() {
      float fresnel = 1.0 - max(0.0, dot(vViewDir, vWorldNormal));
      fresnel = pow(fresnel, 3.5);
      vec3 rimColor = vec3(1.0, 1.0, 1.0);
      float alpha = fresnel * 0.85;
      gl_FragColor = vec4(rimColor, alpha);
    }
  `,
  transparent: true,
  depthWrite: false,
  side: THREE.FrontSide,
  blending: THREE.NormalBlending
});
const fresnelMesh = new THREE.Mesh(fresnelGeometry, fresnelMaterial);
earth.add(fresnelMesh);



// Atmosphere glow (shader)
const atmosphereGeometry = new THREE.SphereGeometry(2.15, 64, 64);
const atmosphereMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 worldPos = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPos.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    uniform vec3 uSunDirection;
    void main() {
      float viewDot = dot(vNormal, vec3(0.0, 0.0, 1.0));
      float intensity = pow(0.7 - viewDot, 2.5);
      float sunFacing = max(0.0, dot(normalize(vNormal), uSunDirection));
      float rimSun = pow(max(0.0, dot(normalize(vNormal), -uSunDirection)), 1.5);
      vec3 atmosphereColor = mix(
        vec3(0.08, 0.08, 0.12),
        vec3(0.15, 0.15, 0.2),
        rimSun * 0.7 + sunFacing * 0.3
      );
      float alpha = intensity * (0.5 + rimSun * 0.7 + sunFacing * 0.3);
      gl_FragColor = vec4(atmosphereColor, alpha);
    }
  `,
  uniforms: {
    uSunDirection: { value: new THREE.Vector3() }
  },
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
  transparent: true,
  depthWrite: false
});
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
earth.add(atmosphere);



// Camera position - will be animated in from far
camera.position.set(introEndCameraX, 0, introStartCameraZ);
controls.target.set(0, 0, 0);
controls.update();

// Clock
const clock = new THREE.Clock();

// ── Intro animation state ──────────────────────────────────────────────
let introComplete = false;
let introDuration = 3.2; // seconds
const introStartCameraZ = 18;
const introEndCameraZ = 6.893;
const introStartCameraX = 0;
const introEndCameraX = 2.28;

// Start camera far away
camera.position.set(introStartCameraX, 0, introStartCameraZ);
camera.position.set(introEndCameraX, 0, introStartCameraZ); // keep x, zoom in only

// ── Pulse rings ────────────────────────────────────────────────────────
const ringGroup = new THREE.Group();
scene.add(ringGroup);

function createPulseRing() {
  const geo = new THREE.RingGeometry(2.05, 2.12, 80);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x4488ff,
    transparent: true,
    opacity: 0,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  const ring = new THREE.Mesh(geo, mat);
  ring.rotation.x = Math.PI / 2;
  ring.userData = { born: -999, lifespan: 2.4, scale0: 1.0, scale1: 2.6 };
  ringGroup.add(ring);
  return ring;
}

const pulseRings = [createPulseRing(), createPulseRing(), createPulseRing()];
let lastRingSpawn = 0;
const ringSpawnInterval = 0.85;
let activeRingIdx = 0;

// ── Orbit trail (equatorial dashed ring) ──────────────────────────────
const orbitTrailGeo = new THREE.TorusGeometry(2.5, 0.003, 8, 180);
const orbitTrailMat = new THREE.MeshBasicMaterial({
  color: 0x88aaff,
  transparent: true,
  opacity: 0,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});
const orbitTrail = new THREE.Mesh(orbitTrailGeo, orbitTrailMat);
scene.add(orbitTrail);

// ── Floating particles ─────────────────────────────────────────────────
const PARTICLE_COUNT = 180;
const particleGeo = new THREE.BufferGeometry();
const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
const particleSpeeds = [];
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = 2.25 + Math.random() * 1.8;
  particlePositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
  particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
  particlePositions[i * 3 + 2] = r * Math.cos(phi);
  particleSpeeds.push({ speed: 0.02 + Math.random() * 0.04, phase: Math.random() * Math.PI * 2, r });
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
const particleMat = new THREE.PointsMaterial({
  color: 0x7aabff,
  size: 0.018,
  transparent: true,
  opacity: 0,
  sizeAttenuation: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// ── Subtle star field ──────────────────────────────────────────────────
const STAR_COUNT = 1200;
const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(STAR_COUNT * 3);
for (let i = 0; i < STAR_COUNT; i++) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const r = 80 + Math.random() * 60;
  starPos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
  starPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
  starPos[i * 3 + 2] = r * Math.cos(phi);
}
starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const starMat = new THREE.PointsMaterial({
  color: 0xaabbcc,
  size: 0.12,
  transparent: true,
  opacity: 0,
  sizeAttenuation: true,
  depthWrite: false
});
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// ── Easing helpers ─────────────────────────────────────────────────────
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
function easeInOutQuad(t) { return t < 0.5 ? 2*t*t : 1-Math.pow(-2*t+2,2)/2; }
function easeOutElastic(t) {
  const c4 = (2 * Math.PI) / 4.5;
  return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10*t) * Math.sin((t*10-0.75)*c4) + 1;
}

// UI overlay
const uiDiv = document.createElement('div');
uiDiv.style.cssText = `
  position: fixed;
  top: 20px;
  left: 20px;
  color: rgba(40,50,70,0.8);
  font-family: 'Inter', 'Segoe UI', sans-serif;
  font-size: 13px;
  pointer-events: none;
  z-index: 10;
  line-height: 1.6;
  letter-spacing: 0.3px;
`;
uiDiv.innerHTML = `
  <div style="font-size: 16px; font-weight: 600; margin-bottom: 6px; color: rgba(40,90,180,0.9);">🌍 Earth</div>
  <div style="color: rgba(40,50,70,0.4); font-size: 11px;">Drag to orbit · Scroll to zoom</div>
  <div id="info" style="margin-top: 10px; font-size: 11px; color: rgba(40,90,180,0.35);"></div>
`;
document.body.appendChild(uiDiv);

const infoEl = document.getElementById('info');

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();
  const delta = clock.getDelta ? 0.016 : 0.016; // fallback

  // ── Intro zoom-in ────────────────────────────────────────────────────
  let introT = Math.min(elapsed / introDuration, 1.0);
  const easedIntro = easeOutElastic(introT);

  if (!introComplete) {
    const camZ = introStartCameraZ + (introEndCameraZ - introStartCameraZ) * easeOutCubic(introT);
    camera.position.z = camZ;
    // Fade in earth scale
    earth.scale.setScalar(0.4 + 0.6 * easeOutCubic(introT));
    // Fade in stars
    starMat.opacity = Math.min(introT * 2.2, 0.55);
    // Fade in orbit trail
    orbitTrailMat.opacity = Math.max(0, (introT - 0.5) * 0.18);
    // Fade in particles
    particleMat.opacity = Math.max(0, (introT - 0.6) * 0.6);
    if (introT >= 1.0) {
      introComplete = true;
      earth.scale.setScalar(1.0);
    }
  } else {
    // Keep subtle star twinkle after intro
    starMat.opacity = 0.38 + Math.sin(elapsed * 0.3) * 0.05;
    orbitTrailMat.opacity = 0.07 + Math.sin(elapsed * 0.5 + 1.0) * 0.02;
    particleMat.opacity = 0.28 + Math.sin(elapsed * 0.4 + 0.5) * 0.06;
  }

  // ── Earth rotation - slow and dramatic ───────────────────────────────
  earth.rotation.y = elapsed * 0.08;





  // ── Particle drift ───────────────────────────────────────────────────
  const pPos = particleGeo.attributes.position.array;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const { speed, phase, r } = particleSpeeds[i];
    const angle = elapsed * speed + phase;
    // Slowly orbit particles around Y axis
    const baseTheta = phase * 2;
    pPos[i * 3]     = r * Math.cos(baseTheta + elapsed * speed) * (1.0 + 0.03 * Math.sin(elapsed * 0.5 + phase));
    pPos[i * 3 + 2] = r * Math.sin(baseTheta + elapsed * speed) * (1.0 + 0.03 * Math.sin(elapsed * 0.5 + phase));
    pPos[i * 3 + 1] += Math.sin(elapsed * 0.6 + phase) * 0.0004;
  }
  particleGeo.attributes.position.needsUpdate = true;

  // ── Pulse rings ───────────────────────────────────────────────────────
  if (introComplete && elapsed - lastRingSpawn > ringSpawnInterval) {
    const ring = pulseRings[activeRingIdx % pulseRings.length];
    ring.userData.born = elapsed;
    ring.rotation.x = Math.PI * 0.3 * (Math.random() - 0.5);
    ring.rotation.z = Math.PI * Math.random();
    activeRingIdx++;
    lastRingSpawn = elapsed;
  }
  pulseRings.forEach(ring => {
    const age = elapsed - ring.userData.born;
    const { lifespan, scale0, scale1 } = ring.userData;
    if (age >= 0 && age < lifespan) {
      const t = age / lifespan;
      const s = scale0 + (scale1 - scale0) * easeOutCubic(t);
      ring.scale.setScalar(s);
      ring.material.opacity = (1 - t) * 0.28 * (introComplete ? 1 : 0);
    } else {
      ring.material.opacity = 0;
    }
  });
  ringGroup.rotation.y = elapsed * 0.06;

  // ── Orbit trail gentle rotation ───────────────────────────────────────
  orbitTrail.rotation.z = elapsed * 0.04;
  orbitTrail.rotation.x = Math.PI / 2 + Math.sin(elapsed * 0.1) * 0.06;

  // ── Fresnel pulse ─────────────────────────────────────────────────────
  fresnelMaterial.opacity = 0.78 + Math.sin(elapsed * 1.1) * 0.07;

  // ── Update atmosphere sun direction ───────────────────────────────────
  const sunDir = new THREE.Vector3().copy(sunLight.position).normalize();
  atmosphereMaterial.uniforms.uSunDirection.value.copy(sunDir);





  // Update info
  const rotDeg = ((earth.rotation.y * 180 / Math.PI) % 360).toFixed(1);
  infoEl.textContent = `Rotation: ${rotDeg}° · Time: ${elapsed.toFixed(1)}s`;

  controls.update();
  renderer.render(scene, camera);
}
animate();

// Handle resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});