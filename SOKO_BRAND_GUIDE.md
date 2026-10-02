# Soko brand guide

Soko is a cross-border African marketplace built around familiarity, trust and the emotional pull of home. The identity should feel warm and contemporary—not corporate, touristy or overly luxurious.

## Brand idea

**Positioning:** The trusted marketplace connecting diaspora shoppers with independent merchants in Nigeria, Ghana and Kenya.

**Primary line:** Bring a little home, home.

**Supporting line:** Made for the distance between us.

**Personality:** Warm, rooted, direct, optimistic and dependable.

## Logo system

| Asset | Use |
| --- | --- |
| [`soko-logo-primary.svg`](assets/brand/soko-logo-primary.svg) | Default logo on cream, white or pale backgrounds |
| [`soko-logo-reversed.svg`](assets/brand/soko-logo-reversed.svg) | Dark green, photography or high-contrast backgrounds |
| [`soko-mark.svg`](assets/brand/soko-mark.svg) | Avatars, social icons, favicons and compact UI |
| [`soko-mark-monochrome.svg`](assets/brand/soko-mark-monochrome.svg) | One-colour printing or restricted applications |

The orange circle and italic lowercase **s** are the recognition device. The wordmark uses Manrope ExtraBold.

### Clear space and minimum size

- Keep clear space around the logo equal to half the diameter of the circular mark.
- Do not show the full logo below 110 px wide digitally or 28 mm in print.
- Do not show the standalone mark below 24 px digitally or 7 mm in print.
- Never stretch, rotate, outline, add a drop shadow or rearrange the mark and wordmark.
- Use only the approved primary, reversed or monochrome colour versions.

## Core colour palette

See the visual [`soko-palette.svg`](assets/brand/soko-palette.svg).

| Token | Hex | Primary use |
| --- | --- | --- |
| Heritage Ink | `#18392F` | Headlines, dark surfaces, footer and primary text |
| Marketplace Green | `#0D5A43` | Primary actions, navigation emphasis and trust cues |
| Soko Orange | `#EE6A3B` | Logo mark, highlights, links and moments requiring attention |
| Fresh Lime | `#D9ED91` | Optimistic highlights, secondary actions and verified states |
| Soko Cream | `#FBFAF6` | Main page background and warm negative space |
| Muted Slate | `#6D7974` | Supporting text and metadata |
| Border Mist | `#DFE2DC` | Rules, dividers and subtle borders |
| White | `#FFFFFF` | Cards, reversed text and clean surfaces |

Use green as the primary interactive colour. Orange should be an accent rather than a large-area background. Lime works best as a highlight paired with Heritage Ink.

### Semantic colours

| State | Foreground | Soft background |
| --- | --- | --- |
| Success | `#397345` | `#E1EFDF` |
| Warning | `#8B611D` | `#FFF0CF` |
| Danger | `#A63D2D` | `#FEE5DF` |
| Information | `#315D83` | `#E4EDF8` |

Never rely on colour alone to communicate a status. Always pair it with a label or icon.

## Typography

**Display and headings — Manrope**

- Weights: 600, 700 and 800.
- Use tight tracking on large headlines, from `-0.03em` to `-0.06em`.
- Use ExtraBold for major statements and the Soko wordmark.

**Body and interface — DM Sans**

- Weights: 400, 500, 600 and 700.
- Use for paragraphs, forms, prices, navigation and operational interfaces.
- Keep long-form body copy between 16–19 px with a line height of 1.5–1.7.

Google Fonts import:

```html
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
```

## Layout and UI language

- Base spacing scale: 4, 8, 12, 16, 24, 32, 48, 64 and 96 px.
- Cards use a 10 px radius and a subtle deep-green shadow.
- Form fields use a 6 px radius; primary buttons use a 4 px radius.
- Status labels are pill-shaped.
- Use strong editorial headlines with generous cream space around them.
- Use thin Border Mist dividers instead of heavy boxes.
- Interactive focus rings use a translucent Soko Orange and must remain visible.

Reusable CSS variables are in [`soko-brand-tokens.css`](assets/brand/soko-brand-tokens.css).

## Photography and product imagery

- Prioritise real products, makers, materials and hands at work.
- Use warm natural light, honest colour and tactile textures.
- Let African origin feel specific through craft and context rather than generic symbols.
- Avoid stock imagery that presents Africa as a single culture or relies on stereotypes.
- Product photography should be clear, consistent and commerce-ready; lifestyle imagery can be more expressive.
- Dark green overlays may be used on photography when white copy needs contrast.

## Iconography and illustration

- Prefer simple geometric line icons with rounded terminals.
- Standard UI sizes are 20 px and 24 px.
- Use orange for a single focal detail; use green or ink for the main icon body.
- Illustration should feel handmade but controlled: flat colour, simple shapes and light texture.
- Avoid mixing unrelated emoji styles in final marketing assets.

## Voice and messaging

Soko speaks plainly and warmly. Lead with what the customer can do, then explain the operational detail.

**Use:** “Follow your order all the way home.”

**Avoid:** “Leverage our end-to-end cross-border logistics visibility solution.”

Writing principles:

- Be human before being technical.
- Be specific about payments, delivery and merchant verification.
- Do not overpromise speed or certainty.
- Use “home” carefully as an emotional anchor, not in every sentence.
- Prefer short calls to action: “Explore Soko”, “Sell with Soko”, “Track your order”.

## Accessibility

- Use Heritage Ink or Marketplace Green for normal text on Cream or White.
- Use white text on Heritage Ink or Marketplace Green.
- Do not use Orange or Muted Slate for small text on Cream without checking contrast.
- Maintain a visible keyboard focus state and a minimum 44 × 44 px touch target.
- Provide text alternatives for every logo and meaningful image.

## Asset handoff

The SVG logo assets remain sharp at any size and have transparent backgrounds. When exporting PNGs, use the SVG source and create at least 1×, 2× and 3× sizes. Keep the source SVGs as the master assets.
