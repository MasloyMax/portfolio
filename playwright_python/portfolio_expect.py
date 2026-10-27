import re
from typing import Literal

from playwright.sync_api import Page, expect

from .portfolio_locators import PortfolioLocators


# Здесь собраны ожидаемые результаты действий: сценарии вызывают методы через объект check.
# expect повторяет проверку до успеха или таймаута. Обычный assert проверяет уже полученное значение один раз.
# Для условий, вычисляемых в JavaScript (геометрия, прокрутка, результат mock), используем wait_for_function.
class PortfolioExpect:
    def __init__(self, page: Page, ui: PortfolioLocators) -> None:
        self.page = page
        self.ui = ui

    def is_ready(self) -> None:
        # Заголовок вкладки и видимые элементы первого экрана подтверждают готовность нужной страницы.
        expect(self.page).to_have_title("Максим Маслов — Automation QA Engineer")
        expect(self.ui.title).to_be_visible()
        expect(self.ui.header).to_be_visible()

    def has_profile(self, companies: list[str], technologies: list[str]) -> None:
        # Проверяем структуру страницы и наличие каждой ожидаемой компании.
        expect(self.ui.sections).to_have_count(5)
        expect(self.ui.role).to_be_visible()
        expect(self.ui.location).to_be_visible()
        expect(self.ui.experience_items).to_have_count(len(companies))
        for company in companies:
            expect(self.ui.experience_heading(company)).to_be_visible()
        # Список ключевых технологий должен встречаться в том же порядке; другие технологии допустимы.
        expect(self.ui.technologies).to_contain_text(technologies)

    def has_biography(self) -> None:
        # Ожидания заданы явно: ошибка в данных сайта должна проявиться как падение проверки.
        expect(self.ui.about).to_be_visible()
        expect(self.ui.about).to_contain_text("Есть опыт создания тестовой модели сервиса и обучения команды тестировщиков.")
        # to_have_text для коллекции проверяет весь список текстов и их порядок.
        expect(self.ui.fact_labels).to_have_text(["Город", "В тестировании", "В автоматизации"])
        expect(self.ui.fact_values).to_have_text(["Воронеж, Россия", "С 2021 года", "С 2023 года"])
        expect(self.ui.education_items).to_have_count(2)
        for detail in [
            "Инженер", "Воронежский государственный технический университет", "2022",
            "Техник · радиоэлектроника", "ВГПГК", "2018",
        ]:
            expect(self.ui.education).to_contain_text(detail)
        expect(self.ui.languages).to_have_text(["Русский — родной", "Английский — B1"])
        # В текущем дизайне декоративного блока hero-art в DOM быть не должно.
        expect(self.ui.artwork).to_have_count(0)

    def skill_details_are_expanded(self, expanded: bool) -> None:
        # У HTML details открытость определяется булевым атрибутом open с пустым значением.
        # Помимо атрибута проверяем фактическую видимость содержимого, а при раскрытии — его состав.
        if expanded:
            expect(self.ui.skills_details).to_have_attribute("open", "")
            expect(self.ui.skill_descriptions).to_have_count(15)
            expect(self.ui.skill_descriptions).to_contain_text([
                "Веб-автотесты", "Автоматизация тестирования", "Автотесты расширения VS Code",
            ])
            expect(self.ui.skill_descriptions.first).to_be_visible()
        else:
            expect(self.ui.skills_details).not_to_have_attribute("open", "")
            expect(self.ui.skill_descriptions.first).to_be_hidden()
        # Раскрытие длинных описаний не должно создавать горизонтальную прокрутку.
        self.has_no_horizontal_scroll()

    def is_at_section(self, section: Literal["about", "experience", "contact"]) -> None:
        # Сопоставляем имя якоря с секцией и соответствующим пунктом меню.
        target, link = {
            "about": (self.ui.about, self.ui.about_link),
            "experience": (self.ui.experience, self.ui.experience_link),
            "contact": (self.ui.contact, self.ui.contact_link),
        }[section]
        # Проверяем три признака перехода: якорь в конце URL, секцию на экране и активную ссылку.
        expect(self.page).to_have_url(re.compile(rf"#{section}$"))
        expect(target).to_be_in_viewport()
        expect(link).to_have_attribute("aria-current", "location")
        # Ждём окончания прокрутки до положения, где закреплённая шапка не перекрывает начало секции.
        # element_handle передаёт реальные DOM-элементы в JavaScript для измерения их прямоугольников.
        self.page.wait_for_function(
            "([target, header]) => target.getBoundingClientRect().top >= header.getBoundingClientRect().bottom",
            arg=[target.element_handle(), self.ui.header.element_handle()],
            timeout=5_000,
        )

    def is_at_top(self) -> None:
        # Одного якоря недостаточно: заголовок должен попасть на экран, а прокрутка дойти до начала.
        expect(self.page).to_have_url(re.compile(r"#home$"))
        expect(self.ui.title).to_be_in_viewport()
        self.page.wait_for_function("() => window.scrollY <= 1", timeout=5_000)

    def has_visible_experience(self, company: str, description: str, highlight: str) -> None:
        # Все результаты доступны сразу после открытия страницы.
        expect(self.ui.experience_heading(company)).to_be_visible()
        expect(self.ui.experience_description(company, description)).to_be_visible()
        expect(self.ui.experience_item(company)).to_contain_text(highlight)

    def has_theme(self, theme: Literal["light", "dark"]) -> None:
        # Проверяем и выбранную тему в DOM, и применённый CSS-цвет: одного атрибута недостаточно.
        expect(self.ui.root).to_have_attribute("data-theme", theme)
        expect(self.ui.root).to_have_css(
            "background-color", "rgb(248, 248, 248)" if theme == "light" else "rgb(20, 20, 20)",
        )
        # Подпись кнопки сообщает следующее действие: в светлой теме предлагает включить тёмную.
        expect(self.ui.theme_toggle).to_have_accessible_name(
            "Включить тёмную тему" if theme == "light" else "Включить светлую тему",
        )

    def has_contact_links(self, email: str, telegram: str) -> None:
        # Проверяем назначения ссылок. Для Telegram также нужны новая вкладка и rel=noreferrer.
        expect(self.ui.email_link).to_have_attribute("href", f"mailto:{email}")
        for link in [self.ui.hero_telegram_link, self.ui.telegram_link]:
            expect(link).to_have_attribute("href", telegram)
            expect(link).to_have_attribute("target", "_blank")
            # rel может содержать несколько слов: ищем отдельный токен, а не подстроку другого значения.
            expect(link).to_have_attribute("rel", re.compile(r"(?:^|\s)noreferrer(?:\s|$)"))

    def has_copied_email(self, email: str) -> None:
        # Подмена Clipboard API записывает аргумент в window: сверяем полный адрес, переданный обработчиком.
        self.page.wait_for_function("email => window.__copiedEmail === email", arg=email, timeout=5_000)
        expect(self.ui.notification).to_have_text("Почта скопирована")
        expect(self.ui.notification).to_have_css("opacity", "1")

    def has_clipboard_error(self) -> None:
        # При отказе API показываем причину, а адрес оставляем доступным для ручного копирования.
        expect(self.ui.notification).to_have_text("Не удалось скопировать. Скопируйте адрес вручную.")
        expect(self.ui.notification).to_have_css("opacity", "1")
        expect(self.ui.email_link).to_be_visible()

    def has_dismissed_notification(self) -> None:
        # Ждём очистки текста и исчезновения уведомления; 6 секунд — предел ожидания, а не sleep.
        expect(self.ui.notification).to_have_text("", timeout=6_000)
        expect(self.ui.notification).to_have_css("opacity", "0")

    def has_no_horizontal_scroll(self) -> None:
        # Ширина всего содержимого не должна превышать доступную ширину документа.
        self.page.wait_for_function(
            "() => document.documentElement.scrollWidth <= document.documentElement.clientWidth",
            timeout=5_000,
        )

    def layout_fits_viewport(self) -> None:
        self.has_no_horizontal_scroll()
        # ratio=1 требует, чтобы каждый элемент шапки целиком помещался в области просмотра.
        for control in [
            self.ui.logo, self.ui.about_link, self.ui.experience_link,
            self.ui.contact_link, self.ui.theme_toggle,
        ]:
            expect(control).to_be_in_viewport(ratio=1)
        # Получаем координаты двух блоков; bounding_box может вернуть None для скрытого элемента.
        title = self.ui.title.bounding_box()
        about = self.ui.about.bounding_box()
        assert title and about, "Заголовок и блок профиля должны быть видимы"
        # Прямоугольники пересекаются, только если их интервалы пересекаются по обеим осям.
        overlaps = (
            title["x"] < about["x"] + about["width"]
            and title["x"] + title["width"] > about["x"]
            and title["y"] < about["y"] + about["height"]
            and title["y"] + title["height"] > about["y"]
        )
        assert not overlaps, "Имя и блок обо мне не должны накладываться друг на друга"

    def has_running_animations(self) -> None:
        # Проверяем, что в обычном режиме CSS назначает анимации имени и биографии.
        expect(self.ui.name_lines.first).not_to_have_css("animation-name", "none")
        expect(self.ui.about).not_to_have_css("animation-name", "none")

    def respects_reduced_motion(self) -> None:
        # После включения reduced motion анимации отключены, а контент не застревает прозрачным.
        expect(self.ui.name_lines.first).to_have_css("animation-name", "none")
        expect(self.ui.about).to_have_css("animation-name", "none")
        for section in [self.ui.about, self.ui.experience, self.ui.contact]:
            expect(section).to_have_css("opacity", "1")

    def skip_link_has_focus(self) -> None:
        # Ссылка пропуска меню должна получить фокус и появиться на экране после первого Tab.
        expect(self.ui.skip_link).to_be_focused()
        expect(self.ui.skip_link).to_be_in_viewport()

    def main_has_focus(self) -> None:
        # Активация skip-link меняет не только URL, но и место клавиатурного фокуса.
        expect(self.ui.main).to_be_focused()
        expect(self.page).to_have_url(re.compile(r"#main$"))

    def has_no_browser_errors(self, errors: list[str]) -> None:
        # conftest.py вызывает эту проверку после сценария; собранные ошибки выводим одним сообщением.
        assert not errors, "Ошибки JavaScript и console.error:\n" + "\n".join(errors)
