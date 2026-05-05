---
name: Aegis Intelligence
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
  h1-display:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h2-headline:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  body-main:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  data-lg:
    fontFamily: IBM Plex Mono
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  data-md:
    fontFamily: IBM Plex Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: '0'
  label-caps:
    fontFamily: IBM Plex Mono
    fontSize: 11px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  gutter: 16px
  margin: 32px
---

## Brand & Style

The design system is engineered to project the gravitas of a high-stakes command center. It targets political analysts, intelligence officers, and newsroom directors who require real-time clarity under pressure. The aesthetic is "Futuristic Minimalism," blending high-density data visualization with a dark, atmospheric interface.

The emotional response is one of surgical precision and absolute authority. By utilizing a dark canvas with concentrated neon accents, the system directs the user's focus toward shifting data points without visual fatigue. The style draws heavily from **Glassmorphism** for layering and **Corporate Modern** for structural reliability, creating a "Head-Up Display" (HUD) feel that feels both advanced and institutional.

## Colors

The palette is anchored in deep obsidian tones to minimize glare in low-light environments. 
- **The Primary Accents** are functional, not decorative. Cyan signifies active, real-time data flow, while Purple is reserved for synthetic or AI-generated insights.
- **Validation States** use high-saturation Green and Red to signal confidence or critical anomalies immediately.
- **Neutral UI** elements stay strictly within the grayscale to ensure that party-specific colors (e.g., Red/Blue in US elections) remain the most prominent chromatic elements on the map or charts.
- **Glass Effects** utilize a subtle white tint at low opacities to simulate depth without muddying the background.

## Typography

This design system employs a dual-font strategy to separate narrative from empirical data. 
- **Inter** (set with Tight tracking for headings) provides a modern, legible framework for navigation and structural labels.
- **IBM Plex Mono** is used for all numerical outputs, timestamps, and coordinate data. The monospaced nature ensures that fluctuating numbers do not cause layout "jitter" during live updates.
- **Hierarchy** is strictly enforced through size and weight; use `label-caps` for table headers and metadata to maintain the technical "intelligence" aesthetic.

## Layout & Spacing

The system follows an **8px grid** to ensure mathematical harmony across high-density layouts. 
- **Grid Strategy:** A 12-column fluid grid is used for the main dashboard content, allowing widgets to span 3, 4, 6, or 12 columns.
- **Density:** High information density is prioritized. Vertical rhythm is maintained by using 8px increments for padding inside cards and 16px for the gaps between layout modules.
- **Safe Areas:** A 32px outer margin acts as a "frame," isolating the command center interface from the edges of the physical display.

## Elevation & Depth

Hierarchy is achieved through **Tonal Layering** and **Glassmorphism** rather than traditional drop shadows.
- **Level 0 (Canvas):** The base `#0B0F14` layer.
- **Level 1 (Panels):** Surface `#121922` with a 1px border of `rgba(255,255,255,0.06)`.
- **Level 2 (Overlays):** Glassmorphic modals with a 4px backdrop blur and a slightly brighter border (`rgba(255,255,255,0.12)`).
- **Glows:** Use soft, 20px-spread outer glows (15% opacity) in the color of the accent (Cyan or Purple) to indicate "Active" or "Streaming" states for specific widgets.

## Shapes

The design system utilizes a **Rounded (Level 2)** geometry to soften the technical edge of the dark UI. 
- **Containers:** All primary cards and dashboard modules feature a 12px corner radius.
- **Inner Elements:** Buttons, inputs, and tags within cards use a smaller 4px radius to create a nested visual hierarchy.
- **Interactive States:** Hovering over elements should never change the shape, only the border luminosity or the intensity of the internal glass effect.

## Components

- **Buttons:** Primary buttons are "ghost" style with a 1px Cyan border and a subtle `#00E5FF10` fill. On hover, the fill opacity increases and a soft Cyan outer glow activates.
- **Data Chips:** Small, monospaced badges with a background color matching the status (e.g., `#00C85320` fill with a `#00C853` text).
- **Cards:** The foundational unit. Each card must have a header section with a `label-caps` title and an optional "live" pulsing dot indicator if the data source is streaming.
- **Input Fields:** Dark backgrounds (`#0B0F14`) with a 1px border. Focus states transition the border to Cyan and add a sharp, 1px inset glow.
- **Anomalies & Warnings:** Represented by "Warning Strips"—a 2px thick vertical border on the left side of a list item or card in Red or Yellow.
- **Telemetry Icons:** Data-first icons using thin 1.5px strokes. Icons should be functional (e.g., up/down arrows, refresh, filter) rather than decorative.