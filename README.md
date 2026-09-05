# CARGO 819 — Premium Logistics Website (Astro 5 + Tailwind 4)

Refonte complète du vieux site statique `cargo819` en site **premium, vendeur, 100% moderne** — pensé pour convertir les visiteurs du Caucase (КМВ) en demandes de devis.

**Stack 2026:** Astro 5 (islands, 0 JS by default) + Tailwind CSS 4 (vite plugin) + TypeScript strict + Zod + Sharp.

## ✨ Ce qui a été fait

- **Design premium logistique** — navy #0B1D3A + accent orange #FF6A00, verre dépoli, cartes arrondies, ombres douces. Inspiré DHL / Freyt / Swiss style. Fait confiance & rassure.
- **Hero vidéo** — `public/video-hero.mp4` (ton fichier CloudFront mis en cache localement pour fiabilité) en `autoplay muted loop playsinline` avec poster, overlay dégradé et formulaire de devis rapide.
- **Bilingue RU/EN** — RU par défaut sur `/`, EN sur `/en/`. `hreflang` + `x-default`, dictionnaire typé `src/i18n/ui.ts`, switcher accessible.
- **100% responsive** — mobile-first, `container-premium`, grilles fluides, menu burger accessible (ARIA, focus trap, Escape).
- **Accessible (WCAG 2.2 AA)** — skip-link, sémantique, contrastes AAA, `focus-visible`, `prefers-reduced-motion`, alt partout, labels, `aria-live` sur formulaires.
- **SEO & GEO (LLM Search)** — title/description uniques par langue, OG/Twitter, JSON-LD `LogisticsService` + `FAQPage` + `BreadcrumbList`, `geo.*`, `ICBM`, sitemap i18n, robots, canonical, preconnect fonts, preload poster.
- **Local SEO КМВ** — mots-clés «Пятигорск, Кисловодск, Минеральные Воды, Ессентуки, Железноводск, Георгиевск», adresse `Советская 32`, carte Yandex lazy, micro-copy GEO.
- **Marketing qui vend** — structure AIDA : hook vidéo + preuve sociale (20 ans, 4.9/5, 8400 clients) → douleurs → 6 services → process 4 étapes → géographie → vrais cas photos → témoignages → FAQ → CTA partout + 2 formulaires (honeypot + rate-limit LS) → footer réassurance.
- **Photos process** — réutilisation des 6 `project-*.jpg`, `about-banner.jpg`, `blog-*.jpg` en vraies cases (pas de stock).
- **Maintenable** — composants Astro modulaires, tokens Tailwind, TS strict, `zod` validation, pas de dépendance inutile, build static `dist/`.
- **OWASP Top 10 2026** — CSP (meta + `_headers`), `X-Frame: DENY`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS, `form-action 'self'`, honeypot, rate-limit, validation Zod, sanitization `<>`, pas de `innerHTML` non-échappé, `localStorage` throttle, API `/api/contact` avec 429.

## 📁 Structure

```
public/
  video-hero.mp4   ← ta vidéo hero (cache du lien CloudFront)
  images/          ← photos process
  favicon.svg, robots.txt, _headers, manifest.webmanifest
src/
  layouts/Layout.astro   ← SEO, JSON-LD, CSP, fonts
  components/Header, Hero, About, Services, Process, Geo, Projects, Testimonials, FAQ, Contact, Footer
  i18n/ui.ts             ← dictionnaire RU/EN typé
  pages/index.astro      ← RU (/)
  pages/en/index.astro   ← EN (/en)
  pages/api/contact.ts   ← endpoint durci (Zod + rate-limit)
  styles/global.css      ← Tailwind 4 + tokens
astro.config.mjs         ← i18n, sitemap, tailwind/vite
```

## 🚀 Lancer

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/
npm run preview  # preview prod
```

## 🔒 Sécurité

- Héberge en HTTPS (HSTS dans `_headers`).
- Ajoute `TELEGRAM_BOT_TOKEN` côté serveur, jamais côté client.
- Active le filtrage WAF/CDN et logs sans PII.
- Pour la prod SSR (Vercel/Netlify), `api/contact` devient serverless — sinon les formulaires fonctionnent en mock côté client avec honeypot.

## 🌍 Déploiement

Static `dist/` → Netlify / Vercel / Cloudflare Pages. Les `_headers` seront appliqués automatiquement (Netlify/Cloudflare). Vérifie `https://cargo819.ru/sitemap-index.xml`.

## 📸 Crédit

Ancien site : HTML statique avec `hero-banner.jpg` → remplacé par vidéo hero `video-hero.mp4`. Logo `CARGO 819` conservé.

---
Fait avec soin à Mineralnye Vody — 2026.
