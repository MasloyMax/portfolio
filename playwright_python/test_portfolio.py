# Сценарии описывают поведение пользователя. pytest находит функции с префиксом test_.
# Аргумент open_page подставляется из conftest.py: это функция открытия готовой страницы.
# Она возвращает actions (действия) и check (проверки); каждый сценарий идёт на трёх профилях экрана.
from pathlib import Path

import pytest

from .portfolio_page import OpenPage

# Ожидания независимы от src/profile.ts: неверный контент должен ломать тест.
EXPERIENCE = [
    {
        "company": "Raiffeisenbank",
        "description": "Автоматизация и ручное тестирование банковских систем.",
        "highlight": "проверял REST и gRPC API",
    },
    {
        "company": "Haulmont",
        "description": "Плагины для IntelliJ IDEA и VS Code — инструменты для разработчиков.",
        "highlight": "Разработал и внедрил систему автотестов",
    },
    {
        "company": "Сбер",
        "description": "Веб-сервис «Пульс» для обучения сотрудников.",
        "highlight": "С нуля разработал тестовую модель сервиса отчётности.",
    },
    {
        "company": "Яндекс",
        "description": "Мобильные приложения и веб-версия сервиса такси.",
        "highlight": "Создал и обучил команду из трёх тестировщиков.",
    },
]
EMAIL = "masloymax@gmail.com"
TELEGRAM = "https://t.me/masloymax"


def test_profile_and_technologies(open_page: OpenPage) -> None:
    """Профиль, стек и четыре места работы."""
    # Открываем страницу. Действия здесь не нужны, поэтому первый результат обозначаем _.
    _, check = open_page()
    # Передаём ожидаемые компании и ключевые технологии, с которыми сравниваем интерфейс.
    check.has_profile(
        [job["company"] for job in EXPERIENCE],
        ["Playwright", "TypeScript", "WebdriverIO", "Java", "PostgreSQL", "GitLab CI/CD"],
    )
    for job in EXPERIENCE:
        check.has_visible_experience(**job)


def test_biography_education_and_languages(open_page: OpenPage) -> None:
    # Проверяем биографию, факты о человеке, два места учёбы и языки.
    _, check = open_page()
    check.has_biography()


def test_skill_details(open_page: OpenPage) -> None:
    actions, check = open_page()
    # Начальное состояние закрыто; первый клик должен показать описания навыков.
    check.skill_details_are_expanded(False)
    actions.toggle_skill_details()
    check.skill_details_are_expanded(True)
    # Повторный клик скрывает содержимое; после обоих состояний проверяется ширина страницы.
    actions.toggle_skill_details()
    check.skill_details_are_expanded(False)


def test_anchor_navigation(open_page: OpenPage) -> None:
    actions, check = open_page()
    # Проходим ссылки из шапки и первого экрана. Проверяем URL, положение секции и активный пункт меню.
    actions.go_to_about()
    check.is_at_section("about")
    actions.go_to_experience("hero")
    check.is_at_section("experience")
    actions.go_to_contacts()
    check.is_at_section("contact")
    # Возврат наверх проверяем двумя путями: ссылкой из подвала и логотипом в шапке.
    actions.go_to_top("footer")
    check.is_at_top()
    actions.go_to_experience("header")
    check.is_at_section("experience")
    actions.go_to_top("logo")
    check.is_at_top()


# Каждый работодатель должен показывать описание и результат без дополнительных кликов.
@pytest.mark.parametrize("job", EXPERIENCE, ids=["raiffeisenbank", "haulmont", "sber", "yandex"])
def test_experience_visible_without_clicks(open_page: OpenPage, job: dict[str, str]) -> None:
    _, check = open_page()
    check.has_visible_experience(**job)


def test_theme_persists_after_reload(open_page: OpenPage) -> None:
    actions, check = open_page()
    # Новый контекст начинает со светлой темы; затем последовательно выбираем тёмную и светлую.
    check.has_theme("light")
    for theme in ("dark", "light"):
        actions.toggle_theme()
        check.has_theme(theme)
        # Перезагрузка проверяет, что выбор сохранён, а не применён только к текущему DOM.
        actions.reload()
        check.has_theme(theme)


def test_contact_links(open_page: OpenPage) -> None:
    # Проверяем адреса и атрибуты ссылок без перехода в почтовый клиент или Telegram.
    _, check = open_page()
    check.has_contact_links(EMAIL, TELEGRAM)


def test_copy_email_and_dismiss_notification(open_page: OpenPage) -> None:
    actions, check = open_page()
    # Подменяем Clipboard API успешным ответом, затем нажимаем настоящую кнопку приложения.
    actions.mock_clipboard("success")
    actions.copy_email()
    # Проверяем переданный в API адрес, уведомление об успехе и его исчезновение по таймеру.
    check.has_copied_email(EMAIL)
    check.has_dismissed_notification()


def test_clipboard_error_and_retry(open_page: OpenPage) -> None:
    actions, check = open_page()
    # Имитируем отказ браузера в доступе к буферу обмена: пользователь должен увидеть ошибку.
    actions.mock_clipboard("denied")
    actions.copy_email()
    check.has_clipboard_error()
    # Разрешаем копирование и повторяем действие на той же странице, проверяя восстановление.
    actions.mock_clipboard("success")
    actions.copy_email()
    check.has_copied_email(EMAIL)


def test_layout_in_both_themes(open_page: OpenPage, output_path: str) -> None:
    # output_path — каталог артефактов текущего теста, который предоставляет pytest-playwright.
    actions, check = open_page()
    for theme in ("light", "dark"):
        if theme == "dark":
            actions.toggle_theme()
        check.has_theme(theme)
        # Прокручиваем нижние секции для их появления, затем возвращаемся наверх.
        actions.prepare_screenshot()
        check.is_at_top()
        check.layout_fits_viewport()
        # Снимки помогают разобрать результат вручную; автоматического сравнения с эталоном здесь нет.
        actions.screenshot(Path(output_path) / f"portfolio-{theme}.png")


def test_reduced_motion(open_page: OpenPage) -> None:
    actions, check = open_page()
    # Сначала убеждаемся, что CSS-анимации включены, затем эмулируем системное уменьшение движения.
    check.has_running_animations()
    actions.prefer_reduced_motion()
    # Анимации должны отключиться, а секции — остаться видимыми.
    check.respects_reduced_motion()


def test_skip_link_keyboard_navigation(open_page: OpenPage) -> None:
    actions, check = open_page()
    # Первый Tab показывает ссылку пропуска меню; Enter должен перевести фокус к main.
    actions.focus_skip_link()
    check.skip_link_has_focus()
    actions.activate_skip_link()
    check.main_has_focus()
