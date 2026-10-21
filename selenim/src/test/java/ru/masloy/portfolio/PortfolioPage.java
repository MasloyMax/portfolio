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

/** Locators and interactions for the actual mounted single-page portfolio. */
final class PortfolioPage {
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
    final ElementsCollection expandedExperienceButtons;
    final SelenideElement themeToggle;
    final SelenideElement email;
    final ElementsCollection telegramLinks;
    final SelenideElement notification;
    final SelenideElement skipLink;
    final SelenideElement main;

    PortfolioPage(SelenideDriver browser) {
        this.browser = browser;
        root = browser.$("html");
        title = browser.$("#hero-title");
        header = browser.$("header");
        role = browser.$("#home .hero-eyebrow");
        about = browser.$("#about");
        facts = about.$("dl");
        education = about.$("[role='group'][aria-labelledby='education-title']");
        languages = about.$("[role='group'][aria-labelledby='languages-title']");
        technologies = browser.$$("#home ul[aria-label='Технологии'] li");
        skillDetails = browser.$("#home details");
        skillDescriptions = skillDetails.$$("dd");
        experienceItems = browser.$$("#experience article");
        expandedExperienceButtons = browser.$$("#experience button[aria-expanded='true']");
        themeToggle = header.$("button[aria-label^='Включить']");
        email = browser.$("#contact a[href^='mailto:']");
        telegramLinks = browser.$$("#home a[target='_blank'], #contact a[target='_blank']");
        notification = browser.$("#contact [role='status']");
        skipLink = browser.$("a[href='#main']");
        main = browser.$("#main");
    }

    void open() {
        // Opening the full configured URL preserves /portfolio/ on GitHub Pages.
        browser.open(browser.config().baseUrl());
        title.shouldBe(visible);
        header.shouldBe(visible);
    }

    void refresh() {
        browser.refresh();
        title.shouldBe(visible);
    }

    SelenideElement experienceButton(String company) {
        return experienceItems.findBy(text(company)).$("button[aria-expanded]");
    }

    SelenideElement experiencePanel(String company) {
        return experienceItems.findBy(text(company)).$("[role='region']");
    }

    void revealExperience() {
        scrollTo(browser.$("#experience"));
        browser.$("#experience").shouldHave(cssValue("opacity", "1"));
    }

    void toggleExperience(String company) {
        clickInView(experienceButton(company));
    }

    void pressExperience(String company, Keys key) {
        SelenideElement button = experienceButton(company);
        scrollTo(button);
        button.sendKeys(key);
    }

    void toggleSkills() {
        clickInView(skillDetails.$("summary"));
    }

    SelenideElement navigationLink(String section) {
        return header.$("nav a[href='#" + section + "']");
    }

    void navigateTo(String section) {
        navigationLink(section).click();
    }

    void navigateFromHeroToExperience() {
        clickInView(browser.$("#home a[href='#experience']"));
    }

    void backToTopFromFooter() {
        clickInView(browser.$("footer a[href='#home']"));
    }

    void backToTopFromLogo() {
        header.$("a[href='#home']").click();
    }

    void awaitSection(String section) {
        awaitScript("Anchor must place the section below the sticky header", """
                const target = document.getElementById(arguments[0]).getBoundingClientRect();
                const header = document.querySelector('header').getBoundingClientRect();
                return location.hash === '#' + arguments[0]
                    && target.top >= header.bottom - 1
                    && target.top < innerHeight && target.bottom > header.bottom;
                """, section);
    }

    void awaitTop() {
        awaitScript("Return-to-top link must reach the top", "return location.hash === '#home' && scrollY <= 1;");
    }

    void toggleTheme() {
        themeToggle.click();
    }

    void revealContact() {
        scrollTo(browser.$("#contact"));
        browser.$("#contact").shouldHave(cssValue("opacity", "1"));
    }

    void copyEmail() {
        revealContact();
        clickInView(browser.$("#contact button[aria-label='Скопировать почту']"));
    }

    /** Stub only the browser boundary; keep the real React click handler and timer. */
    void mockClipboard(boolean denied) {
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
        awaitScript("The real handler must pass the complete email to Clipboard API",
                "return window.__selenimCopiedEmail === arguments[0];", expected);
    }

    void pressTab() {
        new Actions(browser.getWebDriver()).sendKeys(Keys.TAB).perform();
    }

    void pressEnter() {
        new Actions(browser.getWebDriver()).sendKeys(Keys.ENTER).perform();
    }

    boolean supportsMobileEmulation() {
        return browser.getWebDriver() instanceof ChromiumDriver;
    }

    void emulateMobileViewport(int width) {
        ChromiumDriver chromium = (ChromiumDriver) browser.getWebDriver();
        chromium.executeCdpCommand("Emulation.setDeviceMetricsOverride", Map.of(
                "width", width, "height", 844, "deviceScaleFactor", 1, "mobile", true));
        chromium.executeCdpCommand("Emulation.setTouchEmulationEnabled", Map.of(
                "enabled", true, "maxTouchPoints", 1));
        refresh();
        awaitScript("Mobile emulation must use the requested CSS viewport width",
                "return innerWidth === arguments[0];", width);
    }

    void awaitExperienceSettled() {
        // Expanded/visible changes before the accordion finishes changing page height.
        awaitScript("Experience transitions must settle before anchor navigation", """
                return document.getElementById('experience').getAnimations({subtree: true})
                    .every(animation => !animation.pending && animation.playState !== 'running');
                """);
    }

    void awaitLayoutFitsViewport() {
        awaitScript("Page must not overflow horizontally", """
                return document.fonts.status === 'loaded'
                    && document.documentElement.scrollWidth <= document.documentElement.clientWidth;
                """);
        awaitScript("All header controls must fit the viewport", """
                return [...document.querySelectorAll('header a, header button')].every(element => {
                    const box = element.getBoundingClientRect();
                    return box.width > 0 && box.height > 0 && box.left >= 0 && box.top >= 0
                        && box.right <= innerWidth && box.bottom <= innerHeight;
                });
                """);
    }

    void awaitNameAndBiographyDoNotOverlap() {
        awaitScript("Name and biography must not overlap", """
                const name = document.getElementById('hero-title').getBoundingClientRect();
                const about = document.getElementById('about').getBoundingClientRect();
                return name.right <= about.left || name.left >= about.right
                    || name.bottom <= about.top || name.top >= about.bottom;
                """);
    }

    void awaitScript(String message, String script, Object... arguments) {
        browser.Wait().withMessage(message)
                .until(ignored -> Boolean.TRUE.equals(browser.executeJavaScript(script, arguments)));
    }

    private void clickInView(SelenideElement element) {
        scrollTo(element);
        element.shouldBe(visible).click();
    }

    private void scrollTo(SelenideElement element) {
        browser.executeJavaScript("arguments[0].scrollIntoView({block: 'center', behavior: 'instant'});",
                element.getWrappedElement());
    }
}