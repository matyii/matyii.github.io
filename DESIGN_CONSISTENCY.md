# Design Consistency Guide

This document is the single source of truth for visual, interaction, and engineering consistency across future sessions.

Use this guide as an operating manual, not inspiration notes.

## 1. Product Intent

- Build a premium, minimal, developer-focused portfolio.
- Dark mode is the primary visual experience.
- Light mode is fully supported and must not feel like a fallback.
- Keep all existing features functional while improving visual and UX quality.
- Prioritize clarity, structure, speed, and maintainability over decoration.

## 2. Non-Negotiables

- Never ship low-contrast text in either theme.
- Never add heavy animation or visual noise.
- Never break route behavior, API contracts, or JSON-driven content flows.
- Never introduce duplicate design patterns for the same UI problem.
- Never regress keyboard accessibility.

## 3. Design System Principles

- Visual hierarchy first: every section must answer "what should the user read first?"
- Controlled density: avoid overly compact cards and avoid oversized empty areas without purpose.
- Intentional spacing: every gap should come from a spacing system, not random values.
- Surface discipline: a small, repeatable set of panel/shell styles.
- Theme parity: dark and light should feel like siblings, not separate products.

## 4. Typography

- Primary: Geist.
- Display accent: Instrument Serif.
- Monospace use only for terminal/code motifs.

Rules:

- Use display accent sparingly for emphasis headlines only.
- Keep body copy highly readable, medium contrast in dark, stronger contrast in light.
- Do not mix too many font weights in one section.
- Preserve consistent heading rhythm (H1, H2, H3 sizing and spacing).

## 5. Color and Contrast

Token strategy:

- Use semantic tokens from CSS variables for text/background/accent/state.
- Avoid raw random hex values in components unless required for a temporary diagnostic state.

Theme-aware class strategy:

- Light mode: prefer darker micro-contrast surfaces.
  - Example pattern: border-black/* + bg-black/[...] for subtle surfaces.
- Dark mode: use reciprocal white tints.
  - Example pattern: dark:border-white/* + dark:bg-white/[...].

Contrast rules:

- Body text must remain clearly readable at normal zoom.
- Secondary text must remain legible without zooming.
- Badges and chips require readable foreground/background pairing in both themes.
- Hover states cannot reduce readability.

## 6. Surface Language

- Preferred radius: rounded panels and controls with consistent corner radii.
- Shadows: soft and subtle, never muddy.
- Glassmorphism: use only on shell primitives (floating nav, overlays, command layer).
- Avoid stacking multiple blur layers on content cards.

## 7. Motion and Interaction

Allowed motion:

- Fade in/out
- Gentle slide/reveal
- Card elevation on hover
- Subtle parallax (optional, restrained)
- Staggered entrance for repeated lists

Disallowed motion:

- Looping bounce effects
- Large perpetual transforms
- Excessive blur animations
- Decorative motion that does not communicate state

Behavioral rules:

- Motion must never obscure content hierarchy.
- Motion should communicate state change, not decoration.
- Respect reduced-motion preferences globally.

## 8. Layout and Spacing

- Use container tiers consistently (reading, standard, showcase widths).
- Maintain predictable vertical rhythm between sections.
- Keep card interiors aligned to a consistent spacing scale.
- Ensure mobile-first spacing; expand progressively on larger screens.

## 9. Navigation and Shell

Global shell requirements:

- Floating navbar
- Active route highlighting
- Theme toggle
- Mobile drawer
- Command palette trigger

Interaction requirements:

- Keyboard support for palette and dismissal flows.
- Scroll-aware navbar treatment should remain readable in both themes.
- Mobile drawer must have touch-friendly target sizes.

## 10. Page-Level Patterns

### Home

- Hero must be typographically strong and concise.
- Show short credibility signals (highlights, stack, CTA).
- Spotify card must feel integrated, not embedded/foreign.
- Featured projects section should preview quality and depth.

### Projects Index

- Clear search/filter controls.
- Premium cards with strong visual hierarchy.
- Keep badges readable and not dominant.
- Card hover behavior should be subtle.

### Project Detail

- Narrative structure:
  - Hero
  - Overview
  - Architecture
  - Features
  - Gallery
  - Timeline
  - Challenges
  - Lessons learned
- Link actions (GitHub/demo) should be obvious and easy to scan.

### Setup

- Category-based organization with stable ordering.
- Items include: name, description, whyIUseIt, links, optional image.
- Cards should read like a curated showcase, not a plain table.

### CV

- Web CV and PDF should share the same visual personality.
- Timeline and grouped category treatment must be clean and structured.
- PDF output must remain printable and robust for long content.

## 11. Spotify Widget Consistency

Required states:

- Playing
- Paused recently
- Stale paused

Rules:

- Stale label text must be exactly: Last played music.
- Stale state requires distinct visual treatment.
- Progress must not continue while paused.
- If no item exists, do not render misleading playback state.

## 12. Data and Content Architecture

- Keep JSON-driven architecture for content source.
- Use typed normalization adapters between raw JSON and UI models.
- Add fields without breaking existing keys during migration windows.
- Prefer explicit typed interfaces for route data consumption.

## 13. Component Reuse and Structure

- Reuse shared primitives before creating new bespoke components.
- Introduce new component variants only when a real repeatable pattern exists.
- Keep feature components isolated by concern.
- Avoid repeating style strings when a shared class or utility is appropriate.

## 14. Accessibility Requirements

- Full keyboard traversal for interactive UI.
- Visible focus styles in both themes.
- Semantic heading order by page.
- Dialogs must be focusable and dismissible by keyboard.
- Icon-only controls require clear aria labels.

## 15. Performance Requirements

- Lazy load non-critical images and media.
- Keep route payloads lean and avoid unnecessary runtime work.
- Prefer progressive enhancement over heavy client logic.
- Watch bundle growth on feature additions.

## 16. SEO and Semantics

- Route titles and metadata must remain coherent.
- Maintain semantic HTML structure (header/main/section/article where appropriate).
- Keep content descriptive and crawl-friendly.

## 17. Engineering Constraints

- Preserve functionality while redesigning visuals.
- Do not break API endpoints or store contracts without explicit migration.
- Keep compatibility adapters when schema changes are introduced.
- Avoid speculative refactors unrelated to active work.

## 18. QA and Verification Checklist

Before considering work complete:

- Run type and Svelte checks.
- Validate light and dark modes.
- Validate key breakpoints (mobile, tablet, desktop).
- Validate keyboard-only flows.
- Validate stale/edge states (loading, empty, paused, error).
- Confirm no regressions in core route behaviors.

## 19. Session Implementation Rules

- Use Bun for package management and dependency commands.
- Keep edits minimal and targeted where possible.
- Prefer consistent naming and typed models over ad hoc data handling.
- Update this file whenever major design rules evolve.

## 20. Quick Decision Heuristics

When uncertain:

- Choose readability over flair.
- Choose consistency over novelty.
- Choose maintainability over local optimization.
- Choose subtle interaction over expressive animation.
- Choose explicit typed data flow over implicit assumptions.

---

If a proposed change violates this guide, the guide wins unless there is an explicit product decision to update the standard.
