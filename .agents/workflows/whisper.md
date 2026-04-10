---
description: Project Whisper Initialization and Development Workflow
---

# Project Whisper Workflow

This workflow guides the implementation of Project Whisper based on the "soul" and "skeleton" blueprint.

## Phase 1: Foundational Setup (The Root)

// turbo

1. Define CSS variables in `src/styles/global.css` using the prescribed palette:
   - Base (Background): `#FDFDFB`
   - Text (Foreground): `#1A1A1A`
   - Accent: `#888888`
   - Whisper Glow: `rgba(255, 255, 255, 0.4)`
2. Configure `tailwind.config.mjs` with custom colors and typography (Serif for headings, Sans-Serif for body).
3. Update `src/layouts/BaseLayout.astro` to include global metadata, background color, and subtle noise texture.

## Phase 2: Asset & Data Preparation

// turbo

1. Create `src/components/Brand/Signature.tsx` using the pre-generated SVG signature.
2. Setup font preloading to prevent Flash of Unstyled Text (FOUT).
3. Define schemas in `src/content/config.ts`:
   - `inspirations`: JSON/YAML for fragmented thoughts.
   - `archive`: MDX for deep-dive articles.

## Phase 3: Module Implementation (Folder-as-a-Component)

// turbo

1. **Home**: `src/modules/Home/index.astro` - Immersive identity, self-drawing SVG signature.
2. **Inspiration**: `src/modules/Inspiration/index.astro` - Draggable cards on a Zero-Gravity Canvas using Framer Motion.
3. **Resume**: `src/modules/Resume/index.astro` - Vertical timeline with monologue tone.
4. **Archive**: `src/modules/Archive/index.astro` - Distraction-free, book-like editorial layout.

## Phase 4: Interactions & Polish

// turbo

1. Standardize motion across all components:
   - Ease: `cubic-bezier(0.2, 0.8, 0.2, 1)`
   - Duration: Micro-interactions (<300ms), Load transitions (1000ms-1500ms).
2. Ensure elements enter via opacity fade and y-axis shift.
3. Apply "Astro First" rule: Pure HTML/Zero-JS unless interaction is required (React Islands).
