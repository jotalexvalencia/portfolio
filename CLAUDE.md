# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **personal portfolio website** for Jorge Alexander Valencia, built with **Vite + Vanilla JavaScript + CSS**. It's a single-page application with smooth scrolling navigation, dark/light theme toggle, Spanish/English language toggle, and a SwiperJS-powered project carousel.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (Vite) |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview production build locally |

## Architecture & Structure

### High-Level Overview

```
├── index.html          # Main HTML structure with all sections
├── package.json        # Vite + dev dependencies only
├── public/             # Static assets (images, PDFs, favicon)
│   ├── images/         # Profile photo, project screenshots
│   └── pdf/            # CV files (Spanish/English)
├── src/
│   ├── css/style.css   # All styling (themes, responsive, Swiper)
│   └── js/main.js      # All client-side logic (theme, lang, Swiper init)
└── dist/               # Production build output (gitignored)
```

### Key Features

1. **Theme System**: CSS custom properties (`--bg-color`, `--text-color`, `--primary-color`, etc.) with `[data-theme="dark"]` selector. Persisted in `localStorage`.
2. **Language System**: Dual-language content via CSS classes `.es` / `.en` + `.hidden`. Persisted in `localStorage`.
3. **Fixed Navigation**: `#main-nav` is `position: fixed`; `main` padding-top adjusted via JS (`adjustMainContentPadding()`) using CSS variable `--scroll-padding`.
4. **Project Carousel**: SwiperJS (v11 from CDN) with coverflow effect, autoplay, pagination, navigation arrows.
5. **Responsive Design**: Extensive media queries for mobile (≤600px), tablet (≤768px), landscape tablet, desktop (≥1200px), and large desktop (≥1600px).

### Important Files

| File | Purpose |
|------|---------|
| `index.html` | Semantic HTML with all sections: perfil, experiencia, habilidades, certificaciones, cv, projects (Swiper), contacto |
| `src/js/main.js` | DOMContentLoaded handler: theme/lang toggles, nav padding adjustment, smooth scroll init, Swiper initialization |
| `src/css/style.css` | Complete styling: CSS variables for themes, responsive breakpoints, Swiper customization, print styles |

### Theme Colors

**Light**: Indigo primary (`#6366F1`), slate text (`#1E293B`), light gray-blue bg (`#F4F6FB`)
**Dark**: Cyan primary (`#22D3EE`), soft white text (`#E2E8F0`), midnight blue bg (`#0A1128`)

### Language Toggle Logic

- Each text element has both `.es` and `.en` versions
- `.hidden` class (`display: none !important`) hides inactive language
- `applyLanguage(lang)` toggles visibility and updates `document.documentElement.lang`

### Navigation & Scroll

- Nav links use `href="#section-id"` with `scroll-behavior: smooth` on `html`
- `scroll-margin-top: var(--scroll-padding)` on `section[id]` compensates for fixed nav
- `--scroll-padding` is calculated in JS as `navHeight + 20px` and set as CSS variable

### SwiperJS Configuration

Initialized in `main.js` with:
- `effect: "coverflow"`, `centeredSlides: true`, `slidesPerView: "auto"`
- `loop: true`, `autoplay: { delay: 3000, pauseOnMouseEnter: true }`
- Pagination (clickable bullets) + Navigation (prev/next arrows)

### Adding/Modifying Projects

1. Add screenshot to `public/images/`
2. Add a new `.swiper-slide.project` block in `index.html` (inside `.swiper-wrapper`)
3. Follow existing structure: `<img>`, `.project-info` with `<p class="es">`/`<p class="en hidden">`, `.project-links` with `.project-link` anchors

### PDF Resumes

Located at `/pdf/cv_es.pdf` and `/pdf/cv_en.pdf` (served from `public/`). Linked in the CV section with `download` attribute.

## Development Notes

- No build step for CSS/JS beyond Vite bundling — edit `src/` files directly
- External dependencies loaded via CDN: Google Fonts (Nunito), Font Awesome 6, SwiperJS 11
- No testing framework configured
- No linting/formatting tools configured