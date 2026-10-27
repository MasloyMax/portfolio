from pathlib import Path
from typing import Literal

from playwright.sync_api import Page

from .portfolio_locators import PortfolioLocators


# Действия пользователя вынесены из сценариев: здесь кликаем, нажимаем клавиши и готовим окружение.
# Ожидаемый результат этих действий проверяет PortfolioExpect.
class PortfolioActions:
    def __init__(self, page: Page, ui: PortfolioLocators) -> None:
        self.page = page
        self.ui = ui

    def open(self) -> None:
        # Относительный URL сохраняет /portfolio/ при проверке GitHub Pages.
        self.page.goto("./")

    def reload(self) -> None:
        # Обновляем документ в том же контексте, сохраняя localStorage для проверки выбранной темы.
        self.page.reload()

    def go_to_about(self) -> None:
        # Переходим к биографии через ссылку в шапке, как обычный пользователь.
        self.ui.about_link.click()

    def go_to_experience(self, source: Literal["header", "hero"] = "header") -> None:
        # Один раздел доступен из шапки (header) и с первого экрана (hero); тест выбирает путь.
        (self.ui.experience_link if source == "header" else self.ui.hero_experience_link).click()

    def go_to_contacts(self) -> None:
        # Ссылка меняет якорь и прокручивает страницу; положение затем проверяет check.is_at_section.
        self.ui.contact_link.click()

    def go_to_top(self, source: Literal["footer", "logo"] = "footer") -> None:
        # Проверяем оба пользовательских пути возврата: подвал и логотип в шапке.
        (self.ui.back_to_top if source == "footer" else self.ui.logo).click()

    def toggle_skill_details(self) -> None:
        # Нажимаем заголовок нативного HTML details: браузер сам меняет его атрибут open.
        self.ui.skills_toggle.click()

    def toggle_theme(self) -> None:
        # Переключаем тему настоящей кнопкой приложения, включая сохранение выбора обработчиком.
        self.ui.theme_toggle.click()

    def copy_email(self) -> None:
        # Обработчик кнопки вызовет Clipboard API; ответ API задаётся отдельно в mock_clipboard.
        self.ui.copy_email.click()

    def mock_clipboard(self, result: Literal["success", "denied"]) -> None:
        # Подменяется только API; настоящий обработчик кнопки продолжает работать.
        # evaluate выполняет JavaScript внутри страницы. denied имитирует отказ в разрешении,
        # success сохраняет переданный текст в window.__copiedEmail для последующей проверки.
        # Старый результат удаляется при каждой подмене; системный буфер обмена не используется.
        self.page.evaluate("""outcome => {
            delete window.__copiedEmail;
            Object.defineProperty(navigator, 'clipboard', {
                configurable: true,
                value: {
                    async writeText(text) {
                        if (outcome === 'denied') {
                            throw new DOMException('Clipboard access denied', 'NotAllowedError');
                        }
                        window.__copiedEmail = text;
                    }
                }
            });
        }""", result)

    def prefer_reduced_motion(self) -> None:
        # Меняем браузерное media-условие prefers-reduced-motion, на которое реагируют стили сайта.
        self.page.emulate_media(reduced_motion="reduce")

    def focus_skip_link(self) -> None:
        # Используем реальный Tab: тест проверяет, что skip-link первый в порядке фокуса.
        self.page.keyboard.press("Tab")

    def activate_skip_link(self) -> None:
        # Enter активирует уже сфокусированную ссылку пропуска навигации.
        self.page.keyboard.press("Enter")

    def prepare_screenshot(self) -> None:
        # Нижние секции появляются при прокрутке: показываем их, затем возвращаем страницу наверх.
        self.ui.experience.scroll_into_view_if_needed()
        self.ui.contact.scroll_into_view_if_needed()
        self.ui.logo.click()

    def screenshot(self, path: Path) -> None:
        # Ждём загрузки шрифтов и снимаем всю страницу с отключёнными на время снимка анимациями.
        self.page.evaluate("() => document.fonts.ready.then(() => undefined)")
        self.page.screenshot(path=path, full_page=True, animations="disabled")
