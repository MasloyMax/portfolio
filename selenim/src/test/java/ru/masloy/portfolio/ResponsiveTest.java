package ru.masloy.portfolio;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static com.codeborne.selenide.Condition.attribute;
import static com.codeborne.selenide.Condition.visible;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

@Tag("ui")
@Tag("responsive")
@ExtendWith(BrowserExtension.class)
class ResponsiveTest {
    @ParameterizedTest(name = "Мобильная вёрстка: {0} CSS px")
    @ValueSource(ints = {320, 390})
    void preservesLayoutAndNavigationInBothThemes(int width, PortfolioPage page) {
        assumeTrue(page.supportsMobileEmulation(), "Device metrics scenarios require local Chrome or Edge");
        page.emulateMobileViewport(width);
        page.awaitLayoutFitsViewport();
        page.awaitNameAndBiographyDoNotOverlap();

        page.toggleSkills();
        page.skillDetails.shouldHave(attribute("open"));
        page.skillDescriptions.first().shouldBe(visible);
        page.revealExperience();
        page.toggleExperience("Haulmont");
        page.experienceButton("Haulmont").shouldHave(attribute("aria-expanded", "true"));
        page.experiencePanel("Haulmont").shouldBe(visible);
        page.awaitLayoutFitsViewport();

        page.toggleTheme();
        page.root.shouldHave(attribute("data-theme", "dark"));
        page.awaitLayoutFitsViewport();
        page.awaitNameAndBiographyDoNotOverlap();
        page.awaitExperienceSettled();
        page.navigateTo("contact");
        page.awaitSection("contact");
        page.navigationLink("contact").shouldHave(attribute("aria-current", "location"));
        page.email.shouldBe(visible);
        page.backToTopFromLogo();
        page.awaitTop();
    }
}