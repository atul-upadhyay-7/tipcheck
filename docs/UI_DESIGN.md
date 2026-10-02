# UI design and dependency notes

TipCheck uses a navy/teal two-panel workspace, readable matched-phrase cards and visible verification steps. Desktop presents input beside analysis; mobile stacks the panels. A zero red-flag score is not a green safety certificate. The educational caveats remain visible.

## Free dependencies

- Tailwind CSS 4.3.3 and its Vite plugin: MIT. Local compilation, no CDN dependency. https://tailwindcss.com/docs/installation/using-vite
- Motion 14.0.0 (`motion/react`, the current Framer Motion distribution): MIT. Entrance transitions, button feedback and score-bar animation. System reduced-motion preference is respected. https://motion.dev/docs/react-installation
- Lucide React 1.50.0: ISC, with some Feather-derived icons under MIT. Icons only, no paid UI kit. https://lucide.dev/license

React Bits was researched as a modular design reference, not installed as a package. Its free collection is separate from paid React Bits Pro; its README describes MIT + Commons Clause, not plain MIT. The spotlight card here is original project code rather than a copied component. No Pro assets, GSAP, WebGL, remote fonts or remote images are required.

References: https://reactbits.dev/get-started/introduction and https://github.com/davidhdev/react-bits/blob/main/README.md

## Why restrained motion

A financial-literacy tool should draw attention to the message and evidence, not a spinning background. React Bits itself recommends only 2-3 effects and simpler mobile treatment. A local CSS spotlight, flat background and small Motion transitions keep the interface responsive. Animations are optional, never necessary to read the result.

## Verification

Backend/frontend tests, lint, production build and proxy smoke must pass before pushing. Inspect settled desktop, mobile and Hindi screenshots, including the empty state and long URL wrapping. This is developer verification, not a formal accessibility audit or real-device performance benchmark.
