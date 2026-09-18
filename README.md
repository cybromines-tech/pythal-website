# pythal.com

Static marketing site for Pythal, built with [Astro](https://astro.build) from the Figma files
"Website _pythal.com" (desktop, frame `Desktop - 20`, 1728 × 6824) and "Phone website view"
(frame `iPhone 17 - 4`, 402 × 2876).

## Commands

```sh
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview   # serve dist/
npm run check     # type-check .astro files
```

## Deploying to Hostinger

Run `npm run build`, then upload the **contents** of `dist/` into `public_html`
(`index.html` must sit directly inside it). `.htaccess` is included. Clear the
LiteSpeed cache once after uploading.

## How the layout works

Every element is placed on the Figma frame's own pixel grid, so values in the code can be
checked directly against Figma:

- `u(n)` (see `src/styles/_figma.scss`) converts a Figma pixel into a length that scales with
  the viewport: `100cqw / 1728` on desktop, `min(100cqw, 520px) / 402` on phones (< 768px).
- Each section is a full-width band (`@include band(...)`) positioned at its Figma `y`, with a
  `.frame` inside that is exactly one design-frame wide.
- Section components keep desktop coordinates first and phone coordinates in `@include phone`.
- The phone frame's 43px iOS status-bar area is removed (`$phone-status-bar`), since a browser
  viewport starts below it.

## Assets

`public/images` holds WebP versions of the original Figma exports. To regenerate them from the
original files run `node scripts/optimize-assets.mjs <path-to-original-images>`.

Fonts: Poppins and Marcellus are self-hosted via `@fontsource`; Brilliant Signature is loaded
from `public/fonts`.
