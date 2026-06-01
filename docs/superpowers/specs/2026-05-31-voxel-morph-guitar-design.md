# VoxelMorph Guitar — Design Specification

**Date:** 2026/05/31
**Status:** Approved
**Output:** `index.html` + `scene.js` (standalone, no build step)

---

## 1. Concept & Vision

A cinematic 3D voxel guitar that morphs between three distinct instrument types — Acoustic, Electric, and Bass — with a traveling wave animation. Hovering the mouse causes voxels to burst outward and spring back. When idle, each voxel gently breathes. The scene floats in a warm, particle-filled atmosphere with cinematic post-processing.

**Feel:** Museum-display quality. The guitar is an artifact you examine from all angles. Morphing reveals it as a living, reactive object.

---

## 2. Design Language

### Aesthetic Direction
Low-poly voxel with flat shading. Physical-material highlights on smooth surfaces. Inspired by wooden instrument craft combined with digital art installation aesthetics.

### Color Palettes

| Variation | Primary | Secondary | Accent |
|---|---|---|---|
| **Acoustic** | `#8B5A2B` (warm brown) | `#D2691E` (saddle brown) | `#F5DEB3` (wheat/cream) |
| **Electric** | `#1a1a1a` (near black) | `#C0C0C0` (chrome) | `#FF4444` (pickup red) |
| **Bass** | `#1E3A5F` (deep navy) | `#4A90D9` (metallic blue) | `#FFD700` (hardware gold) |

### Post-Processing
- Bloom: strength 0.5/0.15/0.25 per variation (lerped during morph)
- GTAO: subtle contact shadows in crevices
- SSR: reflective highlights on smooth surfaces
- ACES Filmic tone mapping

### Motion Philosophy
- **Morph wave**: staggered cubic ease-in-out, outside→inside, 1.8s duration
- **Repulsion**: cubic falloff, radial 60% + random scatter 40%, spring return
- **Breathing**: dual-frequency spatial sine pulse, ±15% amplitude
- **Particles**: slow ambient drift + tumbling confetti fall

---

## 3. Architecture

```
index.html          ← Shell: canvas container, UI panel, variation buttons
scene.js            ← All logic as ES module
```

### Guitar Voxel Structure

**Categories:**
- `body` — main guitar body (largest voxel count)
- `neck` — fretboard and neck
- `headstock` — top peghead
- `hardware` — bridge, tuners, pickups (clearcoat materials)
- `binding` — decorative edge trim

**Shape Definitions (grid coordinates):**

*Acoustic (variation 0):*
- Body: rounded rectangle ~10×7×2 voxels, soundhole center
- Neck: 3×8×1 voxels
- Headstock: 2×3×1 voxels

*Electric (variation 1):*
- Body: angular offset double-cutaway ~10×6×1.5 voxels
- Neck: 2×10×1 voxels (longer, thinner)
- Headstock: 2×2×1 (small angled)

*Bass (variation 2):*
- Body: larger ~12×9×2.5 voxels (deeper body)
- Neck: 3×10×1 voxels
- Headstock: 3×3×1 (bigger headstock for 4-in-line tuners)

### File Structure (scene.js)

| Section | Functionality |
|---|---|
| Renderer | WebGPURenderer → WebGL fallback |
| Environment | Procedural sky gradient (TSL) |
| Lighting | 5-light setup (ambient, key, soft-shadow, fill, rim, accent) |
| Voxel Builder | `createVoxel()`, `createCustomVoxel()`, geometry cache, material presets |
| Guitar Definition | Three procedural functions: `buildAcousticGuitar()`, `buildElectricGuitar()`, `buildBassGuitar()` |
| InstancedMesh Builder | `buildInstancedMeshes()` — batch by category+geometry |
| Instance Data | `instanceData` Map — origPositions, offsets, randDirs per instance |
| Variation Generator | `generateVariation0()` (base), `generateVariation1()`, `generateVariation2()` |
| Morph Controller | `startMorph()`, `updateMorph()`, `snapshotCurrentState()` |
| Repulsion System | `updateRepulsion()` — camera-facing raycast plane, breathing pulse |
| Particle Systems | `updateDust()` (ambient), `updateFallingLeaves()` (confetti, palette per variation) |
| Post-Processing | GTAO, SSR, Bloom via TSL MRT pipeline |
| UI Bindings | Variation buttons, active state |
| Animation Loop | OrbitControls + per-frame updates |

---

## 4. Features & Interactions

### Morph Button
- Click → morphs to target variation with 1.8s cubic ease-in-out wave
- Button gets `.active` class during its variation
- Clicking current variation does nothing
- Mid-morph click → chains smoothly (captures current state as base)

### Mouse Repulsion
- Hover near guitar → voxels burst outward from mouse position
- Works from ANY camera angle (camera-facing raycast plane)
- Mouse still 0.08s → hit point freezes (settles jitter)
- Mouse leave → spring return at `returnSpeed = 2.5`

### Breathing Pulse
- Each voxel oscillates at its own frequency (spatial phase from world position)
- Amplitude proportional to falloff (voxels closer to mouse breathe more when repelled)

### Idle State
- No mouse interaction + no morph → gentle breathing animation
- Dust motes drift through scene
- Falling confetti tumbles from above

### Camera
- OrbitControls with damping
- Target: `(0, 5, 0)` (guitar center)
- No `setViewOffset` — orbits true center from any angle

---

## 5. Component Inventory

### Variation Button
- Default: dark background, light text, subtle border
- Active: accent-colored background, scale 1.02
- Hover: brightness increase, cursor pointer
- Layout: horizontal row, centered above canvas

### Canvas Container
- Full viewport height
- Minimal padding around UI panel
- UI panel: fixed bottom or floating bottom-center

### Loading State
- Simple centered text "Loading..." before renderer init completes

---

## 6. Technical Approach

### Framework
- Vanilla Three.js r170+ (ES module from CDN)
- WebGPURenderer with WebGL1 fallback
- No build tools, no npm — runs from `index.html` directly

### Key Dependencies (CDN)
- `three` (WebGPURenderer, InstancedMesh, materials, lights, controls)
- `three/addons/controls/OrbitControls.js`
- `three/addons/loaders/RGBELoader.js`
- TSL post-processing: `GTAONode`, `DenoiseNode`, `SSRNode`, `BloomNode`

### Critical Implementation Notes

1. **No camera offset**: guitar at world origin, `controls.target = (0, 5, 0)`, `camera.lookAt(0, 5, 0)`
2. **Raycast plane normal**: points TOWARD camera (NOT negated) — ensures intersection from all angles
3. **Stagger from base only**: `variationData[0]` positions seed stagger phase — never live positions
4. **MRT required**: `scenePass.setMRT(mrt({...}))` before GTAO/SSR creation
5. **Dedup on morph**: use `Set` in variation generators to prevent duplicate grid positions

---

## 7. Verification Checklist

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

## 8. Review Indicators (For Code Reviewer)

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

*End of spec*