# UI-тесты портфолио

Playwright + TypeScript. Один Page Object, собранный через композицию. Фикстура `openPage()` создаёт локаторы, действия и проверки, открывает сайт и дожидается готовности страницы.

## Структура

```text
playwright/
  portfolio.locators.ts  # Все локаторы, включая параметризованные компании
  portfolio.actions.ts   # Переходы, клики, клавиатура, подготовка Clipboard API
  portfolio.expect.ts    # Все expect и проверки результата
  portfolio.spec.ts      # Пользовательские сценарии и ожидаемые данные
  fixtures.ts            # openPage() и контроль ошибок браузера
  tsconfig.json          # Отдельная строгая проверка типов тестов
playwright.config.ts     # Проекты, локальный сервер, отчёт, trace
```

Пример сценария:

```ts
import { test } from './fixtures'

test('открывает контакты', async ({ openPage }) => {
  const { actions, check } = await openPage()
  await actions.goToContacts()
  await check.isAtSection('contact')
})
```

## Запуск

Из корня проекта, после установки зависимостей через `npm ci`:

```sh
npm run test:ui:install
npm run test:ui:typecheck
npm run test:ui
```

Playwright сам запускает Vite на `http://127.0.0.1:4177` и останавливает его после прогона. Порт должен быть свободен. Тестируется текущий исходный код; предварительная production-сборка не требуется.

```sh
npm run test:ui -- --project=desktop-chromium
npm run test:ui -- --grep "переключает обе темы"
npm run test:ui:watch
npm run test:ui:report
```

`test:ui:watch` открывает интерактивный Playwright UI. `test:ui:report` открывает HTML-отчёт последнего прогона. Обычный `test:ui` работает без видимого окна браузера.

## Покрытие

16 сценариев выполняются в Chromium на desktop 1440×900 и мобильных профилях 390×844 и 320×800. Мобильные профили используют touch-эмуляцию. Ожидаемый результат полного прогона — 48 passed.

Проверяются профиль, город, факты, образование, языки, технологии и раскрытие описаний навыков, якорная навигация и закреплённая шапка, четыре компании и аккордеон, управление клавиатурой, сохранение обеих тем, адреса контактов, копирование почты и обработка отказа, исчезновение уведомления, геометрия вёрстки, анимации, `prefers-reduced-motion` и skip-link. Каждый сценарий также проверяет отсутствие `pageerror` и `console.error`.

Скриншоты светлой и тёмной темы прикладываются к тесту вёрстки. Это материалы для визуального просмотра, а не сравнение с эталонными изображениями. При падении сохраняются screenshot и trace. Артефакты находятся в `playwright/report/` и `playwright/test-results/` и исключены из Git.

## Принципы

- Спека описывает сценарий; селекторы находятся только в `portfolio.locators.ts`, assertions — только в `portfolio.expect.ts`.
- Используются роли, доступные имена и текст. Короткие CSS-локаторы нужны для корневого элемента, прямых секций, анимации заголовка и проверки удаления прежней графики.
- Действия используют auto-waiting Playwright, проверки — повторяемые `expect` и `expect.poll`. Фиксированных задержек и принудительных кликов нет.
- Каждый тест получает отдельный BrowserContext и собственный localStorage. Ожидаемые данные не импортируются из реализации сайта.
- Подменяется только `navigator.clipboard`: тест проверяет реальный UI-обработчик и передаваемый адрес, не затрагивая системный буфер обмена. Нативные разрешения ОС этим набором не тестируются.
- Telegram и почтовый клиент не открываются; проверяются ссылки и атрибуты перехода. Сеть сторонних сервисов не влияет на результат.
- Локально retries выключены; в CI разрешены два повтора, `test.only` запрещён.

Подход основан на официальных рекомендациях: [Page Object Model](https://playwright.dev/docs/pom), [Best Practices](https://playwright.dev/docs/best-practices), [Fixtures](https://playwright.dev/docs/test-fixtures), [Web Server](https://playwright.dev/docs/test-webserver).
