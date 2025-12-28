# DRAI Migration Plan

Документ описывает текущее состояние и очередность задач по переводу `modern-portfolio` на архитектуру DRAI с SSR/SSG и многоязычным SEO. Любой агент может подхватить работу, ориентируясь на блоки и коммиты ниже.

## Цель
- **Domain**: строгие модели, локализации, бизнес-логика (сигналы, pure трансформации).
- **Runtime**: standalone компоненты, маршруты `/:lang/...`, `@defer`, SeoService, guards/resolvers.
- **Infrastructure**: DataService/TranslationsService с TransferState, SSR/SSG конфиги, CI/CD пайплайн, serverless для контактов.
- **API**: контракты JSON (assets/data), backend endpoints (contact), sitemap/hreflang генератор, документация по взаимодействию.

## Блоки работ

### 1. Локали и маршруты
- **A1** `feat: add locale-aware routing + guards`
  - Утвердить список локалей + `lang.config.ts`.
  - Guard/resolver для `/:lang`.
  - Редирект `/ -> /<defaultLang>`.
- **A2** `feat: add locale-aware seo data`
  - Общий `seo.json` (title/description/OG по страницам).
  - SeoService читает JSON через DataService + TransferState.

### 2. SSR/SSG и CI
- **B1** `chore: configure SSR build artifacts`
  - Обновить `angular.json`, `package.json`, `tsconfig.*`.
  - Добавить скрипты `build:ssr`, `build:ssg`, `serve:ssr`.
- **B2** `chore: add CI pipeline`
  - GitHub Actions (или аналог): `npm ci`, `npm run test`, `npm run build:ssg`, деплой `dist/.../browser`.

### 3. API / безопасность
- **C1** `feat: move contact form to serverless`
  - Бэкенд-эндпоинт (Cloud Function/serverless).
  - ContactComponent → `HttpClient.post('/api/contact')`.
- **C2** `chore: add Accept-Language interceptor`
  - Интерцептор проставляет заголовки и ретраит по 503.

### 4. Компонентная декомпозиция (DRAI)
- **D1** `refactor: split project modal`
  - Подкомпоненты `ProjectModalHeader/TechStack/Links`, shared `ModalShell`, `@defer`.
- **D2** `refactor: split skill modal/biography`
  - Аналогично навыки/биография + CDK Overlay для управления скроллом.

### 5. Производительность и DRAI-фичи
- **E1** `feat: add @defer + ngOptimizedImage`
  - Hero, Skills, Projects — оптимизированные изображения, lazy блоки.
- **E2** `chore: trim GSAP`
  - Динамические импорты, удаление `console.log`, buildOptimizer.
- **E3** `chore: fix Angular budgets`
  - Разнести SCSS, lazy-фичи, снизить initial bundle.

### 6. Состояние, сигналы, типы
- **F1** `refactor: migrate DataService/Translations to signals`
  - Signals + TransferState, убрать `Subscription[]`.
- **F2** `chore: add strict models`
  - Генерация `*.d.ts` из JSON, удаление `any`, усиление `tsconfig`.

### 7. SEO / контент
- **G1** `feat: project detail pages + structured data`
  - Роуты `/lang/project/:id`, SSR контент, JSON-LD Project.
- **G2** `feat: sitemap & hreflang generator`
  - Скрипт `scripts/generate-sitemap.ts`, `robots.txt`.
- **G3** `feat: contact & biography microdata`
  - JSON-LD Person/ContactPoint, OG/Twitter для каждой страницы.

### 8. Тесты и документация
- **H1** `test: resolver + seo service`
- **H2** `test: e2e for locale switching`
- **H3** `docs: README + deployment guide`
  - Объяснить DRAI-структуру, как добавлять локали, запуск SSR/SSG, переменные окружения, CI/CD.

## Текущее состояние
- Выполнено: базовый SSR, локаль-ориентированный роутинг, SeoService, модалки/GSAP защищены `isPlatformBrowser`, пререндер `routes.txt`.
- Следующий шаг: переход к блоку **C** (перенос контактной формы в backend) либо начать декомпозицию модалок (**D**), в зависимости от приоритета безопасности.

Все коммиты должны отражать блоки выше (например, `feat: add project detail page seo`) и поддерживать DRAI разделение: Domain (модели/логика), Runtime (компоненты/guards), Infrastructure (сервисы/SSR/CI), API (контракты/эндоинты/доки).
