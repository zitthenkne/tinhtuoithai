# DESIGN SYSTEM: CHRONO-OBSTETRIX
> Visual Architecture: Frutiger Aero meets Bio-Luminescent Clinical Precision. Zero generic AI slop. Fully compliant with Google Stitch specifications.

---

## 1. VISUAL THEME & ATMOSPHERE
Chrono-Obstetrix synthesizes the optimistic, crystal-clear translucency of Frutiger Aero with high-stakes obstetrical and embryological diagnostic precision. The interface evokes an advanced clinical console: multi-layered frosted acrylic glass, water-surface caustics, and subtle biological phosphorescence.

Surfaces breathe with faint bioluminescent pulses in oceanic teal and embryonic rose rather than flat opaque fills. Physicality is enforced through optical glass refraction (`backdrop-filter: blur(24px) saturate(160%)`), subtle top-edge rim reflections (`inset 0 1px 1px rgba(255, 255, 255, 0.25)`), and spring-damped rotational mechanics on the dual-ring wheel.

---

## 2. THREE-TIER CSS DESIGN TOKENS ARCHITECTURE

### Tier 1: Primitive Tokens (Foundational Values)
```css
:root {
  /* Chromatic Primitives: Luminous Sea & Embryonic Rose */
  --primitive-teal-50: #E6FFFA;
  --primitive-teal-100: #B2F5EA;
  --primitive-teal-300: #4FD1C5;
  --primitive-teal-400: #2DD4BF;
  --primitive-teal-500: #14B8A6;
  --primitive-teal-600: #0D9488;
  --primitive-teal-900: #042F2E;

  --primitive-rose-50: #FFF1F2;
  --primitive-rose-200: #FECDD3;
  --primitive-rose-400: #FB7185;
  --primitive-rose-500: #F43F5E;
  --primitive-rose-900: #4C0519;

  --primitive-cyan-400: #22D3EE;
  --primitive-amber-400: #FBBF24;
  --primitive-emerald-400: #34D399;

  /* Neutral Depths: Frosted Substrates (NO PURE BLACK) */
  --primitive-slate-950: #0B111A;
  --primitive-slate-900: #0F172A;
  --primitive-slate-800: #1E293B;
  --primitive-slate-700: #334155;
  --primitive-slate-400: #94A3B8;
  --primitive-slate-200: #E2E8F0;
  --primitive-white: #FFFFFF;

  /* Spatial & Metric Primitives (4pt/8pt Grid) */
  --primitive-space-1: 0.25rem;  /* 4px */
  --primitive-space-2: 0.5rem;   /* 8px */
  --primitive-space-3: 0.75rem;  /* 12px */
  --primitive-space-4: 1rem;     /* 16px */
  --primitive-space-6: 1.5rem;   /* 24px */
  --primitive-space-8: 2rem;     /* 32px */
  --primitive-space-12: 3rem;    /* 48px */

  /* Radius Primitives */
  --primitive-radius-sm: 0.375rem; /* 6px */
  --primitive-radius-md: 0.75rem;  /* 12px */
  --primitive-radius-lg: 1.25rem;  /* 20px */
  --primitive-radius-full: 9999px;

  /* Physics & Animation Curves */
  --ease-spring: cubic-bezier(0.19, 1, 0.22, 1);
  --ease-elastic: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

### Tier 2: Semantic Tokens (Role-Based Variables)
```css
:root {
  /* Surfaces */
  --surface-canvas: var(--primitive-slate-950);
  --surface-card: rgba(15, 23, 42, 0.75);
  --surface-card-hover: rgba(30, 41, 59, 0.85);
  --surface-glass-highlight: rgba(255, 255, 255, 0.12);
  --surface-interactive-active: rgba(20, 184, 166, 0.16);

  /* Typography Colors */
  --text-primary: var(--primitive-white);
  --text-secondary: var(--primitive-slate-400);
  --text-accent-biolum: var(--primitive-teal-300);
  --text-accent-embryo: var(--primitive-rose-400);
  --text-warning: var(--primitive-amber-400);
  --text-success: var(--primitive-emerald-400);

  /* Borders & Structural Optical Lines */
  --border-subtle: rgba(226, 232, 240, 0.12);
  --border-focus: var(--primitive-teal-400);
  --border-error: var(--primitive-rose-500);

  /* Calibrated Phosphorescent Glows (NO RAW NEON) */
  --glow-teal: 0 0 24px rgba(20, 184, 166, 0.30);
  --glow-rose: 0 0 24px rgba(244, 63, 94, 0.30);
  --glow-subtle-rim: inset 0 1px 1px rgba(255, 255, 255, 0.25);
}
```

### Tier 3: Component Tokens
```css
:root {
  /* Dual-Ring Pregnancy Wheel */
  --wheel-diameter: clamp(320px, 44vw, 560px);
  --wheel-outer-track: #132032;
  --wheel-inner-disc: rgba(15, 23, 42, 0.94);
  --wheel-needle-lmp: var(--primitive-rose-500);
  --wheel-needle-edd: var(--primitive-teal-400);
  --wheel-tick-month: rgba(255, 255, 255, 0.85);
  --wheel-tick-day: rgba(255, 255, 255, 0.20);

  /* Console & Stepper Cards */
  --card-radius: var(--primitive-radius-lg);
  --btn-radius: var(--primitive-radius-full);
  --font-display: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

---

## 3. TYPOGRAPHIC ARCHITECTURE & SCALE
- **Titles & Display:** `Plus Jakarta Sans` - Track-tight (`letter-spacing: -0.02em`), geometric, clean.
- **Clinical Explanations & Body:** `Plus Jakarta Sans` - Line-height `1.6`, max line-length `65ch`.
- **Numerical Data & Dates:** `JetBrains Mono` - `font-variant-numeric: tabular-nums` for precise alignment during live wheel spin.

### Fluid Scale Definitions:
- Hero Title: `font-size: clamp(1.75rem, 2.5vw + 1rem, 2.5rem);`
- Section Heading: `font-size: clamp(1.25rem, 1.5vw + 0.75rem, 1.75rem);`
- Card Title: `font-size: clamp(1rem, 1vw + 0.5rem, 1.25rem);`
- Body Text: `font-size: clamp(0.875rem, 0.25vw + 0.8rem, 1rem);`
- Monospace Data: `font-size: clamp(0.75rem, 0.2vw + 0.65rem, 0.8125rem); font-family: var(--font-mono);`

---

## 4. LAYOUT ARCHITECTURE
- **Desktop (>= 1024px):** Asymmetric Split
  - Sticky Left Viewport (45% width): Dual-Ring Pregnancy Wheel with rotation angle readout and quick-sync action bar.
  - Scrollable Right Viewport (55% width): Clinical Mode Switcher, Input Form, Hero Metrics Card, Step-by-Step Reasoner, and OSCE Station 1 Rubric.
- **Mobile (< 1024px):** Single-column stacked layout with collapsible wheel drawer and touch-optimized controls.
