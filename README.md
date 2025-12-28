# ModernPortfolio

Angular 20 portfolio with SSR/SSG, locale-aware routing, project detail pages, and SEO helpers (canonical, hreflang, JSON‑LD).

## Development

```bash
npm start
```

App runs at `http://localhost:4200/`.

## Build (SSR/SSG)

```bash
npm run build:ssr
npm run build:ssg
```

Serve SSR build:

```bash
npm run serve:ssr:modern-portfolio
```

Static output lives in `dist/modern-portfolio/browser`.

## Environment

Create `.env` (see `.env.example`) and provide:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
- `SITE_URL` (used for `sitemap.xml` and `robots.txt`)

## Sitemap + Hreflang

```bash
npm run generate:sitemap
```

Outputs:

- `public/sitemap.xml`
- `public/robots.txt`
- `prerendered-routes.json`
- updates `routes.txt`

## Deploy (Static)

Deploy the contents of `dist/modern-portfolio/browser` to your static host after `npm run build:ssg`.
