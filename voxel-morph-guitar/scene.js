// ============================================================================
// VOXEL MORPH GUITAR - Complete Three.js Implementation
// ============================================================================

let scene, camera, renderer, voxels = [], raycaster, mouse;
let currentVariation = 0;
let targetVariation = 0;
let morphProgress = 1;
let hoveredVoxel = null;

const guitarDefinitions = {
  acoustic: [
    // Body - disc
    ...buildDisc(0, 3, 0, 4, 3, 1, 'body'),
    // Neck
    ...buildBox(-1, 1, 6, 15, 0, 0, 'neck'),
    // Headstock
    ...buildBox(-1, 1, 16, 18, 0, 0, 'headstock'),
    // Hardware - bridge
    ...buildBox(-1, 1, 1, 1, 0, 0, 'hardware', true),
    // Binding
    ...buildBox(-4, 4, 6, 6, 1, 1, 'binding'),
    ...buildBox(-4, 4, 0, 0, 1, 1, 'binding')
  ],
  electric: [
    // Body
    ...buildBox(-2, 2, 0, 4, 0, 0, 'body'),
    ...buildBox(-4, -2, 4, 5, 0, 0, 'body'),
    ...buildBox(-4, -2, -1, 1, 0, 0, 'body'),
    // Neck
    ...buildBox(-1, 0, 5, 15, 0, 0, 'neck'),
    // Headstock
    ...buildBox(-1, 0, 16, 18, 0, 0, 'headstock'),
    // Hardware - bridge + pickups
    ...buildBox(-1, 1, 0, 0, 0, 0, 'hardware', true),
    ...buildBox(-1, 0, 2, 2, 0, 0, 'hardware', true),
    ...buildBox(-1, 0, 3, 3, 0, 0, 'hardware', true)
  ],
  bass: [
    // Body - larger disc
    ...buildDisc(0, 4, 0, 5, 3, 1, 'body'),
    // Neck
    ...buildBox(-1, 1, 7, 17, 0, 0, 'neck'),
    // Headstock
    ...buildBox(-1, 1, 18, 21, 0, 0, 'headstock'),
    // Hardware
    ...buildBox(-2, 2, 1, 1, 0, 0, 'hardware', true),
    ...buildBox(-1, 1, 4, 4, 0, 0, 'hardware', true)
  ]
};

const categoryColors = {
  body: 0x8B5A2B,
  neck: 0xDEB887,
  headstock: 0x4a3728,
  hardware: 0xC0C0C0,
  binding: 0xFFFFFF
};

function buildBox(x1, x2, y1, y2, z1, z2, category, isPhysical = false) {
  const voxels = [];
  for (let x = x1; x <= x2; x++) {
    for (let y = y1; y <= y2; y++) {
      for (let z = z1; z <= z2; z++) {
        voxels.push({ x, y, z, category, isPhysical });
      }
    }
  }
  return voxels;
}

function buildDisc(cx, cy, cz, rx, ry, rz, category, isPhysical = false) {
  const voxels = [];
  for (let x = cx - rx - 1; x <= cx + rx + 1; x++) {
    for (let y = cy - ry - 1; y <= cy + ry + 1; y++) {
      for (let z = cz - rz - 1; z <= cz + rz + 1; z++) {
        const dx = (x - cx) / rx;
        const dy = (y - cy) / ry;
        const dz = (z - cz) / rz;
        if (dx * dx + dy * dy + dz * dz <= 1.05) {
          voxels.push({ x, y, z, category, isPhysical });
        }
      }
    }
  }
  return voxels;
}

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a0f);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 10, 40);
  camera.lookAt(0, 5, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  document.getElementById('app').appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 20, 10);
  scene.add(directionalLight);

  const backLight = new THREE.DirectionalLight(0x4444ff, 0.3);
  backLight.position.set(-10, 10, -10);
  scene.add(backLight);

  buildVoxels(0);

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  window.addEventListener('resize', onWindowResize);
  window.addEventListener('mousemove', onMouseMove);

  document.querySelectorAll('.variation-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const variation = parseInt(btn.dataset.variation);
      setVariation(variation);
    });
  });

  setTimeout(() => {
    document.getElementById('loading').classList.add('hidden');
  }, 500);

  animate();
}

function buildVoxels(variationIndex) {
  // Clear existing voxels
  voxels.forEach(v => scene.remove(v.mesh));
  voxels = [];

  const names = ['acoustic', 'electric', 'bass'];
  names.forEach((name, i) => {
    const voxelData = guitarDefinitions[name];
    voxelData.forEach(v => {
      const geometry = new THREE.BoxGeometry(0.95, 0.95, 0.95);
      const material = new THREE.MeshPhongMaterial({
        color: categoryColors[v.category],
        shininess: v.isPhysical ? 100 : 30,
        emissive: 0x000000,
        transparent: true,
        opacity: i === variationIndex ? 1 : 0
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(v.x, v.y, v.z);
      mesh.userData = { category: v.category, variation: i };
      scene.add(mesh);
      voxels.push({ mesh, ...v, variation: i });
    });
  });
}

function setVariation(index) {
  targetVariation = index;
  morphProgress = 0;

  document.querySelectorAll('.variation-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === index);
  });
}

let cameraAngle = 0;

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const meshes = voxels.filter(v => v.variation === targetVariation).map(v => v.mesh);
  const intersects = raycaster.intersectObjects(meshes);

  if (intersects.length > 0) {
    const obj = intersects[0].object;
    if (hoveredVoxel !== obj) {
      if (hoveredVoxel) {
        hoveredVoxel.material.emissive.setHex(0x000000);
        hoveredVoxel.scale.set(1, 1, 1);
      }
      hoveredVoxel = obj;
      hoveredVoxel.material.emissive.setHex(0x333333);
      hoveredVoxel.scale.set(1.15, 1.15, 1.15);
    }
    document.body.style.cursor = 'pointer';
  } else {
    if (hoveredVoxel) {
      hoveredVoxel.material.emissive.setHex(0x000000);
      hoveredVoxel.scale.set(1, 1, 1);
      hoveredVoxel = null;
    }
    document.body.style.cursor = 'default';
  }
}

function animate() {
  requestAnimationFrame(animate);

  // Smooth camera orbit
  cameraAngle += 0.005;
  camera.position.x = Math.sin(cameraAngle) * 35;
  camera.position.z = Math.cos(cameraAngle) * 35;
  camera.position.y = 10 + Math.sin(cameraAngle * 0.5) * 5;
  camera.lookAt(0, 5, 0);

  // Morph opacity
  if (morphProgress < 1) {
    morphProgress += 0.04;
    if (morphProgress > 1) morphProgress = 1;

    voxels.forEach(v => {
      const targetOpacity = v.variation === targetVariation ? 1 : 0;
      const current = v.mesh.material.opacity;
      v.mesh.material.opacity = current + (targetOpacity - current) * 0.12;
    });
  }

  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();