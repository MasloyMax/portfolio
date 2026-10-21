package ru.masloy.portfolio;

import com.codeborne.selenide.SelenideConfig;
import com.codeborne.selenide.SelenideDriver;
import org.junit.jupiter.api.extension.AfterEachCallback;
import org.junit.jupiter.api.extension.BeforeEachCallback;
import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.ParameterContext;
import org.junit.jupiter.api.extension.ParameterResolver;
import org.openqa.selenium.OutputType;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

/** One browser per test, with artifacts collected before its session is closed. */
public final class BrowserExtension implements BeforeEachCallback, AfterEachCallback, ParameterResolver {
    private static final ExtensionContext.Namespace NAMESPACE =
            ExtensionContext.Namespace.create(BrowserExtension.class);

    private record Session(SelenideDriver driver, PortfolioPage page) {}

    @Override
    public void beforeEach(ExtensionContext context) {
        SelenideConfig config = new SelenideConfig()
                .baseUrl(System.getProperty("selenide.baseUrl", "http://127.0.0.1:4177/"))
                .browser(System.getProperty("selenide.browser", "chrome"))
                .headless(Boolean.parseBoolean(System.getProperty("selenide.headless", "true")))
                .browserSize(System.getProperty("selenide.browserSize", "1440x1000"))
                .timeout(Long.parseLong(System.getProperty("selenide.timeout", "6000")))
                .reportsFolder(System.getProperty("selenide.reportsFolder", "target/selenide"))
                .screenshots(true)
                .savePageSource(true);
        SelenideDriver driver = new SelenideDriver(config);
        PortfolioPage page = new PortfolioPage(driver);
        context.getStore(NAMESPACE).put(Session.class, new Session(driver, page));
        page.open();
    }

    @Override
    public boolean supportsParameter(ParameterContext parameter, ExtensionContext context) {
        return parameter.getParameter().getType() == PortfolioPage.class;
    }

    @Override
    public Object resolveParameter(ParameterContext parameter, ExtensionContext context) {
        return context.getStore(NAMESPACE).get(Session.class, Session.class).page();
    }

    @Override
    public void afterEach(ExtensionContext context) {
        Session session = context.getStore(NAMESPACE).remove(Session.class, Session.class);
        if (session == null) return;
        Throwable failure = context.getExecutionException().orElse(null);
        try {
            if (failure != null && session.driver().hasWebDriverStarted()) {
                captureArtifacts(session.driver(), context, failure);
            }
        } finally {
            try {
                session.driver().close();
            } catch (RuntimeException | Error cleanupFailure) {
                if (failure != null) failure.addSuppressed(cleanupFailure);
                else throw cleanupFailure;
            }
        }
    }

    private void captureArtifacts(SelenideDriver driver, ExtensionContext context, Throwable failure) {
        String name = context.getRequiredTestClass().getSimpleName() + "-"
                + context.getRequiredTestMethod().getName() + "-" + UUID.randomUUID();
        Path directory = Path.of(driver.config().reportsFolder());
        try {
            Files.createDirectories(directory);
        } catch (Exception artifactFailure) {
            failure.addSuppressed(artifactFailure);
            return;
        }
        // Independent attempts: a screenshot error must not prevent saving the DOM.
        try {
            byte[] png = driver.screenshot(OutputType.BYTES);
            if (png != null) Files.write(directory.resolve(name + ".png"), png);
        } catch (Exception artifactFailure) {
            failure.addSuppressed(artifactFailure);
        }
        try {
            String html = driver.source();
            if (html != null) Files.writeString(directory.resolve(name + ".html"), html, StandardCharsets.UTF_8);
        } catch (Exception artifactFailure) {
            failure.addSuppressed(artifactFailure);
        }
        context.publishReportEntry("failure artifacts", directory.resolve(name).toAbsolutePath().toString());
    }
}