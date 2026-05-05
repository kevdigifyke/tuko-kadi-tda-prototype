---
name: Intelligence Dashboard System
colors:
  surface: '#0d1516'
  surface-dim: '#0d1516'
  surface-bright: '#333a3c'
  surface-container-lowest: '#080f11'
  surface-container-low: '#151d1e'
  surface-container: '#192122'
  surface-container-high: '#242b2d'
  surface-container-highest: '#2e3638'
  on-surface: '#dce4e5'
  on-surface-variant: '#bac9cc'
  inverse-surface: '#dce4e5'
  inverse-on-surface: '#2a3233'
  outline: '#849396'
  outline-variant: '#3b494c'
  surface-tint: '#00daf3'
  primary: '#c3f5ff'
  on-primary: '#00363d'
  primary-container: '#00e5ff'
  on-primary-container: '#00626e'
  inverse-primary: '#006875'
  secondary: '#cdbdff'
  on-secondary: '#370096'
  secondary-container: '#5203d5'
  on-secondary-container: '#c0acff'
  tertiary: '#ffeac0'
  on-tertiary: '#3e2e00'
  tertiary-container: '#fec931'
  on-tertiary-container: '#6f5500'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#9cf0ff'
  primary-fixed-dim: '#00daf3'
  on-primary-fixed: '#001f24'
  on-primary-fixed-variant: '#004f58'
  secondary-fixed: '#e8deff'
  secondary-fixed-dim: '#cdbdff'
  on-secondary-fixed: '#20005f'
  on-secondary-fixed-variant: '#4f00d0'
  tertiary-fixed: '#ffdf96'
  tertiary-fixed-dim: '#f3bf26'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#0d1516'
  on-background: '#dce4e5'
  surface-variant: '#2e3638'
typography:
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.01em
  data-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: 0.05em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  gutter: 16px
  margin: 24px
---

## Brand & Style

The visual identity of this design system is rooted in precision, authority, and high-stakes intelligence. It is designed for environments where split-second decisions are made based on complex data streams. The aesthetic avoids "gamer" tropes in favor of a cinematic, mission-critical atmosphere that feels both futuristic and deeply professional.

The style leverages **subtle glassmorphism** to create a sense of depth and data layering without sacrificing performance or legibility. It utilizes thin, purposeful glowing lines to draw the eye to critical paths and real-time updates. The emotional response is one of calm control amidst high-velocity information, evoking the feeling of a sophisticated command center.

## Colors

The palette is anchored by a deep obsidian base (`#0B0F14`) to minimize eye strain during long monitoring shifts and to maximize the contrast of luminous data points. 

- **Primary (Cyan):** Reserved strictly for live, incoming data and active telemetry. It represents the "heartbeat" of the election.
- **Secondary (Purple):** Designated for AI-augmented insights and predictive modeling. This separates human-validated data from machine-generated analysis.
- **Semantic Accents:** Green, Yellow, and Red are used sparingly for validation status, warnings, and severe anomalies. 

Surfaces and panels use a slightly lifted navy-grey (`#121922`) to provide structure against the true-black background.

## Typography

This design system utilizes a dual-font approach to balance technical precision with readability. 

**Space Grotesk** is the primary choice for headlines, data readouts, and labels. Its geometric, slightly eccentric letterforms provide the "technical" feel required for a monitoring dashboard and ensure that numerals remain distinct in high-density tables.

**Inter** is utilized for body copy, descriptions, and tooltips. Its neutral, systematic nature ensures that long-form intelligence reports remain highly legible and unobtrusive. Numeric data should ideally use tabular lining features to prevent horizontal shifting during real-time updates.

## Layout & Spacing

The layout follows a **fluid grid** model optimized for ultra-wide displays and multi-monitor setups common in intelligence hubs. A 12-column system is used to organize panels, but the internal content of those panels relies on a strict 4px/8px incremental spacing rhythm.

Dashboard modules are separated by 16px gutters to maintain visual breathing room despite high information density. Primary monitoring feeds should be centered or weighted to the left, while AI-driven analysis and secondary metrics reside in right-aligned sidebars or collapsible drawers.

## Elevation & Depth

Hierarchy is established through **tonal layers** and **glassmorphism** rather than traditional shadows. 

1.  **Base Layer:** The background (`#0B0F14`) serves as the foundation.
2.  **Panel Layer:** Surface panels (`#121922`) are given a 1px border using a low-opacity version of the Primary or Secondary color (e.g., Cyan at 10% opacity).
3.  **Overlay Layer:** Floating modals or tooltips utilize a backdrop blur (20px-30px) and a semi-transparent fill to create a "glass" effect, allowing the data underneath to remain partially visible.
4.  **Luminous Highlights:** Critical alerts or active states use a soft neon outer glow (blur: 8px, spread: 0) to "lift" the element off the screen without using heavy shadows.

## Shapes

The shape language is primarily **Soft (0.25rem)**. This provides a balance between the clinical sharpness of a military interface and the modern approachability of high-end SaaS. 

Buttons, input fields, and panel corners use the standard `rounded-sm`. Larger containers like main dashboard cards can move to `rounded-lg` (0.5rem) to soften the overall architecture. Avoid pill-shapes for anything other than status tags (chips) to maintain the "technical" and "structured" integrity of the interface.

## Components

- **Buttons:** Primary buttons use a solid fill of Cyan or Purple with black text for maximum contrast. Secondary buttons are "ghost" style with a 1px border and a subtle hover glow.
- **Intelligence Chips:** Small, pill-shaped indicators. "Live" chips feature a pulsing Cyan dot. "AI" chips use a Purple gradient border.
- **Data Cards:** These are the core units of the system. They feature a 1px top-border highlight in the semantic color representing the data type (e.g., Red for anomaly detection).
- **Status Indicators:** Use thin circular rings for validation status. A hollow ring signifies "pending," a filled Green ring signifies "validated," and a pulsing Red ring signifies "critical anomaly."
- **Input Fields:** Dark, recessed backgrounds with a Cyan bottom-border that illuminates only when focused.
- **Monitoring Feed:** A specialized list component with monospaced timestamps and color-coded "event type" vertical bars on the left edge.
- **Glow-lines:** Used as decorative or functional dividers. These are 1px tall lines with a linear gradient that fades to transparent at both ends, giving the appearance of a focused beam of light.