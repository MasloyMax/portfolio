# Максим Маслов · Automation QA Engineer

Одностраничное портфолио на React, TypeScript и Vite. Опыт работы, стек и контакты, монохромные темы, информация об образовании и языках, анимации с поддержкой `prefers-reduced-motion`.

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

Рядом добавлен Python-набор: pytest + Playwright с фикстурой `open_page()`, отдельными локаторами, действиями и проверками. Установка и запуск — в [playwright_python/README.md](playwright_python/README.md). После установки зависимостей в `.venv` запуск из PowerShell: `.\.venv\Scripts\python.exe -m pytest`. Локальный сайт запускается автоматически.

GitHub Actions автоматически выполняет сборку и тесты при push в `main` и в pull request. HTML-отчёт Playwright сохраняется в артефактах запуска на 7 дней.

`node_modules`, `dist`, локальные инструменты в `.qa`, `.env` и отчёты тестов исключены из Git. Исходный PDF резюме не включён в проект.
