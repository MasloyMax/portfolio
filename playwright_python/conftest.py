import os
import shutil
import socket
import subprocess
import time
from collections.abc import Iterator
from pathlib import Path
from typing import Any
from urllib.error import URLError
from urllib.request import urlopen

import pytest
from playwright.sync_api import ConsoleMessage, Page, Playwright

from .portfolio_actions import PortfolioActions
from .portfolio_expect import PortfolioExpect
from .portfolio_locators import PortfolioLocators
from .portfolio_page import OpenPage, PortfolioPage

ROOT = Path(__file__).resolve().parents[1]
LOCAL_PORT = 4178


@pytest.fixture(scope="session")
def base_url(pytestconfig: pytest.Config, tmp_path_factory: pytest.TempPathFactory) -> Iterator[str]:
    """Запускает текущий сайт; --base-url позволяет использовать готовый сервер."""
    configured_url = pytestconfig.getoption("base_url")
    if configured_url:
        yield configured_url.rstrip("/") + "/"
        return

    node = shutil.which("node")
    vite = ROOT / "node_modules/vite/bin/vite.js"
    if not node or not vite.is_file():
        pytest.fail("Для запуска сайта нужны Node.js и npm ci из корня проекта.")
    with socket.socket() as probe:
        try:
            probe.bind(("127.0.0.1", LOCAL_PORT))
        except OSError:
            pytest.fail(f"Порт {LOCAL_PORT} занят. Освободите его или передайте --base-url готового сайта.")

    url = f"http://127.0.0.1:{LOCAL_PORT}/"
    log_path = tmp_path_factory.mktemp("vite") / "server.log"
    with log_path.open("w", encoding="utf-8") as log:
        # Прямой запуск Node позволяет остановить именно свой процесс без дерева npm/cmd.
        process = subprocess.Popen(
            [node, str(vite), "--host", "127.0.0.1", "--port", str(LOCAL_PORT), "--strictPort"],
            cwd=ROOT,
            stdout=log,
            stderr=subprocess.STDOUT,
            creationflags=subprocess.CREATE_NO_WINDOW if os.name == "nt" else 0,
        )
        try:
            deadline = time.monotonic() + 30
            while time.monotonic() < deadline:
                if process.poll() is not None:
                    pytest.fail(f"Vite завершился при запуске:\n{log_path.read_text(encoding='utf-8')}")
                try:
                    with urlopen(url, timeout=1) as response:
                        if response.status == 200:
                            break
                except (URLError, TimeoutError):
                    pass
                time.sleep(0.1)  # Только опрос запуска сервера, не ожидание UI.
            else:
                pytest.fail(f"Vite не запустился за 30 секунд:\n{log_path.read_text(encoding='utf-8')}")
            yield url
        finally:
            if process.poll() is None:
                process.terminate()
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill()
                    process.wait(timeout=5)


@pytest.fixture(scope="session", params=["desktop", "mobile", "small-mobile"])
def device_profile(request: pytest.FixtureRequest) -> str:
    return request.param


@pytest.fixture(scope="session")
def browser_context_args(
    browser_context_args: dict[str, Any], playwright: Playwright, device_profile: str,
) -> dict[str, Any]:
    device = dict(playwright.devices["Desktop Chrome" if device_profile == "desktop" else "Pixel 7"])
    sizes = {"desktop": (1440, 900), "mobile": (390, 844), "small-mobile": (320, 800)}
    width, height = sizes[device_profile]
    return {
        **browser_context_args,
        **device,
        "viewport": {"width": width, "height": height},
        "locale": "ru-RU",
        "timezone_id": "Europe/Moscow",
        "color_scheme": "light",
        "reduced_motion": "no-preference",
    }


@pytest.fixture
def open_page(page: Page) -> Iterator[OpenPage]:
    """Один набор actions/check и изолированный BrowserContext для каждого теста."""
    page.set_default_timeout(10_000)
    page.set_default_navigation_timeout(15_000)
    ui = PortfolioLocators(page)
    portfolio = PortfolioPage(PortfolioActions(page, ui), PortfolioExpect(page, ui))
    errors: list[str] = []
    page.on("pageerror", lambda error: errors.append(str(error)))

    def on_console(message: ConsoleMessage) -> None:
        if message.type == "error":
            errors.append(message.text)

    page.on("console", on_console)

    def open_portfolio() -> PortfolioPage:
        portfolio.actions.open()
        portfolio.check.is_ready()
        return portfolio

    yield open_portfolio
    portfolio.check.has_no_browser_errors(errors)
