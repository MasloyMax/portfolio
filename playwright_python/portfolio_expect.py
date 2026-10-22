import re
from typing import Literal

from playwright.sync_api import Page, expect

from .portfolio_locators import PortfolioLocators


class PortfolioExpect:
    def __init__(self, page: Page, ui: PortfolioLocators) -> None:
        self.page = page
        self.ui = ui

    def is_ready(self) -> None:
        expect(self.page).to_have_title("Максим Маслов — Automation QA Engineer")
        expect(self.ui.title).to_be_visible()
        expect(self.ui.header).to_be_visible()

    def has_profile(self, companies: list[str], technologies: list[str]) -> None:
        expect(self.ui.sections).to_have_count(3)
        expect(self.ui.role).to_be_visible()
        expect(self.ui.location).to_be_visible()
        expect(self.ui.experience_items).to_have_count(len(companies))
        for company in companies:
            expect(self.ui.experience_button(company)).to_be_visible()
        expect(self.ui.technologies).to_contain_text(technologies)

    def has_biography(self, current_status: str) -> None:
        expect(self.ui.about).to_be_visible()
        expect(self.ui.about).to_contain_text("От мобильных сервисов до банковских систем и инструментов разработчика.")
        expect(self.ui.fact_labels).to_have_text(["Город", "В тестировании", "Сейчас"])
        expect(self.ui.fact_values).to_have_text(["Воронеж, Россия", "С 2021 года", current_status])
        expect(self.ui.education_items).to_have_count(2)
        for detail in [
            "Инженер", "Воронежский государственный технический университет", "2022",
            "Техник · радиоэлектроника", "ВГПГК", "2018",
        ]:
            expect(self.ui.education).to_contain_text(detail)
        expect(self.ui.languages).to_have_text(["Русский — родной", "Английский — B1"])
        expect(self.ui.artwork).to_have_count(0)

    def skill_details_are_expanded(self, expanded: bool) -> None:
        if expanded:
            expect(self.ui.skills_details).to_have_attribute("open", "")
            expect(self.ui.skill_descriptions).to_have_count(15)
            expect(self.ui.skill_descriptions).to_contain_text([
                "Web Автотесты", "Автоматизация тестирования", "Автотесты расширения в VSCode",
            ])
            expect(self.ui.skill_descriptions.first).to_be_visible()
        else:
            expect(self.ui.skills_details).not_to_have_attribute("open", "")
            expect(self.ui.skill_descriptions.first).to_be_hidden()
        self.has_no_horizontal_scroll()

    def is_at_section(self, section: Literal["about", "experience", "contact"]) -> None:
        target, link = {
            "about": (self.ui.about, self.ui.about_link),
            "experience": (self.ui.experience, self.ui.experience_link),
            "contact": (self.ui.contact, self.ui.contact_link),
        }[section]
        expect(self.page).to_have_url(re.compile(rf"#{section}$"))
        expect(target).to_be_in_viewport()
        expect(link).to_have_attribute("aria-current", "location")
        # Python API не имеет expect.poll: ожидаем геометрию в браузере.
        self.page.wait_for_function(
            "([target, header]) => target.getBoundingClientRect().top >= header.getBoundingClientRect().bottom",
            arg=[target.element_handle(), self.ui.header.element_handle()],
            timeout=5_000,
        )

    def is_at_top(self) -> None:
        expect(self.page).to_have_url(re.compile(r"#home$"))
        expect(self.ui.title).to_be_in_viewport()
        self.page.wait_for_function("() => window.scrollY <= 1", timeout=5_000)

    def has_expanded_experience(self, company: str, description: str, highlight: str) -> None:
        expect(self.ui.experience_button(company)).to_have_attribute("aria-expanded", "true")
        expect(self.ui.expanded_experience_buttons).to_have_count(1)
        expect(self.ui.experience_panel(company)).to_be_visible()
        expect(self.ui.experience_panel(company)).to_have_attribute("aria-hidden", "false")
        expect(self.ui.experience_description(company, description)).to_be_visible()
        expect(self.ui.experience_panel(company)).to_contain_text(highlight)

    def has_collapsed_experience(self, company: str) -> None:
        expect(self.ui.experience_button(company)).to_have_attribute("aria-expanded", "false")
        expect(self.ui.experience_panel(company)).to_have_attribute("aria-hidden", "true")
        expect(self.ui.experience_panel(company)).to_be_hidden()

    def has_no_expanded_experience(self) -> None:
        expect(self.ui.expanded_experience_buttons).to_have_count(0)

    def experience_has_focus(self, company: str) -> None:
        expect(self.ui.experience_button(company)).to_be_focused()

    def has_theme(self, theme: Literal["light", "dark"]) -> None:
        expect(self.ui.root).to_have_attribute("data-theme", theme)
        expect(self.ui.root).to_have_css(
            "background-color", "rgb(248, 248, 248)" if theme == "light" else "rgb(20, 20, 20)",
        )
        expect(self.ui.theme_toggle).to_have_accessible_name(
            "Включить тёмную тему" if theme == "light" else "Включить светлую тему",
        )

    def has_contact_links(self, email: str, telegram: str) -> None:
        expect(self.ui.email_link).to_have_attribute("href", f"mailto:{email}")
        for link in [self.ui.hero_telegram_link, self.ui.telegram_link]:
            expect(link).to_have_attribute("href", telegram)
            expect(link).to_have_attribute("target", "_blank")
            expect(link).to_have_attribute("rel", re.compile(r"(?:^|\s)noreferrer(?:\s|$)"))

    def has_copied_email(self, email: str) -> None:
        self.page.wait_for_function("email => window.__copiedEmail === email", arg=email, timeout=5_000)
        expect(self.ui.notification).to_have_text("Почта скопирована")
        expect(self.ui.notification).to_have_css("opacity", "1")

    def has_clipboard_error(self) -> None:
        expect(self.ui.notification).to_have_text("Не удалось скопировать. Скопируйте адрес вручную.")
        expect(self.ui.notification).to_have_css("opacity", "1")
        expect(self.ui.email_link).to_be_visible()

    def has_dismissed_notification(self) -> None:
        expect(self.ui.notification).to_have_text("", timeout=6_000)
        expect(self.ui.notification).to_have_css("opacity", "0")

    def has_no_horizontal_scroll(self) -> None:
        self.page.wait_for_function(
            "() => document.documentElement.scrollWidth <= document.documentElement.clientWidth",
            timeout=5_000,
        )

    def layout_fits_viewport(self) -> None:
        self.has_no_horizontal_scroll()
        for control in [
            self.ui.logo, self.ui.about_link, self.ui.experience_link,
            self.ui.contact_link, self.ui.theme_toggle,
        ]:
            expect(control).to_be_in_viewport(ratio=1)
        title = self.ui.title.bounding_box()
        about = self.ui.about.bounding_box()
        assert title and about, "Заголовок и блок профиля должны быть видимы"
        overlaps = (
            title["x"] < about["x"] + about["width"]
            and title["x"] + title["width"] > about["x"]
            and title["y"] < about["y"] + about["height"]
            and title["y"] + title["height"] > about["y"]
        )
        assert not overlaps, "Имя и блок обо мне не должны накладываться друг на друга"

    def has_running_animations(self) -> None:
        expect(self.ui.name_lines.first).not_to_have_css("animation-name", "none")
        expect(self.ui.about).not_to_have_css("animation-name", "none")

    def respects_reduced_motion(self) -> None:
        expect(self.ui.name_lines.first).to_have_css("animation-name", "none")
        expect(self.ui.about).to_have_css("animation-name", "none")
        for section in [self.ui.about, self.ui.experience, self.ui.contact]:
            expect(section).to_have_css("opacity", "1")

    def skip_link_has_focus(self) -> None:
        expect(self.ui.skip_link).to_be_focused()
        expect(self.ui.skip_link).to_be_in_viewport()

    def main_has_focus(self) -> None:
        expect(self.ui.main).to_be_focused()
        expect(self.page).to_have_url(re.compile(r"#main$"))

    def has_no_browser_errors(self, errors: list[str]) -> None:
        assert not errors, "Ошибки JavaScript и console.error:\n" + "\n".join(errors)
