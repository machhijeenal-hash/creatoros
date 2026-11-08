# Cadbury — front-end design study

An unofficial, fan-made recreation of a Cadbury-style chocolate brand homepage.
Built as a single-page static site with **no build step**: one HTML file, one
stylesheet, one vanilla-JS file, self-hosted fonts and original imagery.

> Not affiliated with, endorsed by or connected to Mondelez International.
> "Cadbury", "Dairy Milk", "Twirl", "Wispa" and related marks are trademarks of
> their respective owners. Prices, competitions and copy are fictional and are
> there for demonstration only. All photography is AI-generated for this study.

## Run it

```bash
# from this folder
python3 -m http.server 5173 --bind 0.0.0.0
# then open http://localhost:5173
```

Any static host works too (Netlify, Vercel, GitHub Pages, S3…).

## What's in it

- **Sticky glass header** with hover mega-menu, mobile drawer nav, search overlay
  (`/` shortcut) and a slide-in basket drawer.
- **Hero carousel** — 3 slides, autoplay with progress bar, dots, arrows,
  keyboard control and hover-to-pause. Respects `prefers-reduced-motion`.
- **Product grid** with category filters and add-to-basket (live subtotal,
  quantity stepper, free-delivery threshold, toast confirmations).
- **Recipes, giveaway countdown, 200-year timeline, brand grid, newsletter
  sign-up with validation, footer, cookie-preference modal.**
- **Accessibility**: semantic landmarks, visible focus rings, `inert` on closed
  overlays, `aria-expanded` / `aria-selected` state, keyboard-operable carousel,
  skip link, reduced-motion support.
- **Responsive** from 360px up to wide desktop.

## Structure

```
cadbury-clone/
├── index.html      # all markup + inline SVG icon sprite
├── styles.css      # design tokens, components, responsive rules
├── script.js       # carousel, filters, basket, search, countdown, reveals
├── fonts/          # self-hosted woff2 (Grand Hotel, Yellowtail, Playfair, Inter)
└── img/            # AI-generated photography
```

## Design notes

- Palette: Cadbury royal purple (`#4b1a6e`), plum ink, cream paper, antique gold.
- Type: Playfair Display for editorial headlines, Grand Hotel for the script
  accents, Inter for UI.
- All colours, radii and easings live as CSS custom properties at the top of
  `styles.css`.
