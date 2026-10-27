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

// JUnit находит методы с @Test/@ParameterizedTest; @DisplayName задаёт понятное имя в отчёте.
// BrowserExtension перед каждым тестом открывает отдельный браузер и подставляет аргумент PortfolioPage.
// shouldBe/shouldHave ожидают условие до таймаута; assertEquals/assertTrue проверяют значение сразу.
@Tag("ui")
@ExtendWith(BrowserExtension.class)
class PortfolioTest {
    private static final String EMAIL = "masloymax@gmail.com";
    private static final String TELEGRAM = "https://t.me/masloymax";

    // Неизменяемый набор ожидаемых данных компании; toString делает имя параметризованного теста читаемым.
    record Job(String company, String description, String highlight) {
        @Override public String toString() { return company; }
    }

    static Stream<Job> jobs() {
        // Данные независимы от src/profile.ts: неверный контент сайта должен приводить к падению теста.
        // @MethodSource берёт отсюда отдельный Job для каждой проверки опыта.
        return Stream.of(
                new Job("Raiffeisenbank", "Автоматизация и ручное тестирование банковских систем.",
                        "проверял REST и gRPC API"),
                new Job("Haulmont", "Плагины для IntelliJ IDEA и VS Code — инструменты для разработчиков.",
                        "Разработал и внедрил систему автотестов"),
                new Job("Сбер", "Веб-сервис «Пульс» для обучения сотрудников.",
                        "С нуля разработал тестовую модель сервиса отчётности."),
                new Job("Яндекс", "Мобильные приложения и веб-версия сервиса такси.",
                        "Создал и обучил команду из трёх тестировщиков."));
    }

    @Test
    @DisplayName("Профиль, технологии и начальное состояние опыта")
    void showsProfileAndInitialExperience(PortfolioPage page) {
        // Страница уже открыта расширением. Сверяем заголовок вкладки, имя, роль и краткие факты.
        assertEquals("Максим Маслов — Automation QA Engineer", page.browser.title());
        page.title.shouldHave(attribute("aria-label", "Максим Маслов"), text("Максим"), text("Маслов"));
        page.role.shouldHave(exactText("Automation QA Engineer (TypeScript / Playwright)"));
        page.facts.shouldHave(text("Воронеж, Россия"), text("С 2021 года"));
        // Всего ожидаем 15 технологий; отдельно убеждаемся, что ключевые из них видны пользователю.
        page.technologies.shouldHave(size(15));
        for (String technology : new String[]{"Playwright", "TypeScript", "WebdriverIO", "Java", "PostgreSQL", "GitLab CI/CD"}) {
            page.technologies.findBy(exactText(technology)).shouldBe(visible);
        }
        page.revealExperience();
        page.experienceItems.shouldHave(size(4));
        jobs().forEach(job -> assertVisibleExperience(page, job));
    }

    @Test
    @DisplayName("Биография, образование и языки соответствуют профилю")
    void showsEducationAndLanguages(PortfolioPage page) {
        // Сверяем биографию и содержание обоих мест учёбы, затем полный список языков по порядку.
        page.about.shouldHave(text("Есть опыт создания тестовой модели сервиса и обучения команды тестировщиков."));
        page.education.$$("li").shouldHave(size(2));
        page.education.shouldHave(text("Инженер"), text("Воронежский государственный технический университет"),
                text("2022"), text("Техник · радиоэлектроника"), text("ВГПГК"), text("2018"));
        page.languages.$$("li").shouldHave(texts("Русский — родной", "Английский — B1"));
    }

    @Test
    @DisplayName("Описания навыков раскрываются и скрываются")
    void togglesSkillDescriptions(PortfolioPage page) {
        // Проверяем начальное закрытое состояние HTML details и невидимость первого описания.
        page.skillDetails.shouldNotHave(attribute("open"));
        page.skillDescriptions.first().shouldBe(hidden);
        // Раскрываем блок и проверяем количество, текст и видимость описаний навыков.
        page.toggleSkills();
        page.skillDetails.shouldHave(attribute("open"));
        page.skillDescriptions.shouldHave(size(15));
        page.skillDescriptions.first().shouldBe(visible).shouldHave(exactText("Веб-автотесты"));
        page.skillDescriptions.findBy(exactText("Автоматизация тестирования")).shouldBe(visible);
        // Длинный раскрытый список не должен выходить за ширину экрана.
        page.awaitLayoutFitsViewport();
        // Повторное нажатие должно убрать атрибут open и скрыть описания.
        page.toggleSkills();
        page.skillDetails.shouldNotHave(attribute("open"));
        page.skillDescriptions.first().shouldBe(hidden);
    }

    @ParameterizedTest(name = "Опыт без дополнительных кликов: {0}")
    @MethodSource("jobs")
    void showsEachEmployerWithoutClicks(Job job, PortfolioPage page) {
        page.revealExperience();
        assertVisibleExperience(page, job);
    }

    @Test
    @DisplayName("Якоря, активный пункт меню и возврат наверх работают")
    void navigatesBetweenSections(PortfolioPage page) {
        // Переходим по меню и ссылке первого экрана: секция должна оказаться под шапкой, пункт меню — активным.
        page.navigateTo("about");
        assertAtSection(page, "about");
        page.navigateFromHeroToExperience();
        assertAtSection(page, "experience");
        page.navigateTo("contact");
        assertAtSection(page, "contact");
        // Проверяем оба пути наверх: ссылку в подвале и логотип после повторного перехода к опыту.
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
        // Новый браузер начинает со светлой темы. Выбранная тёмная должна пережить обновление документа.
        assertTheme(page, "light");
        page.toggleTheme();
        assertTheme(page, "dark");
        page.refresh();
        assertTheme(page, "dark");
        // Повторяем ту же проверку для возврата к светлой теме.
        page.toggleTheme();
        assertTheme(page, "light");
        page.refresh();
        assertTheme(page, "light");
    }

    @Test
    @DisplayName("Почта и Telegram содержат правильные адреса и атрибуты")
    void exposesCorrectContactLinks(PortfolioPage page) {
        // Проверяем текст и назначения ссылок без открытия почтового клиента и внешнего сайта.
        page.revealContact();
        page.email.shouldHave(exactText(EMAIL), attribute("href", "mailto:" + EMAIL));
        page.telegramLinks.shouldHave(size(3));
        for (SelenideElement link : page.telegramLinks.asFixedIterable()) {
            link.shouldHave(attribute("href", TELEGRAM), attribute("target", "_blank"));
            // rel может содержать несколько значений: проверяем отдельное слово noreferrer.
            String rel = link.getDomAttribute("rel");
            assertTrue(rel != null && Arrays.asList(rel.split("\\s+")).contains("noreferrer"),
                    "External contact links must contain rel=noreferrer");
        }
    }

    @Test
    @DisplayName("Копирование передаёт полный адрес и автоматически скрывает уведомление")
    void copiesEmailAndDismissesNotification(PortfolioPage page) {
        // false разрешает копирование в подмене API; настоящая кнопка передаёт в неё адрес.
        page.mockClipboard(false);
        page.copyEmail();
        page.awaitCopiedEmail(EMAIL);
        page.notification.shouldHave(exactText("Почта скопирована"), cssValue("opacity", "1"));
        // Ждём срабатывания таймера приложения: текст очищается, затем уведомление становится прозрачным.
        // Duration задаёт предел ожидания, а не фиксированную паузу в шесть секунд.
        page.notification.shouldHave(exactText(""), Duration.ofSeconds(6));
        page.notification.shouldHave(cssValue("opacity", "0"));
    }

    @Test
    @DisplayName("Отказ Clipboard API показывает ошибку и позволяет повторить действие")
    void recoversAfterClipboardFailure(PortfolioPage page) {
        // true имитирует отказ в доступе к Clipboard API. Адрес должен остаться видимым для ручного копирования.
        page.mockClipboard(true);
        page.copyEmail();
        page.notification.shouldHave(exactText("Не удалось скопировать. Скопируйте адрес вручную."),
                cssValue("opacity", "1"));
        page.email.shouldBe(visible);
        // В той же сессии меняем ответ API на успешный и проверяем возможность повторить действие.
        page.mockClipboard(false);
        page.copyEmail();
        page.awaitCopiedEmail(EMAIL);
        page.notification.shouldHave(exactText("Почта скопирована"), cssValue("opacity", "1"));
    }

    @Test
    @DisplayName("Tab и Enter переводят фокус по skip-link к основному содержимому")
    void skipsToMainContentWithKeyboard(PortfolioPage page) {
        // Первый Tab должен показать skip-link; Enter переводит фокус к main, пропуская меню.
        page.pressTab();
        page.skipLink.shouldBe(focused, visible);
        page.pressEnter();
        page.main.shouldBe(focused);
        page.awaitScript("Skip link must navigate to #main", "return location.hash === '#main';");
    }

    private static void assertAtSection(PortfolioPage page, String section) {
        // Проверяем реальное положение секции после прокрутки и доступную отметку активного пункта меню.
        page.awaitSection(section);
        page.navigationLink(section).shouldHave(attribute("aria-current", "location"));
    }

    private static void assertTheme(PortfolioPage page, String theme) {
        // Подтверждаем выбранную тему по атрибуту, фону, подписи переключателя и сохранению в localStorage.
        // Color приводит браузерное rgb/rgba-представление к одному hex-формату для сравнения.
        boolean dark = theme.equals("dark");
        page.root.shouldHave(attribute("data-theme", theme));
        assertEquals(dark ? "#141414" : "#f8f8f8",
                Color.fromString(page.root.getCssValue("background-color")).asHex());
        page.themeToggle.shouldHave(attribute("aria-label", dark ? "Включить светлую тему" : "Включить тёмную тему"));
        page.awaitScript("Theme choice must be stored", "return localStorage.getItem('portfolio-theme') === arguments[0];", theme);
    }

    private static void assertVisibleExperience(PortfolioPage page, Job job) {
        page.experienceItem(job.company()).shouldBe(visible)
                .shouldHave(text(job.description()), text(job.highlight()));
    }

}
