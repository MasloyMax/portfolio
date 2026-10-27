package ru.masloy.portfolio;

import com.codeborne.selenide.ElementsCollection;
import com.codeborne.selenide.SelenideDriver;
import com.codeborne.selenide.SelenideElement;
import org.openqa.selenium.Keys;
import org.openqa.selenium.chromium.ChromiumDriver;
import org.openqa.selenium.interactions.Actions;

import java.util.Map;

import static com.codeborne.selenide.Condition.cssValue;
import static com.codeborne.selenide.Condition.text;
import static com.codeborne.selenide.Condition.visible;

/** Page Object: хранит локаторы, действия и ожидания состояния одностраничного портфолио. */
final class PortfolioPage {
    // SelenideElement описывает один элемент, ElementsCollection — набор; поиск выполняется при обращении.
    // Поля доступны тестам того же пакета, чтобы сценарии могли проверять ожидаемые тексты и атрибуты.
    final SelenideDriver browser;
    final SelenideElement root;
    final SelenideElement title;
    final SelenideElement header;
    final SelenideElement role;
    final SelenideElement about;
    final SelenideElement facts;
    final SelenideElement education;
    final SelenideElement languages;
    final ElementsCollection technologies;
    final SelenideElement skillDetails;
    final ElementsCollection skillDescriptions;
    final ElementsCollection experienceItems;
    final SelenideElement themeToggle;
    final SelenideElement email;
    final ElementsCollection telegramLinks;
    final SelenideElement notification;
    final SelenideElement skipLink;
    final SelenideElement main;

    PortfolioPage(SelenideDriver browser) {
        // Получаем отдельный драйвер из BrowserExtension. $ задаёт поиск одного элемента, $$ — коллекции.
        this.browser = browser;
        // Корень и первый экран: имя, роль и шапка с навигацией.
        root = browser.$("html");
        title = browser.$("#hero-title");
        header = browser.$("header");
        role = browser.$("#home .hero-eyebrow");
        // Ищем вложенные сведения внутри about, чтобы не захватить похожие элементы других секций.
        about = browser.$("#about");
        facts = about.$("dl");
        education = about.$("[role='group'][aria-labelledby='education-title']");
        languages = about.$("[role='group'][aria-labelledby='languages-title']");
        // Технологии и раскрываемые описания навыков; descriptions — определения dd внутри details.
        technologies = browser.$$("#skills ul[aria-label='Технологии'] li");
        skillDetails = browser.$("#skills details");
        skillDescriptions = skillDetails.$$("dd");
        // Полные описания всех мест работы всегда доступны.
        experienceItems = browser.$$("#experience article");
        // Префикс aria-label находит переключатель и в светлой, и в тёмной теме.
        themeToggle = header.$("button[aria-label^='Включить']");
        // Контактные ссылки и статус копирования; внешние ссылки проверяются без перехода по ним.
        email = browser.$("#contact a[href^='mailto:']");
        telegramLinks = browser.$$("#home a[target='_blank'], #contact a[target='_blank']");
        notification = browser.$("#contact [role='status']");
        // Skip-link позволяет пользователю клавиатуры сразу перейти к основному содержимому.
        skipLink = browser.$("a[href='#main']");
        main = browser.$("#main");
    }

    void open() {
        // Полный baseUrl сохраняет путь /portfolio/ при запуске на GitHub Pages.
        browser.open(browser.config().baseUrl());
        // Ждём появления основного содержимого: завершение навигации ещё не гарантирует отрисовку React.
        title.shouldBe(visible);
        header.shouldBe(visible);
    }

    void refresh() {
        // Обновляем документ в той же сессии, сохраняя localStorage для проверки выбранной темы.
        browser.refresh();
        title.shouldBe(visible);
    }

    SelenideElement experienceItem(String company) {
        return experienceItems.findBy(com.codeborne.selenide.Condition.attribute("aria-label", company));
    }

    void revealExperience() {
        // Секция появляется при прокрутке; opacity=1 подтверждает завершение её проявления.
        scrollTo(browser.$("#experience"));
        browser.$("#experience").shouldHave(cssValue("opacity", "1"));
    }

    void toggleSkills() {
        // Клик по summary переключает стандартный HTML details и его атрибут open.
        clickInView(skillDetails.$("summary"));
    }

    SelenideElement navigationLink(String section) {
        // Формируем локатор пункта меню по якорю секции, например contact -> href='#contact'.
        return header.$("nav a[href='#" + section + "']");
    }

    void navigateTo(String section) {
        // Нажимаем настоящую ссылку: приложение само обновляет якорь и запускает прокрутку.
        navigationLink(section).click();
    }

    void navigateFromHeroToExperience() {
        // Альтернативный путь к опыту — кнопка-ссылка первого экрана.
        clickInView(browser.$("#home a[href='#experience']"));
    }

    void backToTopFromFooter() {
        // Сначала прокручиваем до ссылки в подвале, затем возвращаемся через неё к #home.
        clickInView(browser.$("footer a[href='#home']"));
    }

    void backToTopFromLogo() {
        // Логотип находится в закреплённой шапке и также ведёт к #home.
        header.$("a[href='#home']").click();
    }

    void awaitSection(String section) {
        // Ждём одновременно нужного якоря, видимости секции и её положения ниже закреплённой шапки.
        // getBoundingClientRect даёт координаты относительно экрана; 1 px допускает округление браузера.
        awaitScript("Anchor must place the section below the sticky header", """
                const target = document.getElementById(arguments[0]).getBoundingClientRect();
                const header = document.querySelector('header').getBoundingClientRect();
                return location.hash === '#' + arguments[0]
                    && target.top >= header.bottom - 1
                    && target.top < innerHeight && target.bottom > header.bottom;
                """, section);
    }

    void awaitTop() {
        // Проверяем и URL, и фактическую прокрутку: изменение hash само по себе не означает возврат наверх.
        awaitScript("Return-to-top link must reach the top", "return location.hash === '#home' && scrollY <= 1;");
    }

    void toggleTheme() {
        // Меняем тему через обработчик приложения, который также сохраняет выбор пользователя.
        themeToggle.click();
    }

    void revealContact() {
        // Прокрутка запускает появление секции контактов; ждём полной непрозрачности.
        scrollTo(browser.$("#contact"));
        browser.$("#contact").shouldHave(cssValue("opacity", "1"));
    }

    void copyEmail() {
        // Показываем контакты и нажимаем настоящую кнопку; ответ Clipboard API задаётся тестом отдельно.
        revealContact();
        clickInView(browser.$("#contact button[aria-label='Скопировать почту']"));
    }

    /** Подменяем только Clipboard API: обработчик React и таймер уведомления продолжают работать. */
    void mockClipboard(boolean denied) {
        // JavaScript выполняется внутри страницы; denied приходит через arguments[0].
        // Отказ моделируем исключением, успех — сохранением аргумента в window для проверки полного адреса.
        // Предыдущее значение удаляем; системный буфер обмена эта подмена не изменяет.
        browser.executeJavaScript("""
                delete window.__selenimCopiedEmail;
                const denied = arguments[0];
                Object.defineProperty(navigator, 'clipboard', {
                    configurable: true,
                    value: {
                        async writeText(value) {
                            if (denied) throw new DOMException('Denied by test', 'NotAllowedError');
                            window.__selenimCopiedEmail = value;
                        }
                    }
                });
                """, denied);
    }

    void awaitCopiedEmail(String expected) {
        // Дожидаемся записи в переменную подмены и сравниваем с независимым ожиданием из теста.
        awaitScript("The real handler must pass the complete email to Clipboard API",
                "return window.__selenimCopiedEmail === arguments[0];", expected);
    }

    void pressTab() {
        // Отправляем Tab текущему окну, проверяя естественный порядок клавиатурного фокуса.
        new Actions(browser.getWebDriver()).sendKeys(Keys.TAB).perform();
    }

    void pressEnter() {
        // Enter активирует элемент, на котором сейчас находится фокус (в сценарии это skip-link).
        new Actions(browser.getWebDriver()).sendKeys(Keys.ENTER).perform();
    }

    boolean supportsMobileEmulation() {
        // Команды CDP ниже доступны драйверам на основе Chromium; тест проверяет это до приведения типа.
        return browser.getWebDriver() instanceof ChromiumDriver;
    }

    void emulateMobileViewport(int width) {
        // CDP меняет размеры области страницы в CSS-пикселях и включает мобильный режим и touch.
        // Это эмуляция браузера, а не запуск на физическом телефоне.
        ChromiumDriver chromium = (ChromiumDriver) browser.getWebDriver();
        chromium.executeCdpCommand("Emulation.setDeviceMetricsOverride", Map.of(
                "width", width, "height", 844, "deviceScaleFactor", 1, "mobile", true));
        chromium.executeCdpCommand("Emulation.setTouchEmulationEnabled", Map.of(
                "enabled", true, "maxTouchPoints", 1));
        // Перезагружаем страницу под новые метрики и проверяем, что браузер применил нужную ширину.
        refresh();
        awaitScript("Mobile emulation must use the requested CSS viewport width",
                "return innerWidth === arguments[0];", width);
    }

    void awaitLayoutFitsViewport() {
        // После загрузки шрифтов содержимое должно помещаться в доступную ширину документа.
        awaitScript("Page must not overflow horizontally", """
                return document.fonts.status === 'loaded'
                    && document.documentElement.scrollWidth <= document.documentElement.clientWidth;
                """);
        // Каждая ссылка и кнопка шапки должна иметь размер и полностью находиться внутри экрана.
        awaitScript("All header controls must fit the viewport", """
                return [...document.querySelectorAll('header a, header button')].every(element => {
                    const box = element.getBoundingClientRect();
                    return box.width > 0 && box.height > 0 && box.left >= 0 && box.top >= 0
                        && box.right <= innerWidth && box.bottom <= innerHeight;
                });
                """);
    }

    void awaitNameAndBiographyDoNotOverlap() {
        // Для отсутствия пересечения достаточно, чтобы один блок был целиком слева/справа или выше/ниже другого.
        awaitScript("Name and biography must not overlap", """
                const name = document.getElementById('hero-title').getBoundingClientRect();
                const about = document.getElementById('about').getBoundingClientRect();
                return name.right <= about.left || name.left >= about.right
                    || name.bottom <= about.top || name.top >= about.bottom;
                """);
    }

    void awaitScript(String message, String script, Object... arguments) {
        // Общий опрос JavaScript-условия до true или таймаута Selenide; без фиксированного Thread.sleep.
        // message поясняет причину ожидания при падении, arguments становятся arguments[] внутри JavaScript.
        browser.Wait().withMessage(message)
                .until(ignored -> Boolean.TRUE.equals(browser.executeJavaScript(script, arguments)));
    }

    private void clickInView(SelenideElement element) {
        // Центрируем элемент, ждём видимости и выполняем обычный WebDriver-клик.
        scrollTo(element);
        element.shouldBe(visible).click();
    }

    private void scrollTo(SelenideElement element) {
        // Мгновенная прокрутка к центру не оставляет кнопку под закреплённой шапкой во время клика.
        browser.executeJavaScript("arguments[0].scrollIntoView({block: 'center', behavior: 'instant'});",
                element.getWrappedElement());
    }
}
