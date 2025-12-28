# DRAI Migration Plan

Документ фиксирует полный roadmap по переходу `modern-portfolio` на архитектуру DRAI (Domain / Runtime / Infrastructure / API), включая финальную структуру директорий и ожидаемые коммиты. Любой агент может открыть файл, посмотреть последнюю выполненную задачу и продолжить работу без контекста из переписки.

---

## Финальная структура проекта

```
src/
├─ domain/                      # Чистая бизнес-логика без Angular
│   ├─ models/                  # biography.ts, project.ts, skill.ts, seo.ts
│   ├─ localization/            # lang.config.ts, mapping ключей переводов
│   ├─ services/                # pure функции форматирования, сигналы без DI
│   └─ utils/                   # хелперы для сортировок/фильтров
│
├─ runtime/                     # Angular Runtime слой
│   ├─ app/                     # bootstrap, app.config*, app.routes*
│   ├─ features/                # main, skills, projects, contact, biography ...
│   │   └─ shared/              # UI-паттерны: ModalShell, TechStackList и т.д.
│   ├─ seo/                     # SeoService, директивы, компоненты метаданных
│   ├─ guards/                  # language.guard.ts и др.
│   ├─ resolvers/               # language.resolver.ts и др.
│   ├─ pipes/                   # lang.pipe в формате standalone
│   └─ state/                   # signals/store для UI-состояний
│
├─ infrastructure/              # Доступ к данным и окружение
│   ├─ http/                    # DataService, TranslationsService, interceptors
│   ├─ server/                  # main.server.ts, server.ts, TransferState утилиты
│   ├─ scripts/                 # generate-sitemap.ts, hreflang builder, CI helpers
│   └─ functions/               # serverless API (например, /api/contact)
│
└─ api/                         # Контракты и документация
    ├─ contracts/               # *.d.ts / JSON schema из assets/data/*
    ├─ endpoints/               # описания REST/Webhook контрактов
    └─ docs/                    # README, deployment guide, API usage
```

> При создании коммитов в сообщении желательно указывать слой, например `[runtime] feat: ...`, чтобы отслеживать прогресс по DRAI.

---

## Roadmap и коммиты

### Блок A — локали и маршруты
- **A1 `[runtime] feat: add locale-aware routing + guards`**
  - Создать `domain/localization/lang.config.ts` (массив локалей + fallback).
  - Перенести все маршруты в `runtime/app/app.routes.ts`, добавить `languageGuard`.
  - `LanguageResolver` переводит locale в сигнал, редирект `/ -> /<defaultLang>`.
- **A2 `[runtime] feat: integrate seo data per locale`**
  - `assets/data/seo.json` + контракт `api/contracts/seo.d.ts`.
  - SeoService читает данные через `infrastructure/http/DataService`, складывает в `TransferState`.
  - Обновляет `<html lang>`, canonical, OG/Twitter/hreflang при переходах.

### Блок B — SSR/SSG и CI
- **B1 `[infrastructure] chore: configure SSR build artifacts`**
  - Обновить `angular.json`, `package.json`, `tsconfig.*` под server/browser/prerender.
  - Добавить `routes.txt`, `app.config.server.ts`, `main.server.ts`, `server.ts`.
  - Скрипты `build:ssr`, `build:ssg`, `serve:ssr`.
- **B2 `[infrastructure] chore: add CI pipeline`**
  - GitHub Actions (или аналог): `npm ci`, `npm run test`, `npm run build:ssg`.
  - Шаг деплоя статического `dist/modern-portfolio/browser`.

### Блок C — API и безопасность
- **C1 `[infrastructure] feat: serverless contact endpoint`**
  - Создать `infrastructure/functions/contact` (Express/serverless).
  - Хранить токены в env, ContactComponent → POST `/api/contact`.
  - Добавить retry/feedback UI.
- **C2 `[infrastructure] chore: add Accept-Language interceptor`**
  - Интерцептор вставляет `Accept-Language`, повторяет запросы при 503.
  - Регистрируется в `app.config.ts`.

### Блок D — декомпозиция UI (Runtime)
- **D1 `[runtime] refactor: split project modal`**
  - Вынести `ModalShell`, `ProjectModalHeader`, `ProjectTechStack`, `ProjectLinks` в `runtime/features/projects/components`.
  - Подключить CDK Overlay, общий ScrollLock service, `@defer` heavy секций.
- **D2 `[runtime] refactor: split skill modal & biography`**
  - Аналогично для навыков/биографии, переиспользовать ModalShell и ScrollLock.
  - Все GSAP/DOM операции через сервис, защищённый `isPlatformBrowser`.

### Блок E — производительность и DRAI фичи
- **E1 `[runtime] feat: add @defer + ngOptimizedImage`**
  - Hero/About/Skills/Projects — `ngOptimizedImage`, `priority`, `@defer`.
- **E2 `[runtime] chore: lazy-load gsap and analytics`**
  - Общий `runtime/shared/animations`, динамические импорты `import('gsap/ScrollTrigger')`.
  - Удалить `console.log`, включить `buildOptimizer`, проверить budgets.
- **E3 `[runtime] chore: reduce bundle budgets`**
  - Разбить крупные SCSS, вынести переменные, сделать lazy standalone features.

### Блок F — состояние, сигналы, типы
- **F1 `[domain] refactor: migrate services to signals`**
  - `domain/services/translations.signal.ts`, `projects.signal.ts` и т.д.
  - `infrastructure/http/DataService` возвращает сигналы/функции, а не `Observable<any>`.
- **F2 `[domain/api] chore: add strict models/schemas`**
  - Скрипт `infrastructure/scripts/generate-types.ts` → `api/contracts/*.d.ts`.
  - Включить `"strict": true`, `"useDefineForClassFields": true`, убрать `any`.

### Блок G — SEO и контент
- **G1 `[runtime/api] feat: project detail pages + structured data`**
  - Роут `/:lang/project/:id`, SSR/Prerender для каждого проекта.
  - SeoService генерирует JSON-LD Project + breadcrumbs.
- **G2 `[infrastructure/api] feat: sitemap & hreflang generator`**
  - Скрипт `generate-sitemap.ts` читает локали/маршруты, создаёт `sitemap.xml`, `robots.txt`, `prerendered-routes.json`.
  - Запуск в CI перед деплоем.
- **G3 `[runtime/api] feat: contact & biography microdata`**
  - JSON-LD Person/ContactPoint/Organization в главной странице.
  - Уникальные OG/Twitter images для каждой локали.

### Блок H — тесты и документация
- **H1 `[runtime] test: language resolver + seo service`**
  - Unit tests на canonical/meta/hreflang.
- **H2 `[runtime] test: e2e locale switching`**
  - Cypress/Playwright сценарии с проверкой meta и содержимого.
- **H3 `[api] docs: README + deployment guide`**
  - Обновить документацию с финальной структурой DRAI, добавлением локалей, запуском SSR/SSG/CI, env для контактного API.

---

## Текущее состояние
- Выполнено: базовый SSR, маршруты `/:lang`, SeoService, пререндер `routes.txt`, защита модалок `isPlatformBrowser`.
- Следующий блок: **C** (перенос контактной формы в backend) или **D** (декомпозиция модалок) — в зависимости от приоритета.

Каждый новый коммит должен следовать сообщению из плана (например, `[infrastructure] feat: serverless contact endpoint`). Так другой агент сразу понимает, на какой стадии находится проект и какой слой DRAI затрагивался.
