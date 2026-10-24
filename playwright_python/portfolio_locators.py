import re

from playwright.sync_api import Locator, Page


class PortfolioLocators:
    """Все селекторы страницы, включая параметризованные компании."""

    def __init__(self, page: Page) -> None:
        self.page = page
        self.root = page.locator("html")
        self.header = page.get_by_role("banner")
        navigation = self.header.get_by_role("navigation", name="Основная навигация")
        self.main = page.get_by_role("main")
        self.hero = self.main.get_by_role("region", name="Максим Маслов", exact=True)
        self.about = self.hero.get_by_role("region", name="Обо мне.", exact=True)
        self.experience = self.main.get_by_role("region", name="Опыт.", exact=True)
        self.contact = self.main.get_by_role("region", name="Будем на связи.", exact=True)
        self.education = self.about.get_by_role("group", name="Образование")
        self.education_items = self.education.get_by_role("listitem")
        self.languages = self.about.get_by_role("group", name="Языки").get_by_role("listitem")
        self.facts = self.about.locator("dl")
        self.fact_labels = self.facts.get_by_role("term")
        self.fact_values = self.facts.get_by_role("definition")
        self.skills_toggle = self.hero.get_by_text("Как использую стек", exact=True)
        self.skills_details = self.hero.locator("details")
        self.skill_descriptions = self.hero.locator("details dd")
        self.sections = self.main.locator(":scope > section")
        self.title = self.hero.get_by_role("heading", level=1, name="Максим Маслов")
        self.role = self.hero.get_by_text("Automation QA Engineer (TypeScript / Playwright)", exact=True)
        self.location = self.hero.get_by_text("Воронеж, Россия", exact=True)
        self.technologies = self.hero.get_by_role("list", name="Технологии", exact=True).get_by_role("listitem")
        self.logo = self.header.get_by_role("link", name="Максим Маслов — в начало")
        self.about_link = navigation.get_by_role("link", name="Обо мне", exact=True)
        self.experience_link = navigation.get_by_role("link", name="Опыт", exact=True)
        self.contact_link = navigation.get_by_role("link", name="На связи")
        self.hero_experience_link = self.hero.get_by_role("link", name="Мой опыт")
        self.hero_telegram_link = self.hero.get_by_role("link", name="Обсудим задачу")
        self.telegram_link = self.contact.get_by_role("link", name="Написать в Telegram")
        self.email_link = self.contact.get_by_role("link", name="masloymax@gmail.com", exact=True)
        self.copy_email = self.contact.get_by_role("button", name="Скопировать почту")
        self.notification = self.contact.get_by_role("status")
        self.theme_toggle = self.header.get_by_role("button", name=re.compile(r"^Включить (тёмную|светлую) тему$"))
        self.back_to_top = page.get_by_role("contentinfo").get_by_role("link", name="Наверх")
        self.skip_link = page.get_by_role("link", name="Перейти к содержимому")
        self.experience_items = self.experience.get_by_role("article")
        self.expanded_experience_buttons = self.experience.get_by_role("button", expanded=True)
        self.artwork = self.hero.locator(".hero-art")
        self.name_lines = self.hero.locator(".name-line > span")

    def experience_item(self, company: str) -> Locator:
        return self.experience_items.filter(has=self.page.get_by_role("button", name=company))

    def experience_button(self, company: str) -> Locator:
        return self.experience_item(company).get_by_role("button")

    def experience_panel(self, company: str) -> Locator:
        return self.experience_item(company).get_by_role("region", include_hidden=True)

    def experience_description(self, company: str, description: str) -> Locator:
        return self.experience_item(company).get_by_text(description, exact=True)
