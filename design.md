---
name: Raw Editorial Brutalist
colors:
  surface: '#faf9f5'
  surface-dim: '#dbdad6'
  surface-bright: '#faf9f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f0'
  surface-container: '#efeeea'
  surface-container-high: '#e9e8e4'
  surface-container-highest: '#e3e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#5d4038'
  inverse-surface: '#2f312e'
  inverse-on-surface: '#f2f1ed'
  outline: '#926f66'
  outline-variant: '#e7bdb2'
  surface-tint: '#b12d00'
  primary: '#ad2c00'
  on-primary: '#ffffff'
  primary-container: '#d83900'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffb5a0'
  secondary: '#705d00'
  on-secondary: '#ffffff'
  secondary-container: '#fcd400'
  on-secondary-container: '#6e5c00'
  tertiary: '#5c5c5c'
  on-tertiary: '#ffffff'
  tertiary-container: '#747474'
  on-tertiary-container: '#fcfcfc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdbd1'
  primary-fixed-dim: '#ffb5a0'
  on-primary-fixed: '#3b0900'
  on-primary-fixed-variant: '#872000'
  secondary-fixed: '#ffe16d'
  secondary-fixed-dim: '#e9c400'
  on-secondary-fixed: '#221b00'
  on-secondary-fixed-variant: '#544600'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c6'
  on-tertiary-fixed: '#1b1b1b'
  on-tertiary-fixed-variant: '#474747'
  background: '#faf9f5'
  on-background: '#1b1c1a'
  surface-variant: '#e3e2df'
typography:
  display-xl:
    fontFamily: Anton
    fontSize: 120px
    fontWeight: '400'
    lineHeight: 100px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Anton
    fontSize: 72px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Anton
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Anton
    fontSize: 32px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: 0em
  body-md:
    fontFamily: Archivo Narrow
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.01em
  body-sm:
    fontFamily: Archivo Narrow
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  metadata:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  button-label:
    fontFamily: Anton
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.05em
spacing:
  grid-margin: 2rem
  grid-gutter: 0px
  stack-xs: 0.25rem
  stack-sm: 1rem
  stack-md: 2.5rem
  stack-lg: 5rem
  border-width: 1px
---

## Brand & Style
This design system embodies the raw, unpolished energy of underground streetwear and independent print media. The aesthetic is **High-Fidelity Brutalism**: it rejects the softness of modern SaaS interfaces in favor of structural honesty, sharp edges, and aggressive information density. 

The personality is authoritative, intellectual, and intentionally disruptive. It targets a fashion-forward audience that values curation over convenience. The UI should evoke the feeling of a physical high-end zine or a technical garment specification sheet. Every element is bounded by structural lines, emphasizing a "grid-first" philosophy where the architecture of the site is as visible as the content itself.

## Colors
The palette is grounded in a "Paper & Ink" foundation. 
- **Base (#FDFCF8):** A warm, cream-white that provides a premium, archival feel, softer on the eyes than pure white and more reminiscent of expensive heavy-stock paper.
- **Ink (#000000):** Used for all structural borders, typography, and iconography. This is the "glue" of the design system.
- **Signal Red-Orange (#FF4500):** The primary call-to-action color. Used sparingly for high-impact buttons, sale alerts, and active states.
- **Accent Yellow (#FFD700):** A secondary highlight used for text selection backgrounds, badges, and indicating limited-run inventory.

Strictly avoid gradients, blurs, or transparency. All color transitions must be immediate and high-contrast.

## Typography
Typography is the primary visual driver. 
- **Headlines:** Use **Anton** for an aggressive, impactful verticality. For large display sizes, line-height should be set "tight" (often less than 1.0) so characters nearly touch, creating a block-like texture.
- **Body:** **Archivo Narrow** provides high legibility while maintaining the condensed, editorial feel of newspaper columns.
- **Metadata/Technical:** **JetBrains Mono** is used for prices, SKU numbers, sizing charts, and breadcrumbs to reinforce the "technical/underground" aesthetic.

All interactive elements and headlines must be forced to uppercase.

## Layout & Spacing
This design system utilizes a **Rigid Border Grid**. Unlike traditional layouts where gutters provide whitespace between elements, this system uses a 0px gutter with 1px black borders separating all containers. 

- **Desktop:** 12-column grid. Layouts should be asymmetrical—for example, a product image might span 7 columns while the description spans 5.
- **Editorial Spreads:** Utilize large-scale vertical text spanning multiple rows to break the flow of the product catalog.
- **Density:** Information density should be high. Avoid excessive whitespace inside cards; keep content tight to the borders.
- **Mobile:** Collapse to a 1-column or 2-column grid, maintaining the 1px border between all items.

## Elevation & Depth
Depth is created through **Layer Stacking** rather than shadows. 
- **Flat Surface:** Everything exists on the base cream layer (#FDFCF8).
- **Z-Axis Hierarchy:** When an element needs to "pop" (like a modal or dropdown), it should use a solid black offset shadow (2px or 4px) with 100% opacity, or simply a thicker 2px border.
- **Division:** Use horizontal and vertical 1px lines to separate content sections. Do not use background color shifts to denote sections; use lines.
- **Hover States:** Instead of elevation, use color inversion. On hover, a white container with black text becomes a black container with cream text or a red-orange container.

## Shapes
The shape language is strictly **Rectilinear**. 
- **Corners:** 0px radius on every element (buttons, inputs, cards, images).
- **Borders:** Every functional container must have a 1px solid black border.
- **Buttons:** Rectangular blocks.
- **Images:** Should always be cropped to square or specific aspect ratios (4:5, 3:2) with no rounding.

## Components
- **Buttons:** 1px black border, Anton uppercase text, cream background. On hover, fill with Red-Orange (#FF4500) and change text to Black.
- **Product Cards:** A bordered box containing the image, with a 1px line separating the image from the product metadata below. No internal padding—metadata should be flush against the border.
- **Input Fields:** 1px black bottom-border only (minimalist) or full box. Use JetBrains Mono for placeholder text. Active state uses a thicker 2px border.
- **Header:** A dense, multi-row stack of bordered strips. Row 1: Site-wide alert (Yellow background). Row 2: Logo and primary navigation. Row 3: Sub-navigation or filtering.
- **Chips/Tags:** Small rectangular boxes with 1px borders, using JetBrains Mono metadata font.
- **Lists:** Editorial-style bullet points using square markers or simple hyphens.
- **Split Sections:** 50/50 vertical splits where one side is a high-contrast image and the other is a dense block of Archive Narrow text.