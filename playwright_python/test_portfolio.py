from pathlib import Path

import pytest

from .portfolio_page import OpenPage

# Ожидания независимы от src/profile.ts: неверный контент должен ломать тест.
EXPERIENCE = [
    {
        "company": "Raiffeisenbank",
        "description": "Автоматизация и ручное тестирование банковских систем.",
        "highlight": "Проверка REST- и gRPC API",
    },
    {
        "company": "Haulmont",
        "description": "Автотесты для инструментов, которыми пользуются разработчики.",
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
    _, check = open_page()
    check.has_profile(
        [job["company"] for job in EXPERIENCE],
        ["Playwright", "TypeScript", "WebdriverIO", "Java", "PostgreSQL", "GitLab CI/CD"],
    )
    check.has_expanded_experience(**EXPERIENCE[0])
    for job in EXPERIENCE[1:]:
        check.has_collapsed_experience(job["company"])


def test_biography_education_and_languages(open_page: OpenPage) -> None:
    _, check = open_page()
    check.has_biography(current_status="----")


def test_skill_details(open_page: OpenPage) -> None:
    actions, check = open_page()
    check.skill_details_are_expanded(False)
    actions.toggle_skill_details()
    check.skill_details_are_expanded(True)
    actions.toggle_skill_details()
    check.skill_details_are_expanded(False)


def test_anchor_navigation(open_page: OpenPage) -> None:
    actions, check = open_page()
    actions.go_to_about()
    check.is_at_section("about")
    actions.go_to_experience("hero")
    check.is_at_section("experience")
    actions.go_to_contacts()
    check.is_at_section("contact")
    actions.go_to_top("footer")
    check.is_at_top()
    actions.go_to_experience("header")
    check.is_at_section("experience")
    actions.go_to_top("logo")
    check.is_at_top()


@pytest.mark.parametrize("job", EXPERIENCE, ids=["raiffeisenbank", "haulmont", "sber", "yandex"])
def test_experience_accordion(open_page: OpenPage, job: dict[str, str]) -> None:
    actions, check = open_page()
    company = job["company"]
    if company == "Raiffeisenbank":
        actions.toggle_experience(company)
    actions.toggle_experience(company)
    check.has_expanded_experience(**job)
    if company != "Raiffeisenbank":
        check.has_collapsed_experience("Raiffeisenbank")
    actions.toggle_experience(company)
    check.has_collapsed_experience(company)
    check.has_no_expanded_experience()


def test_experience_keyboard_and_focus(open_page: OpenPage) -> None:
    actions, check = open_page()
    job = EXPERIENCE[1]
    actions.toggle_experience_with_keyboard(job["company"], "Enter")
    check.has_expanded_experience(**job)
    check.experience_has_focus(job["company"])
    actions.toggle_experience_with_keyboard(job["company"], "Space")
    check.has_collapsed_experience(job["company"])
    check.experience_has_focus(job["company"])


def test_theme_persists_after_reload(open_page: OpenPage) -> None:
    actions, check = open_page()
    check.has_theme("light")
    for theme in ("dark", "light"):
        actions.toggle_theme()
        check.has_theme(theme)
        actions.reload()
        check.has_theme(theme)


def test_contact_links(open_page: OpenPage) -> None:
    _, check = open_page()
    check.has_contact_links(EMAIL, TELEGRAM)


def test_copy_email_and_dismiss_notification(open_page: OpenPage) -> None:
    actions, check = open_page()
    actions.mock_clipboard("success")
    actions.copy_email()
    check.has_copied_email(EMAIL)
    check.has_dismissed_notification()


def test_clipboard_error_and_retry(open_page: OpenPage) -> None:
    actions, check = open_page()
    actions.mock_clipboard("denied")
    actions.copy_email()
    check.has_clipboard_error()
    actions.mock_clipboard("success")
    actions.copy_email()
    check.has_copied_email(EMAIL)


def test_layout_in_both_themes(open_page: OpenPage, output_path: str) -> None:
    actions, check = open_page()
    for theme in ("light", "dark"):
        if theme == "dark":
            actions.toggle_theme()
        check.has_theme(theme)
        actions.prepare_screenshot()
        check.is_at_top()
        check.layout_fits_viewport()
        actions.screenshot(Path(output_path) / f"portfolio-{theme}.png")


def test_reduced_motion(open_page: OpenPage) -> None:
    actions, check = open_page()
    check.has_running_animations()
    actions.prefer_reduced_motion()
    check.respects_reduced_motion()


def test_skip_link_keyboard_navigation(open_page: OpenPage) -> None:
    actions, check = open_page()
    actions.focus_skip_link()
    check.skip_link_has_focus()
    actions.activate_skip_link()
    check.main_has_focus()
