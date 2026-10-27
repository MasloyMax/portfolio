import re

from playwright.sync_api import Locator, Page


class PortfolioLocators:
    """Все селекторы страницы, включая параметризованные компании."""

    def __init__(self, page: Page) -> None:
        # Локатор описывает поиск, но не хранит найденный DOM-узел: поиск выполняется при действии/проверке.
        # get_by_role ищет по роли и доступному имени (тексту или aria-label); exact=True исключает частичные совпадения.
        self.page = page
        # Корень, шапка и основные секции задают области поиска для остальных элементов.
        self.root = page.locator("html")
        self.header = page.get_by_role("banner")
        navigation = self.header.get_by_role("navigation", name="Основная навигация")
        self.main = page.get_by_role("main")
        self.hero = self.main.get_by_role("region", name="Максим Маслов", exact=True)
        self.about = self.main.get_by_role("region", name="Обо мне.", exact=True)
        self.experience = self.main.get_by_role("region", name="Опыт.", exact=True)
        self.contact = self.main.get_by_role("region", name="Будем на связи.", exact=True)
        # Биография: списки образования/языков и пары термин–значение в HTML-списке dl.
        self.education = self.about.get_by_role("group", name="Образование")
        self.education_items = self.education.get_by_role("listitem")
        self.languages = self.about.get_by_role("group", name="Языки").get_by_role("listitem")
        self.facts = self.about.locator("dl")
        self.fact_labels = self.facts.get_by_role("term")
        self.fact_values = self.facts.get_by_role("definition")
        # Нативный details содержит раскрывающий заголовок и описания навыков в элементах dd.
        self.skills = self.main.get_by_role("region", name="Навыки.", exact=True)
        self.skills_toggle = self.skills.get_by_text("Как использую стек", exact=True)
        self.skills_details = self.skills.locator("details")
        self.skill_descriptions = self.skills.locator("details dd")
        # :scope > section берёт только непосредственные секции main, без вложенных блоков.
        self.sections = self.main.locator(":scope > section")
        self.title = self.hero.get_by_role("heading", level=1, name="Максим Маслов")
        self.role = self.hero.get_by_text("Automation QA Engineer (TypeScript / Playwright)", exact=True)
        self.location = self.hero.get_by_text("Воронеж, Россия", exact=True)
        self.technologies = self.skills.get_by_role("list", name="Технологии", exact=True).get_by_role("listitem")
        # Навигационные ссылки ищем внутри своей области, чтобы различать похожие ссылки на странице.
        self.logo = self.header.get_by_role("link", name="Максим Маслов — в начало")
        self.about_link = navigation.get_by_role("link", name="Обо мне", exact=True)
        self.experience_link = navigation.get_by_role("link", name="Опыт", exact=True)
        self.contact_link = navigation.get_by_role("link", name="На связи")
        self.hero_experience_link = self.hero.get_by_role("link", name="Мой опыт")
        # Контакты и уведомление после копирования; role=status предназначен также для скринридеров.
        self.hero_telegram_link = self.hero.get_by_role("link", name="Обсудим задачу")
        self.telegram_link = self.contact.get_by_role("link", name="Написать в Telegram")
        self.email_link = self.contact.get_by_role("link", name="masloymax@gmail.com", exact=True)
        self.copy_email = self.contact.get_by_role("button", name="Скопировать почту")
        self.notification = self.contact.get_by_role("status")
        # Доступное имя переключателя меняется вместе с темой, поэтому регулярное выражение допускает оба варианта.
        self.theme_toggle = self.header.get_by_role("button", name=re.compile(r"^Включить (тёмную|светлую) тему$"))
        self.back_to_top = page.get_by_role("contentinfo").get_by_role("link", name="Наверх")
        self.skip_link = page.get_by_role("link", name="Перейти к содержимому")
        # Все места работы видны сразу, без аккордеона.
        self.experience_items = self.experience.get_by_role("article")
        # CSS-локаторы нужны для проверки отсутствия декора и стилей анимации строк имени.
        self.artwork = self.hero.locator(".hero-art")
        self.name_lines = self.hero.locator(".name-line > span")

    def experience_item(self, company: str) -> Locator:
        return self.experience.get_by_role("article", name=company, exact=True)

    def experience_heading(self, company: str) -> Locator:
        return self.experience_item(company).get_by_role("heading", level=3)

    def experience_description(self, company: str, description: str) -> Locator:
        # Ожидаемое описание приходит из теста и должно точно совпасть с текстом внутри карточки.
        return self.experience_item(company).get_by_text(description, exact=True)
