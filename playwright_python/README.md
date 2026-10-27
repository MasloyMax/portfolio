# UI-тесты портфолио на Python

pytest + Playwright с синхронным API. Фикстура `open_page()` открывает сайт, дожидается готовности и возвращает `actions` и `check` — аналог `openPage()` из соседнего TypeScript-набора.

```python
from playwright_python.portfolio_page import OpenPage


def test_contacts(open_page: OpenPage) -> None:
    actions, check = open_page()
    actions.go_to_contacts()
    check.is_at_section("contact")
```

Результат также доступен через `portfolio = open_page()`, `portfolio.actions` и `portfolio.check`.

## Структура

```text
playwright_python/
  portfolio_locators.py  # Все селекторы страницы
  portfolio_actions.py   # Действия пользователя и подмена Clipboard API
  portfolio_expect.py    # Проверки результата
  portfolio_page.py      # PortfolioPage(actions, check) и тип OpenPage
  conftest.py            # open_page(), сервер, профили и ошибки браузера
  test_portfolio.py      # Сценарии и независимые ожидаемые данные
  requirements.txt       # Зафиксированные версии прямых зависимостей
pytest.ini               # Обнаружение тестов и диагностика падений
```

## Установка и запуск

Нужны Python 3.10+ и Node.js из корневого `.nvmrc`. Команды выполняются из корня репозитория. Первичная установка в PowerShell:

```powershell
npm ci
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r playwright_python/requirements.txt
.\.venv\Scripts\python.exe -m playwright install chromium
```

Запуск из PowerShell без активации окружения:

```powershell
.\.venv\Scripts\python.exe -m pytest
.\.venv\Scripts\python.exe -m pytest -k desktop
.\.venv\Scripts\python.exe -m pytest -k "theme and desktop" --headed
```

В Linux / macOS:

```sh
npm ci
python3 -m venv .venv
.venv/bin/python -m pip install -r playwright_python/requirements.txt
.venv/bin/python -m playwright install chromium
.venv/bin/python -m pytest
```

По умолчанию pytest сам запускает Vite на `http://127.0.0.1:4178/` и останавливает после прогона, включая падения тестов. Порт должен быть свободен; у TypeScript-набора используется отдельный порт 4177. Проверяется текущий исходный код, предварительная сборка не нужна. Обнаружение тестов (`--collect-only`) сервер не запускает.

Для уже запущенного или опубликованного сайта передайте `--base-url`. В этом режиме pytest не запускает и не останавливает сервер:

```powershell
.\.venv\Scripts\python.exe -m pytest --base-url https://masloymax.github.io/portfolio/
```

Этот запуск проверяет опубликованную версию. `open_page()` сохраняет базовый путь `/portfolio/`.

## VS Code

Установите расширение Python от Microsoft и выберите интерпретатор `.venv` через **Python: Select Interpreter**, если IDE ранее запомнила другой. В `.vscode/settings.json` включён pytest для `playwright_python`. Тесты доступны через **Testing → Run Test**; локальный сервер запускается автоматически и при запуске из IDE.

## Покрытие и диагностика

15 сценариев выполняются в Chromium на трёх профилях: desktop 1440×900, mobile 390×844 и small-mobile 320×800. Мобильные профили используют Pixel 7 с touch-эмуляцией. Полный прогон — 45 тестов.

Проверяются профиль, биография, образование, языки, стек, раскрытие навыков, якорная навигация, полный опыт четырёх компаний без дополнительных кликов, обе темы после перезагрузки, контакты, копирование почты и восстановление после отказа Clipboard API, исчезновение уведомления, геометрия страницы, reduced motion и skip-link.

Каждый тест получает отдельный BrowserContext и localStorage. `open_page` проверяет отсутствие `pageerror` и `console.error` после сценария. Локаторы вынесены в один файл, assertions — в другой. Проверки ожидают состояние через `expect` или `wait_for_function`, без фиксированных задержек UI и автоматических повторов упавших тестов. Подмена Clipboard API не меняет системный буфер обмена; внешние ссылки проверяются без перехода.

При падении сохраняются trace и полный скриншот в `playwright_python/test-results/`. Тест вёрстки сохраняет PNG обеих тем для каждого размера экрана; сравнения с эталонными изображениями нет. Каталог результатов очищается плагином перед следующим прогоном и исключён из Git вместе с `.venv` и кешами Python.

```powershell
.\.venv\Scripts\python.exe -m playwright show-trace "playwright_python/test-results/<имя-теста>/trace.zip"
```

Отдельный job в [CI](../.github/workflows/ci.yml) устанавливает Python-зависимости и Chromium, выполняет тесты и сохраняет результаты вместе с JUnit XML на 7 дней.

Справка: [pytest-плагин Playwright](https://playwright.dev/python/docs/test-runners), [Page Object Model](https://playwright.dev/python/docs/pom), [ожидания](https://playwright.dev/python/docs/test-assertions).
