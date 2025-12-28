import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

type ProjectsPayload = {
  projects?: Array<{ id: string }>;
};

const projectRoot = process.cwd();
const routesPath = resolve(projectRoot, 'routes.txt');
const projectsPath = resolve(projectRoot, 'src/assets/data/projects.json');
const publicDir = resolve(projectRoot, 'public');
const sitemapPath = resolve(publicDir, 'sitemap.xml');
const robotsPath = resolve(publicDir, 'robots.txt');
const prerenderPath = resolve(projectRoot, 'prerendered-routes.json');

const siteUrl = (process.env['SITE_URL'] || 'https://example.com').replace(/\/$/, '');
const languages = ['en', 'uk', 'ru'];
const defaultLang = languages[0];

const readRoutes = (): string[] => {
  if (!existsSync(routesPath)) {
    return languages.map((lang) => `/${lang}`);
  }

  return readFileSync(routesPath, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
};

const readProjects = (): string[] => {
  if (!existsSync(projectsPath)) {
    return [];
  }

  const payload = JSON.parse(readFileSync(projectsPath, 'utf8')) as ProjectsPayload;
  return (payload.projects || [])
    .map((project) => project.id)
    .filter((id) => typeof id === 'string' && id.length > 0);
};

const toTail = (route: string): string => {
  const cleaned = route.split('?')[0].replace(/\/{2,}/g, '/');
  const segments = cleaned.split('/').filter(Boolean);
  if (segments.length === 0) {
    return '';
  }

  const [maybeLang, ...rest] = segments;
  if (languages.includes(maybeLang)) {
    return rest.length ? `/${rest.join('/')}` : '';
  }

  return `/${segments.join('/')}`;
};

const buildRoute = (lang: string, tail: string): string => {
  if (!tail) {
    return `/${lang}`;
  }

  return `/${lang}${tail}`.replace(/\/{2,}/g, '/');
};

const baseRoutes = readRoutes();
const projectIds = readProjects();

const projectRoutes = projectIds.flatMap((id) =>
  languages.map((lang) => `/${lang}/project/${id}`)
);

const tails = new Set<string>();
[...baseRoutes, ...projectRoutes].forEach((route) => tails.add(toTail(route)));

const finalRoutes = Array.from(tails)
  .flatMap((tail) => languages.map((lang) => buildRoute(lang, tail)))
  .filter(Boolean)
  .sort();

const now = new Date().toISOString();
const urlEntries = Array.from(tails)
  .flatMap((tail) =>
    languages.map((lang) => {
      const loc = `${siteUrl}${buildRoute(lang, tail)}`;
      const alternates = languages.map((altLang) => {
        const href = `${siteUrl}${buildRoute(altLang, tail)}`;
        return `    <xhtml:link rel="alternate" hreflang="${altLang}" href="${href}"/>`;
      });
      const defaultHref = `${siteUrl}${buildRoute(defaultLang, tail)}`;
      alternates.push(`    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultHref}"/>`);

      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${now}</lastmod>`,
        ...alternates,
        '  </url>'
      ].join('\n');
    })
  )
  .join('\n');

const sitemapXml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
  '        xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  urlEntries,
  '</urlset>',
  ''
].join('\n');

const robotsTxt = [
  'User-agent: *',
  'Allow: /',
  `Sitemap: ${siteUrl}/sitemap.xml`,
  ''
].join('\n');

writeFileSync(routesPath, `${finalRoutes.join('\n')}\n`);
writeFileSync(prerenderPath, `${JSON.stringify(finalRoutes, null, 2)}\n`);
writeFileSync(sitemapPath, sitemapXml);
writeFileSync(robotsPath, robotsTxt);

console.log(`Generated ${finalRoutes.length} routes for ${languages.length} locales.`);
