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

/** Жизненный цикл теста: отдельный браузер, передача страницы в метод, диагностика падения и закрытие. */
public final class BrowserExtension implements BeforeEachCallback, AfterEachCallback, ParameterResolver {
    // Собственное пространство ключей в хранилище JUnit не пересекается с другими расширениями.
    private static final ExtensionContext.Namespace NAMESPACE =
            ExtensionContext.Namespace.create(BrowserExtension.class);

    // Драйвер и Page Object относятся к одному тесту и хранятся вместе в его ExtensionContext.
    private record Session(SelenideDriver driver, PortfolioPage page) {}

    @Override
    public void beforeEach(ExtensionContext context) {
        // Читаем параметры -Dselenide.*; при отсутствии берём значения по умолчанию.
        // Создаём конфигурацию для этого драйвера, не меняя глобальные статические настройки Selenide.
        SelenideConfig config = new SelenideConfig()
                .baseUrl(System.getProperty("selenide.baseUrl", "http://127.0.0.1:4177/"))
                .browser(System.getProperty("selenide.browser", "chrome"))
                .headless(Boolean.parseBoolean(System.getProperty("selenide.headless", "true")))
                .browserSize(System.getProperty("selenide.browserSize", "1440x1000"))
                .timeout(Long.parseLong(System.getProperty("selenide.timeout", "6000")))
                .reportsFolder(System.getProperty("selenide.reportsFolder", "target/selenide"))
                .screenshots(true)
                .savePageSource(true);
        // У каждого сценария новый браузер: cookies, localStorage и тема не зависят от предыдущего теста.
        SelenideDriver driver = new SelenideDriver(config);
        PortfolioPage page = new PortfolioPage(driver);
        // Сохраняем сессию до открытия URL, чтобы иметь доступ к драйверу и при сбое навигации.
        context.getStore(NAMESPACE).put(Session.class, new Session(driver, page));
        // Сайт к этому моменту должен работать: Java-набор не запускает веб-сервер самостоятельно.
        page.open();
    }

    @Override
    public boolean supportsParameter(ParameterContext parameter, ExtensionContext context) {
        // Сообщаем JUnit, что умеем подставлять только аргументы типа PortfolioPage.
        return parameter.getParameter().getType() == PortfolioPage.class;
    }

    @Override
    public Object resolveParameter(ParameterContext parameter, ExtensionContext context) {
        // Передаём в метод теста ту же страницу, которая была открыта в beforeEach.
        return context.getStore(NAMESPACE).get(Session.class, Session.class).page();
    }

    @Override
    public void afterEach(ExtensionContext context) {
        // Забираем и удаляем сессию из хранилища, чтобы освобождение ресурсов выполнялось один раз.
        Session session = context.getStore(NAMESPACE).remove(Session.class, Session.class);
        if (session == null) return;
        Throwable failure = context.getExecutionException().orElse(null);
        try {
            // При падении сохраняем страницу до закрытия браузера; без запущенного WebDriver снимать нечего.
            if (failure != null && session.driver().hasWebDriverStarted()) {
                captureArtifacts(session.driver(), context, failure);
            }
        } finally {
            // Закрытие выполняется и после успеха, и после ошибки сохранения диагностики.
            try {
                session.driver().close();
            } catch (RuntimeException | Error cleanupFailure) {
                // Ошибка уборки не должна скрыть исходную причину падения: добавляем её как suppressed.
                if (failure != null) failure.addSuppressed(cleanupFailure);
                else throw cleanupFailure;
            }
        }
    }

    private void captureArtifacts(SelenideDriver driver, ExtensionContext context, Throwable failure) {
        // UUID различает запуски одного параметризованного метода и предотвращает перезапись файлов.
        String name = context.getRequiredTestClass().getSimpleName() + "-"
                + context.getRequiredTestMethod().getName() + "-" + UUID.randomUUID();
        Path directory = Path.of(driver.config().reportsFolder());
        try {
            Files.createDirectories(directory);
        } catch (Exception artifactFailure) {
            failure.addSuppressed(artifactFailure);
            return;
        }
        // PNG и HTML сохраняем независимо: ошибка скриншота не должна мешать получить исходный код страницы.
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
        // В отчёт JUnit передаём общий путь без расширения: рядом лежат файлы .png и .html.
        context.publishReportEntry("failure artifacts", directory.resolve(name).toAbsolutePath().toString());
    }
}
