from pathlib import Path
from typing import Literal

from playwright.sync_api import Page

from .portfolio_locators import PortfolioLocators


class PortfolioActions:
    def __init__(self, page: Page, ui: PortfolioLocators) -> None:
        self.page = page
        self.ui = ui

    def open(self) -> None:
        # Относительный URL сохраняет /portfolio/ при проверке GitHub Pages.
        self.page.goto("./")

    def reload(self) -> None:
        self.page.reload()

    def go_to_about(self) -> None:
        self.ui.about_link.click()

    def go_to_experience(self, source: Literal["header", "hero"] = "header") -> None:
        (self.ui.experience_link if source == "header" else self.ui.hero_experience_link).click()

    def go_to_contacts(self) -> None:
        self.ui.contact_link.click()

    def go_to_top(self, source: Literal["footer", "logo"] = "footer") -> None:
        (self.ui.back_to_top if source == "footer" else self.ui.logo).click()

    def toggle_skill_details(self) -> None:
        self.ui.skills_toggle.click()

    def toggle_experience(self, company: str) -> None:
        self.ui.experience_button(company).click()

    def toggle_experience_with_keyboard(self, company: str, key: Literal["Enter", "Space"]) -> None:
        button = self.ui.experience_button(company)
        button.focus()
        button.press(key)

    def toggle_theme(self) -> None:
        self.ui.theme_toggle.click()

    def copy_email(self) -> None:
        self.ui.copy_email.click()

    def mock_clipboard(self, result: Literal["success", "denied"]) -> None:
        # Подменяется только API; настоящий обработчик кнопки продолжает работать.
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
        self.page.emulate_media(reduced_motion="reduce")

    def focus_skip_link(self) -> None:
        self.page.keyboard.press("Tab")

    def activate_skip_link(self) -> None:
        self.page.keyboard.press("Enter")

    def prepare_screenshot(self) -> None:
        self.ui.experience.scroll_into_view_if_needed()
        self.ui.contact.scroll_into_view_if_needed()
        self.ui.logo.click()

    def screenshot(self, path: Path) -> None:
        self.page.evaluate("() => document.fonts.ready.then(() => undefined)")
        self.page.screenshot(path=path, full_page=True, animations="disabled")
