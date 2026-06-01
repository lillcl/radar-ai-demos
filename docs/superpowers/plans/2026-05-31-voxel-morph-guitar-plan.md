# VoxelMorph Guitar — Implementation Plan

**Date:** 2026/05/31
**Spec:** `2026-05-31-voxel-morph-guitar-design.md`
**Output:** `index.html` + `scene.js` (standalone, no build step)
**Location:** `C:\Users\User\Documents\GitHub\test\docs\superpowers\plans\`

---

## 1. File Structure & Output Files

```
docs/superpowers/plans/2026-05-31-voxel-morph-guitar-plan.md   ← this file

C:\Users\User\Documents\GitHub\test\
  index.html            ← Shell: canvas container, UI panel, variation buttons, CSS
  scene.js              ← All logic as ES module (Three.js, TSL post-processing)
```

### index.html responsibilities
- Canvas container (full viewport height)
- Loading state ("Loading..." centered)
- UI panel with variation buttons (Acoustic / Electric / Bass)
- Import of `scene.js` as ES module
- All CSS (dark theme, button styles, layout)
- Three.js + addons CDN imports (r170+)
- TSL CDN imports

### scene.js responsibilities
- All logic per Section 3 of the design spec (Renderer → Animation Loop)

---

## 2. Guitar Voxel Definitions

### Category breakdown
| Category | Description |
|---|---|
| `body` | Main guitar body (largest voxel count) |
| `neck` | Fretboard and neck |
| `headstock` | Top peghead |
| `hardware` | Bridge, tuners, pickups (clearcoat materials) |
| `binding` | Decorative edge trim |

### Grid coordinate definitions

**Acoustic (variation 0):**
- Body: `10×7×2` rounded rectangle, soundhole center at `(5, 3.5, 0)`
- Neck: `3×8×1` voxels — extends from body top
- Headstock: `2×3×1` voxels — extends from neck top
- Color palette: primary `#8B5A2B`, secondary `#D2691E`, accent `#F5DEB3`

**Electric (variation 1):**
- Body: `10×6×1.5` angular offset double-cutaway
- Neck: `2×10×1` voxels (longer, thinner than acoustic)
- Headstock: `2×2×1` small angled
- Color palette: primary `#1a1a1a`, secondary `#C0C0C0`, accent `#FF4444`

**Bass (variation 2):**
- Body: `12×9×2.5` voxels (deeper body)
- Neck: `3×10×1` voxels
- Headstock: `3×3×1` (bigger headstock for 4-in-line tuners)
- Color palette: primary `#1E3A5F`, secondary `#4A90D9`, accent `#FFD700`

---

## 3. Implementation Order (All Systems)

Execute in this exact order:

```
1.  Renderer setup          — WebGPURenderer → WebGL fallback
2.  Environment             — Procedural sky gradient (TSL)
3.  Lighting                — 5-light setup (ambient, key, soft-shadow, fill, rim, accent)
4.  Voxel Builder           — createVoxel(), createCustomVoxel(), geometry cache, material presets
5.  Guitar Definition       — buildAcousticGuitar(), buildElectricGuitar(), buildBassGuitar()
6.  InstancedMesh Builder   — buildInstancedMeshes() — batch by category+geometry
7.  Instance Data           — instanceData Map: origPositions, offsets, randDirs per instance
8.  Variation Generator     — generateVariation0() (base), generateVariation1(), generateVariation2()
9.  Morph Controller        — startMorph(), updateMorph(), snapshotCurrentState()
10. Repulsion System        — updateRepulsion(): camera-facing raycast plane, breathing pulse
11. Particle Systems         — updateDust() (ambient), updateFallingLeaves() (confetti)
12. Post-Processing          — GTAO, SSR, Bloom via TSL MRT pipeline
13. UI Bindings             — Variation buttons, active state management
14. Animation Loop          — OrbitControls + per-frame updates
```

---

## 4. Key Constants & Values

| Constant | Value | Reference |
|---|---|---|
| `morphDuration` | `1800` ms | Spec Section 4: 1.8s cubic ease-in-out |
| `returnSpeed` | `2.5` | Spec Section 4: spring return speed |
| `settleDelay` | `0.08` s | Spec Section 4: mouse still → hit point freezes |
| `breathingAmplitude` | `±15%` | Spec Section 2: dual-frequency spatial sine pulse |
| `repulsionBlend` | `60% radial + 40% random scatter` | Spec Section 2 |
| `cameraTarget` | `(0, 5, 0)` | Spec Section 4: guitar center, no offset |
| `raycastPlaneNormal` | Camera-facing (NOT negated) | Spec Section 6 critical note #2 |
| `staggerSeed` | `variationData[0]` positions | Spec Section 6 critical note #3 |
| Bloom (Acoustic) | strength `0.5` | Spec Section 2 |
| Bloom (Electric) | strength `0.15` | Spec Section 2 |
| Bloom (Bass) | strength `0.25` | Spec Section 2 |

### Color Palettes (per variation)

| Variation | Primary | Secondary | Accent |
|---|---|---|---|
| 0 Acoustic | `#8B5A2B` | `#D2691E` | `#F5DEB3` |
| 1 Electric | `#1a1a1a` | `#C0C0C0` | `#FF4444` |
| 2 Bass | `#1E3A5F` | `#4A90D9` | `#FFD700` |

---

## 5. Review Indicator Checklist (verbatim from spec)

| Indicator | Expected Behavior |
|---|---|
| `controls.target` matches `camera.lookAt()` | Camera orbits guitar center |
| `raycaster.ray.direction` (not negated) | Repulsion works all angles |
| `variationData[0]` for stagger seed | Wave direction stable |
| `scenePass.setMRT(mrt({...}))` before GTAO/SSR | Post-processing works |
| `Set` dedup in variation generators | No vanishing voxels |
| `flatShading: true` on materials | Chunky voxel aesthetic |
| `polygonOffset` on materials | No z-fighting |
| Breathing pulse uses spatial phase only | No synchronized pulsing |
| `instanceData` populated before variation gen | Correct instance mapping |

---

## 6. Implementation Order for Frontend Developer

### Phase 1: Shell & Renderer
1. Create `index.html` with canvas container, loading state, CSS, CDN imports
2. Set up Three.js scene, camera, renderer (WebGPURenderer → WebGL fallback)
3. Configure `OrbitControls` with `target = (0, 5, 0)` and `camera.lookAt(0, 5, 0)`

### Phase 2: Environment & Lighting
4. Create procedural sky gradient via TSL
5. Set up 5-light rig: ambient, key, soft-shadow, fill, rim, accent

### Phase 3: Voxel & Guitar Construction
6. Build `createVoxel()` / `createCustomVoxel()` helper with geometry cache and material presets
7. Create `buildAcousticGuitar()`, `buildElectricGuitar()`, `buildBassGuitar()` functions
8. Build `buildInstancedMeshes()` — batch by category+geometry
9. Initialize `instanceData` Map with origPositions, offsets, randDirs per instance

### Phase 4: Variation & Morph
10. Implement `generateVariation0()` (base acoustic), `generateVariation1()`, `generateVariation2()`
11. Build `startMorph()`, `updateMorph()`, `snapshotCurrentState()` — 1.8s cubic ease-in-out wave, stagger outside→inside using `variationData[0]` as seed

### Phase 5: Interaction & Animation
12. Build `updateRepulsion()` — camera-facing raycast plane (NOT negated), repulsion with 60% radial + 40% scatter, settle after 0.08s mouse idle, spring return at `returnSpeed = 2.5`
13. Implement breathing: dual-frequency spatial sine pulse, ±15% amplitude, spatial phase (no synchronized pulsing)

### Phase 6: Particles
14. Build `updateDust()` — ambient drift particles
15. Build `updateFallingLeaves()` — confetti tumbling from above, palette per variation

### Phase 7: Post-Processing & UI
16. Configure MRT pipeline: `scenePass.setMRT(mrt({...}))` before GTAO/SSR
17. Add GTAO (subtle contact shadows), SSR (reflective highlights), Bloom (lerped strength 0.5/0.15/0.25)
18. Add ACES Filmic tone mapping
19. Build UI: variation buttons with `.active` class, click handlers, mid-morph chaining

### Phase 8: Final Integration
20. Animation loop — `requestAnimationFrame` with `updateMorph()`, `updateRepulsion()`, `updateDust()`, `updateFallingLeaves()`
21. Verify all review indicators pass
22. Test all checkpoints from Section 7 of spec

---

## 7. Scene.js File Sections (detailed)

| Section | Key Functions | Notes |
|---|---|---|
| Renderer | WebGPURenderer, WebGL fallback | No camera offset — guitar at world origin |
| Environment | Procedural sky gradient TSL | Graceful fallback if Polyhaven unavailable |
| Lighting | 5-light setup | Ambient + key + soft-shadow + fill + rim + accent |
| Voxel Builder | `createVoxel()`, `createCustomVoxel()` | `flatShading: true`, `polygonOffset` |
| Guitar Definition | `buildAcousticGuitar()`, `buildElectricGuitar()`, `buildBassGuitar()` | Dedup with `Set` |
| InstancedMesh Builder | `buildInstancedMeshes()` | Batch by category+geometry |
| Instance Data | `instanceData` Map | `origPositions`, `offsets`, `randDirs` |
| Variation Generator | `generateVariation0/1/2()` | `variationData[0]` as stagger seed |
| Morph Controller | `startMorph()`, `updateMorph()`, `snapshotCurrentState()` | 1.8s, cubic ease-in-out |
| Repulsion System | `updateRepulsion()` | Camera-facing raycast plane, NOT negated |
| Particle Systems | `updateDust()`, `updateFallingLeaves()` | Palette per variation, no spawning inside geometry |
| Post-Processing | GTAO, SSR, Bloom via TSL MRT | `scenePass.setMRT(mrt({...}))` first |
| UI Bindings | Variation buttons, active state | Mid-morph click chains smoothly |
| Animation Loop | `requestAnimationFrame` + OrbitControls + per-frame updates | `controls.target = (0, 5, 0)` |

---

## 8. Verification Checkpoints (from Spec Section 7)

### Section 2 (Voxel Object)
- [ ] Guitar centered on screen, no offset
- [ ] Orbit around true center (not wobbling)
- [ ] No console errors

### Section 3 (Morph)
- [ ] Wave travels outside→inside (not random jump)
- [ ] Mid-morph click chains smoothly
- [ ] Bloom lerps between variations
- [ ] Color transitions smooth

### Section 4 (Repulsion)
- [ ] Voxels burst on mouse hover
- [ ] Spring back on mouse leave
- [ ] Works from front, side, top, back (any angle)
- [ ] Stable settle after 0.08s mouse idle

### Section 5 (Particles)
- [ ] Dust motes drift with warm glow
- [ ] Confetti falls and tumbles
- [ ] Particle colors match current variation palette
- [ ] No particles spawning inside geometry

### Section 6 (Environment)
- [ ] Warm ambient + soft shadows
- [ ] Sky gradient renders procedurally
- [ ] HDR loads if Polyhaven accessible (graceful fallback)

### Section 7 (Post-Processing)
- [ ] GTAO adds subtle contact shadows
- [ ] SSR adds reflective highlights
- [ ] Bloom on bright areas
- [ ] Adaptive quality on camera closer/farther

---

*Plan ready for frontend-dev*