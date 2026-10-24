package ru.masloy.portfolio;

import com.codeborne.selenide.SelenideElement;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;
import org.openqa.selenium.Keys;
import org.openqa.selenium.support.Color;

import java.time.Duration;
import java.util.Arrays;
import java.util.stream.Stream;

import static com.codeborne.selenide.CollectionCondition.size;
import static com.codeborne.selenide.CollectionCondition.texts;
import static com.codeborne.selenide.Condition.attribute;
import static com.codeborne.selenide.Condition.cssValue;
import static com.codeborne.selenide.Condition.exactText;
import static com.codeborne.selenide.Condition.focused;
import static com.codeborne.selenide.Condition.hidden;
import static com.codeborne.selenide.Condition.text;
import static com.codeborne.selenide.Condition.visible;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@Tag("ui")
@ExtendWith(BrowserExtension.class)
class PortfolioTest {
    private static final String EMAIL = "masloymax@gmail.com";
    private static final String TELEGRAM = "https://t.me/masloymax";

    record Job(String company, String description, String highlight) {
        @Override public String toString() { return company; }
    }

    static Stream<Job> jobs() {
        // Deliberately independent of src/profile.ts: incorrect content must fail a test.
        return Stream.of(
                new Job("Raiffeisenbank", "Автоматизация и ручное тестирование банковских систем.",
                        "проверял REST и gRPC API"),
                new Job("Haulmont", "Автотесты для инструментов, которыми пользуются разработчики.",
                        "Разработал и внедрил систему автотестов"),
                new Job("Сбер", "Веб-сервис «Пульс» для обучения сотрудников.",
                        "С нуля разработал тестовую модель сервиса отчётности."),
                new Job("Яндекс", "Мобильные приложения и веб-версия сервиса такси.",
                        "Создал и обучил команду из трёх тестировщиков."));
    }

    @Test
    @DisplayName("Профиль, технологии и начальное состояние опыта")
    void showsProfileAndInitialExperience(PortfolioPage page) {
        assertEquals("Максим Маслов — Automation QA Engineer", page.browser.title());
        page.title.shouldHave(attribute("aria-label", "Максим Маслов"), text("Максим"), text("Маслов."));
        page.role.shouldHave(exactText("Automation QA Engineer (TypeScript / Playwright)"));
        page.facts.shouldHave(text("Воронеж, Россия"), text("С 2021 года"));
        page.technologies.shouldHave(size(15));
        for (String technology : new String[]{"Playwright", "TypeScript", "WebdriverIO", "Java", "PostgreSQL", "GitLab CI/CD"}) {
            page.technologies.findBy(exactText(technology)).shouldBe(visible);
        }
        page.revealExperience();
        page.experienceItems.shouldHave(size(4));
        page.experienceButton("Raiffeisenbank").shouldHave(attribute("aria-expanded", "true"));
        page.expandedExperienceButtons.shouldHave(size(1));
        for (String company : new String[]{"Haulmont", "Сбер", "Яндекс"}) {
            assertCollapsed(page, company);
        }
    }

    @Test
    @DisplayName("Биография, образование и языки соответствуют профилю")
    void showsEducationAndLanguages(PortfolioPage page) {
        page.about.shouldHave(text("В Raiffeisenbank обновил архитектуру проекта автотестов и автоматизировал тестирование ролевой модели."));
        page.education.$$("li").shouldHave(size(2));
        page.education.shouldHave(text("Инженер"), text("Воронежский государственный технический университет"),
                text("2022"), text("Техник · радиоэлектроника"), text("ВГПГК"), text("2018"));
        page.languages.$$("li").shouldHave(texts("Русский — родной", "Английский — B1"));
    }

    @Test
    @DisplayName("Описания навыков раскрываются и скрываются")
    void togglesSkillDescriptions(PortfolioPage page) {
        page.skillDetails.shouldNotHave(attribute("open"));
        page.skillDescriptions.first().shouldBe(hidden);
        page.toggleSkills();
        page.skillDetails.shouldHave(attribute("open"));
        page.skillDescriptions.shouldHave(size(15));
        page.skillDescriptions.first().shouldBe(visible).shouldHave(exactText("Веб-автотесты"));
        page.skillDescriptions.findBy(exactText("Автоматизация тестирования")).shouldBe(visible);
        page.awaitLayoutFitsViewport();
        page.toggleSkills();
        page.skillDetails.shouldNotHave(attribute("open"));
        page.skillDescriptions.first().shouldBe(hidden);
    }

    @ParameterizedTest(name = "Опыт: {0}")
    @MethodSource("jobs")
    void expandsAndCollapsesEachEmployer(Job job, PortfolioPage page) {
        page.revealExperience();
        if (job.company().equals("Raiffeisenbank")) page.toggleExperience(job.company());
        page.toggleExperience(job.company());
        assertExpanded(page, job);
        for (String company : new String[]{"Raiffeisenbank", "Haulmont", "Сбер", "Яндекс"}) {
            if (!company.equals(job.company())) assertCollapsed(page, company);
        }
        page.toggleExperience(job.company());
        assertCollapsed(page, job.company());
        page.expandedExperienceButtons.shouldHave(size(0));
    }

    @Test
    @DisplayName("Аккордеон поддерживает Enter и Space с сохранением фокуса")
    void operatesExperienceWithKeyboard(PortfolioPage page) {
        Job job = jobs().filter(value -> value.company().equals("Haulmont")).findFirst().orElseThrow();
        page.revealExperience();
        page.pressExperience(job.company(), Keys.ENTER);
        assertExpanded(page, job);
        page.experienceButton(job.company()).shouldBe(focused);
        page.pressExperience(job.company(), Keys.SPACE);
        assertCollapsed(page, job.company());
        page.experienceButton(job.company()).shouldBe(focused);
    }

    @Test
    @DisplayName("Якоря, активный пункт меню и возврат наверх работают")
    void navigatesBetweenSections(PortfolioPage page) {
        page.navigateTo("about");
        assertAtSection(page, "about");
        page.navigateFromHeroToExperience();
        assertAtSection(page, "experience");
        page.navigateTo("contact");
        assertAtSection(page, "contact");
        page.backToTopFromFooter();
        page.awaitTop();
        page.navigateTo("experience");
        assertAtSection(page, "experience");
        page.backToTopFromLogo();
        page.awaitTop();
    }

    @Test
    @DisplayName("Обе темы сохраняются после обновления страницы")
    void persistsBothThemes(PortfolioPage page) {
        assertTheme(page, "light");
        page.toggleTheme();
        assertTheme(page, "dark");
        page.refresh();
        assertTheme(page, "dark");
        page.toggleTheme();
        assertTheme(page, "light");
        page.refresh();
        assertTheme(page, "light");
    }

    @Test
    @DisplayName("Почта и Telegram содержат правильные адреса и атрибуты")
    void exposesCorrectContactLinks(PortfolioPage page) {
        page.revealContact();
        page.email.shouldHave(exactText(EMAIL), attribute("href", "mailto:" + EMAIL));
        page.telegramLinks.shouldHave(size(3));
        for (SelenideElement link : page.telegramLinks.asFixedIterable()) {
            link.shouldHave(attribute("href", TELEGRAM), attribute("target", "_blank"));
            String rel = link.getDomAttribute("rel");
            assertTrue(rel != null && Arrays.asList(rel.split("\\s+")).contains("noreferrer"),
                    "External contact links must contain rel=noreferrer");
        }
    }

    @Test
    @DisplayName("Копирование передаёт полный адрес и автоматически скрывает уведомление")
    void copiesEmailAndDismissesNotification(PortfolioPage page) {
        page.mockClipboard(false);
        page.copyEmail();
        page.awaitCopiedEmail(EMAIL);
        page.notification.shouldHave(exactText("Почта скопирована"), cssValue("opacity", "1"));
        page.notification.shouldHave(exactText(""), Duration.ofSeconds(6));
        page.notification.shouldHave(cssValue("opacity", "0"));
    }

    @Test
    @DisplayName("Отказ Clipboard API показывает ошибку и позволяет повторить действие")
    void recoversAfterClipboardFailure(PortfolioPage page) {
        page.mockClipboard(true);
        page.copyEmail();
        page.notification.shouldHave(exactText("Не удалось скопировать. Скопируйте адрес вручную."),
                cssValue("opacity", "1"));
        page.email.shouldBe(visible);
        page.mockClipboard(false);
        page.copyEmail();
        page.awaitCopiedEmail(EMAIL);
        page.notification.shouldHave(exactText("Почта скопирована"), cssValue("opacity", "1"));
    }

    @Test
    @DisplayName("Tab и Enter переводят фокус по skip-link к основному содержимому")
    void skipsToMainContentWithKeyboard(PortfolioPage page) {
        page.pressTab();
        page.skipLink.shouldBe(focused, visible);
        page.pressEnter();
        page.main.shouldBe(focused);
        page.awaitScript("Skip link must navigate to #main", "return location.hash === '#main';");
    }

    private static void assertAtSection(PortfolioPage page, String section) {
        page.awaitSection(section);
        page.navigationLink(section).shouldHave(attribute("aria-current", "location"));
    }

    private static void assertTheme(PortfolioPage page, String theme) {
        boolean dark = theme.equals("dark");
        page.root.shouldHave(attribute("data-theme", theme));
        assertEquals(dark ? "#141414" : "#f8f8f8",
                Color.fromString(page.root.getCssValue("background-color")).asHex());
        page.themeToggle.shouldHave(attribute("aria-label", dark ? "Включить светлую тему" : "Включить тёмную тему"));
        page.awaitScript("Theme choice must be stored", "return localStorage.getItem('portfolio-theme') === arguments[0];", theme);
    }

    private static void assertExpanded(PortfolioPage page, Job job) {
        SelenideElement button = page.experienceButton(job.company());
        SelenideElement panel = page.experiencePanel(job.company());
        button.shouldHave(attribute("aria-expanded", "true"));
        page.expandedExperienceButtons.shouldHave(size(1));
        panel.shouldBe(visible).shouldHave(attribute("aria-hidden", "false"), text(job.description()), text(job.highlight()));
        assertEquals(panel.getDomAttribute("id"), button.getDomAttribute("aria-controls"),
                "Accordion button must reference its own panel");
    }

    private static void assertCollapsed(PortfolioPage page, String company) {
        page.experienceButton(company).shouldHave(attribute("aria-expanded", "false"));
        page.experiencePanel(company).shouldHave(attribute("aria-hidden", "true")).shouldBe(hidden);
    }
}