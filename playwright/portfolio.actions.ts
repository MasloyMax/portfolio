import type { Page } from '@playwright/test'
import type { PortfolioLocators } from './portfolio.locators'

export class PortfolioActions {
  constructor(
    private readonly page: Page,
    private readonly ui: PortfolioLocators,
  ) {}

  async open() {
    await this.page.goto('/')
  }

  async reload() {
    await this.page.reload()
  }

  async goToExperience(from: 'header' | 'hero' = 'header') {
    await (from === 'header' ? this.ui.experienceLink : this.ui.heroExperienceLink).click()
  }

  async goToAbout() {
    await this.ui.aboutLink.click()
  }

  async toggleSkillDetails() {
    await this.ui.skillsToggle.click()
  }

  async goToContacts() {
    await this.ui.contactLink.click()
  }

  async goToTop(from: 'footer' | 'logo' = 'footer') {
    await (from === 'footer' ? this.ui.backToTop : this.ui.logo).click()
  }

  async toggleExperience(company: string) {
    await this.ui.experienceButton(company).click()
  }

  async toggleExperienceWithKeyboard(company: string, key: 'Enter' | 'Space') {
    const button = this.ui.experienceButton(company)
    await button.focus()
    await button.press(key)
  }

  async toggleTheme() {
    await this.ui.themeToggle.click()
  }

  async copyEmail() {
    await this.ui.copyEmail.click()
  }

  // Подменяем только границу Clipboard API: настоящий обработчик кнопки работает.
  // Каждый тест получает свою память и не изменяет системный буфер обмена.
  async mockClipboard(result: 'success' | 'denied') {
    await this.page.evaluate(outcome => {
      const state = window as typeof window & { __copiedEmail?: string }
      delete state.__copiedEmail
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          async writeText(text: string) {
            if (outcome === 'denied') throw new DOMException('Clipboard access denied', 'NotAllowedError')
            state.__copiedEmail = text
          },
        },
      })
    }, result)
  }

  async preferReducedMotion() {
    await this.page.emulateMedia({ reducedMotion: 'reduce' })
  }

  async focusSkipLink() {
    await this.page.keyboard.press('Tab')
  }

  async activateSkipLink() {
    await this.page.keyboard.press('Enter')
  }

  async prepareScreenshot() {
    // Прокрутка запускает настоящие reveal-анимации перед полным скриншотом.
    await this.ui.experience.scrollIntoViewIfNeeded()
    await this.ui.contact.scrollIntoViewIfNeeded()
    await this.ui.logo.click()
  }

  async screenshot() {
    await this.page.evaluate(() => document.fonts.ready.then(() => undefined))
    return this.page.screenshot({ fullPage: true, animations: 'disabled' })
  }
}
