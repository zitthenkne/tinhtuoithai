# ANTI-SLOP & ANTI-AI DESIGN GUARDRAILS (GU-THAM-MY-FRONTEND)
> Mandatory constraints to eliminate generic AI templates, boilerplate aesthetics, and common LLM signatures.

---

## 1. THE ABSOLUTE EM-DASH BAN (RULE 9.G)
The em-dash character (`—`) and en-dash character (`–`) are COMPLETELY FORBIDDEN across the entire project:
- Banned in all headlines, subheadings, and section titles.
- Banned in eyebrows, badges, pills, buttons, tags, and micro-labels.
- Banned in clinical explanations, body copy, and tooltips.
- Banned in date ranges (use standard hyphen `2025-2026`, not en-dash).
- Banned in code comments and visible UI copy.

**Permitted alternatives:**
- Regular hyphen `-` (for compound words, mathematical subtractions, ranges).
- Sentence restructuring using periods `.`, colons `:`, or parentheses `(...)`.

*Any presence of `—` or `–` is an automatic failure of the code review.*

---

## 2. VISUAL, COLOR & SURFACE INTEGRITY (RULE 9.A)
- **No Pure Black (`#000000`):** Use deep oceanic slate depths such as `#0B111A` or `#0F172A`.
- **No Raw Harsh Neon:** Glows must be calibrated as subtle biological phosphorescence (`rgba(20, 184, 166, 0.25)`), anchored by a 1px structural glass rim (`rgba(255, 255, 255, 0.12)`).
- **No Oversaturated Accents:** Desaturate tones to blend seamlessly with neutral frosted glass substrates.
- **No Excessive Gradient Text:** Avoid multi-color rainbow gradient text on large headers. Use clean, crisp, high-contrast typography.
- **No Custom Mouse Cursors:** Keep native pointer behavior for optimal accessibility and performance.

---

## 3. TYPOGRAPHIC ARCHITECTURE (RULE 9.B)
- **Banned as Default:** Do NOT default to `Inter`. Use `Plus Jakarta Sans` or `Outfit` for geometric clarity and superior Vietnamese diacritics.
- **Tabular Figures for Data:** Use `JetBrains Mono` or `Fira Code` with `font-variant-numeric: tabular-nums` for all dates, gestational days, weeks, CRL values, and mathematical steps.
- **Controlled Hierarchy:** Scale is controlled through font weight, letter-spacing (`letter-spacing: -0.02em` on titles), and subtle color contrast, not raw monstrous font sizes.

---

## 4. LAYOUT & SPATIAL DISCIPLINE (RULE 9.C)
- **Strictly Banned:** The generic "Three Identical Cards" horizontal row.
- **Enforced Layout:** Asymmetric desktop split (45% interactive wheel console, 55% clinical reasoning and calculation dashboard).
- **Strict 4pt / 8pt Spatial Grid:** Gaps and paddings conform to multiples of 4px (`8px`, `12px`, `16px`, `24px`, `32px`).
- **Fluid Sizing:** Always use CSS `clamp()` for headings, wheel diameters, and card paddings.

---

## 5. COPYWRITING & AVOIDANCE OF AI TELLS (RULE 9.D & 9.F)
- **Banned AI Filler Verbs:** "Elevate", "Revolutionize", "Seamless", "Next-Gen", "Unleash". Use direct, concrete medical and engineering verbs ("Calculate", "Verify", "Rotate", "Arbitrate", "Enforce").
- **Banned Decorative Badges:** Do NOT place decorative version tags (`v2.0`, `BETA`, `v0.1`, `EARLY ACCESS`) in the hero header.
- **Banned Status Dots:** Do not place glowing colored dots before every navigation link or list item. Use dots strictly when conveying live semantic status.
- **Middle-Dot Rationing:** The middle-dot (`·`) is restricted to a maximum of 1 per line in metadata strips.
- **No Fake Product Divs:** Do not build fake mockups out of empty colored rectangles. Every visual dial and input must be a real, functioning, interactive element.

---

## 6. AFFORDANCES & USABILITY (DON NORMAN PRINCIPLES)
- **No Dead-End Errors:** When an error occurs (such as an unreliable LMP or an impossible CRL value), always provide an actionable recovery path (e.g., a one-click button to switch to Ultrasound CRL mode).
- **Touch Targets:** All clickable needles, buttons, and switches must have a minimum bounding box of 44x44px.
- **Reduced Motion Support:** Always provide a `@media (prefers-reduced-motion: reduce)` block that resets transitions and animations for vestibular safety.
