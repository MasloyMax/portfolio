package ru.masloy.portfolio;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static com.codeborne.selenide.Condition.attribute;
import static com.codeborne.selenide.Condition.visible;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

// Отдельный набор проверяет мобильную вёрстку; теги позволяют выбирать эту группу при запуске.
// Расширение создаёт свежую страницу для каждого параметра, поэтому темы и раскрытые блоки не переносятся.
@Tag("ui")
@Tag("responsive")
@ExtendWith(BrowserExtension.class)
class ResponsiveTest {
    @ParameterizedTest(name = "Мобильная вёрстка: {0} CSS px")
    // JUnit выполнит метод дважды: для узкого экрана 320 px и мобильного экрана 390 px.
    @ValueSource(ints = {320, 390})
    void preservesLayoutAndNavigationInBothThemes(int width, PortfolioPage page) {
        // Проверка требует CDP в Chromium. В другом браузере сценарий пропускается через assumption.
        assumeTrue(page.supportsMobileEmulation(), "Device metrics scenarios require local Chrome or Edge");
        // Эмулируем мобильную область страницы и touch, затем проверяем начальную светлую вёрстку.
        page.emulateMobileViewport(width);
        page.awaitLayoutFitsViewport();
        page.awaitNameAndBiographyDoNotOverlap();

        // Раскрываем навыки; полные описания опыта видны сразу.
        page.toggleSkills();
        page.skillDetails.shouldHave(attribute("open"));
        page.skillDescriptions.first().shouldBe(visible);
        page.revealExperience();
        page.experienceItem("Haulmont").shouldBe(visible);
        page.awaitLayoutFitsViewport();

        // В тёмной теме повторяем проверки ширины и отсутствия пересечения имени с биографией.
        page.toggleTheme();
        page.root.shouldHave(attribute("data-theme", "dark"));
        page.awaitLayoutFitsViewport();
        page.awaitNameAndBiographyDoNotOverlap();
        // Проверяем мобильное меню: контакт виден, пункт активен, логотип возвращает в начало страницы.
        page.navigateTo("contact");
        page.awaitSection("contact");
        page.navigationLink("contact").shouldHave(attribute("aria-current", "location"));
        page.email.shouldBe(visible);
        page.backToTopFromLogo();
        page.awaitTop();
    }
}
