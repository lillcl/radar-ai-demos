# Cubes-Hover — Hero Demo Design

> Spec date: 2026-06-03
> Status: Approved (user-provided spec)
> Folder: `cubes-hover/` (existing empty directory; original spec said `hover-cube-hero/`, user corrected)

## Goal

A standalone immersive landing hero where animated isometric cubes appear dynamically around the pointer on hover. Cubes feel dimensional, energetic, tactile, with textured transitions, subtle mist/noise, and pointer-reactive motion.

## Palette (CSS custom properties)

```
--deep-background: #1C2420
--shadow-layer:    #2D3733
--ambient-mist:    #4D5D57
--cyan-core:       #A6DBDC
--cyan-secondary:  #89BCBD
--white-highlight: #F8FCFC
--electric-green:  #00FF5A
--neon-green:      #23E85F
--acid-green:      #4CFF6A
--green-reflection:#71C980
```

Background must be `#1C2420` (not pure black). Cube field blends cyan energy with green vortex highlights — biological/atmospheric, not generic neon.

## Files to Create

- `cubes-hover/index.html`
- `cubes-hover/scene.js`

## Page Structure

First viewport layout:

- Fixed top nav
- Asymmetric hero copy on the lower-left
- WebGL cube field centered/right
- Small supporting copy and CTAs on the lower-right
- Subtle next-section hint below the fold
- Avoid marketing-card layout — the experience itself is the first screen

## Visual Direction

Dark atmospheric energy grid. Background layers:

- Base fill: `#1C2420`
- Radial fog patches: `#2D3733` and `#4D5D57`
- Fixed grain/noise overlay
- Faint perspective floor dots or scan particles
- Soft cyan-green energy haze behind cube cluster

### Cube styling

- Isometric/voxel cube forms
- Dark top faces using `#1C2420` / `#2D3733`
- Side faces using muted cyan/green reflections
- Edge strokes in `#A6DBDC`, `#23E85F`, `#4CFF6A`
- Small white-hot accents using `#F8FCFC`
- No default blue/purple glow

## Interaction Plan

### Pointer behavior

- User moves over hero → cube spawn zone follows pointer
- Cubes appear in staggered clusters around pointer
- Existing cubes gently shift, rotate, breathe
- On pointer leave: cubes decay gradually (no instant disappear)

### Cube lifecycle

- **Birth:** scale 0.2 → 1, opacity 0 → 1
- **Settle:** slight bounce / easing into grid position
- **Idle:** subtle vertical float
- **Hover influence:** nearby cubes rise and brighten
- **Decay:** fade, shrink, dissolve through noise/texture
- Motion: transforms and opacity only

## Three.js Scene

### Core objects

- `Scene`, `PerspectiveCamera`, `WebGLRenderer`
- `InstancedMesh` for cubes
- Custom material or face-colored cube materials
- Optional particle field using `BufferGeometry`

### Why InstancedMesh

- Many cubes animate without per-cube draw calls
- Better performance on desktop and mobile
- Easier per-frame transform updates

### Scene setup

- Perspective camera with isometric feel
- Camera angled down toward cube grid
- Cube cluster slightly above hero center
- Pointer ray mapped to a virtual plane
- Cube spawning based on pointer position

### Cube Generation

- Logical grid: `(gridX, gridY) → (worldX, worldZ)`, `height → worldY`
- Spawn rules:
  - Sample pointer position every few frames
  - Convert pointer position to grid coords
  - Create 3-7 cubes around that coord
  - Avoid duplicate cubes in the same grid cell
  - Cap total cubes (90-140)
  - Recycle oldest inactive cubes
- Cluster shape: slightly diagonal/isometric, random gaps, varied heights, pointer-near cubes rise more strongly

### Textured Transition

- Start with performant Three.js geometry/materials
- Add lightweight shader or canvas texture if performance remains clean
- Cube faces receive slight brightness randomness
- Edges stronger when cube is newly spawned or pointer-near

### Lighting

- Ambient light using `#4D5D57`
- Directional light for cube face definition
- Rim-like cyan/green edge material
- Bloom only if postprocessing does not hurt performance
- If bloom: subtle, applied mainly to cube edges and particles, don't wash out palette

## UI

### Hero copy

- Headline: "We're Building / Cool Experiences"
- Supporting line: "Crafting immersive digital stories with kinetic systems, spatial interfaces, and responsive motion."

### Nav

- Home, Cases, Library, Resources
- CTA: "Let's Talk"

### CTA buttons

- Primary: "Get Started"
- Secondary: "Contact Us"
- Small icon button (plus or arrow)

### Typography

- Display: Satoshi, Geist, Outfit, or similar (no serif)
- Mono for small labels
- No emoji
- No gradient text

## Responsive

- **Desktop:** fixed top nav, cube scene center/right, hero copy lower-left, CTAs lower-right
- **Tablet:** cube scene central, text moves slightly higher, CTAs stack cleanly
- **Mobile:** single-column, cube scene behind/above copy, reduce cube count, reduce particles, disable heavy bloom/postprocessing, `min-height: 100dvh` (not `h-screen`)

## Performance Targets

- 60fps desktop, stable mobile
- Animate only transform/opacity
- `requestAnimationFrame` loop
- `InstancedMesh` for cubes
- Cap cube count
- Pause animation when tab hidden
- Resize renderer with `devicePixelRatio` capped at ~1.5
- `prefers-reduced-motion` → reduce spawning and idle animation

## Implementation Steps

1. Create `cubes-hover/index.html` with semantic hero markup, nav, CTAs, canvas container
2. Create `cubes-hover/scene.js` initializing Three.js renderer, camera, scene, resize handling
3. Build cube instancing system
4. Add pointer tracking and grid mapping
5. Add cube spawn/recycle lifecycle
6. Add hover influence calculations
7. Add particles/floor dots using the supplied palette
8. Add CSS atmosphere: mist, grain, typography, responsive layout
9. Add reduced-motion behavior
10. Run locally and verify in browser
11. Check desktop and mobile screenshots
12. Tune cube count, colors, contrast, spacing

## Acceptance Criteria

- [ ] Cubes appear dynamically on hover
- [ ] Cubes animate in with visible transition texture or dissolve-like feel
- [ ] Pointer motion affects cube height, brightness, and/or drift
- [ ] Scene uses the provided green/cyan palette
- [ ] Page background is `#1C2420` (not pure black)
- [ ] No purple/blue default glow aesthetic
- [ ] UI text does not overlap on mobile
- [ ] Canvas is nonblank and correctly framed
- [ ] Performance remains smooth with capped cube count
- [ ] Reduced-motion users get a clean static or low-motion version
