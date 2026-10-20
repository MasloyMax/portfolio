# Максим Маслов · Automation QA Engineer

Одностраничное портфолио на React, TypeScript и Vite. Опыт работы, стек и контакты, монохромные темы, интерактивная SVG-графика и анимации с поддержкой `prefers-reduced-motion`.

## Локальный запуск

Требуется Node.js 24; версия также указана в `.nvmrc`.

```sh
npm ci
npm run dev
```

Контент редактируется в `src/profile.ts`. Компоненты страницы находятся в `src/components/`, стили — в `src/styles/`.

```sh
npm run build
npm run preview
```

Готовый статический сайт собирается в `dist/`. Серверная часть и база данных не нужны.

## UI-тесты

```sh
npm run test:ui:install
npm run test:ui:typecheck
npm run test:ui
npm run test:ui:report
```

Тесты используют Playwright + TypeScript и `openPage()` с отдельными файлами локаторов, действий, проверок и спеки. Подробности — в [playwright/README.md](playwright/README.md).

GitHub Actions автоматически выполняет сборку и тесты при push в `main` и в pull request. HTML-отчёт Playwright сохраняется в артефактах запуска на 7 дней.

## Бесплатный хостинг

### Cloudflare Pages

Подходит, если исходники нужно оставить в приватном репозитории.

1. Подключить GitHub-репозиторий к Cloudflare Pages через Git integration.
2. Выбрать production branch `main`.
3. Указать build command `npm run build` и output directory `dist`.
4. При необходимости указать переменную сборки `NODE_VERSION=24`.
5. Нажать Deploy. Cloudflare выдаст адрес на `pages.dev` и будет обновлять сайт после push в `main`.

Документация: [Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/), [Build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/), [Free-plan limits](https://developers.cloudflare.com/pages/platform/limits/).

### GitHub Pages

На GitHub Free требуется публичный репозиторий. Сделать исходники публичными нужно отдельно и осознанно в Settings → General → Change repository visibility.

1. В Settings → Pages выбрать Source: **GitHub Actions**.
2. Открыть Actions → **Deploy to GitHub Pages** → **Run workflow**, ветка `main`.
3. Дождаться завершения. Ссылка появится в Environment `github-pages` и Settings → Pages.
4. После следующих изменений запускать этот workflow повторно.

Workflow уже находится в `.github/workflows/pages.yml`. Он запускается только вручную, поэтому загрузка исходников на GitHub сама по себе не публикует сайт. Относительная база Vite `./` позволяет раздавать сборку из подпапки репозитория.

Документация: [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site), [Custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

`node_modules`, `dist`, локальные инструменты в `.qa`, `.env` и отчёты тестов исключены из Git. Исходный PDF резюме не включён в проект.
