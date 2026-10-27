import { expect } from '@playwright/test'
import type { Page } from '@playwright/test'
import type { PortfolioLocators } from './portfolio.locators'

export class PortfolioExpect {
  constructor(
    private readonly page: Page,
    private readonly ui: PortfolioLocators,
  ) {}

  async isReady() {
    await expect(this.page).toHaveTitle('Максим Маслов — Automation QA Engineer')
    await expect(this.ui.title).toBeVisible()
    await expect(this.ui.header).toBeVisible()
  }

  async hasProfile(companies: string[], technologies: string[]) {
    await expect(this.ui.sections).toHaveCount(5)
    await expect(this.ui.role).toBeVisible()
    await expect(this.ui.location).toBeVisible()
    await expect(this.ui.experienceItems).toHaveCount(companies.length)
    for (const company of companies) await expect(this.ui.experienceHeading(company)).toBeVisible()
    await expect(this.ui.technologies).toContainText(technologies)
  }

  async hasBiography() {
    await expect(this.ui.about).toBeVisible()
    await expect(this.ui.about).toContainText('Есть опыт создания тестовой модели сервиса и обучения команды тестировщиков.')
    await expect(this.ui.facts).toContainText('Город')
    await expect(this.ui.facts).toContainText('Воронеж, Россия')
    await expect(this.ui.facts).toContainText('С 2021 года')
    await expect(this.ui.facts).not.toContainText('Сейчас')
    await expect(this.ui.education.getByRole('listitem')).toHaveCount(2)
    await expect(this.ui.education).toContainText('Инженер')
    await expect(this.ui.education).toContainText('Воронежский государственный технический университет')
    await expect(this.ui.education).toContainText('2022')
    await expect(this.ui.education).toContainText('Техник · радиоэлектроника')
    await expect(this.ui.education).toContainText('ВГПГК')
    await expect(this.ui.education).toContainText('2018')
    await expect(this.ui.languages.getByRole('listitem')).toHaveText(['Русский — родной', 'Английский — B1'])
    await expect(this.ui.artwork).toHaveCount(0)
  }

  async skillDetailsAreExpanded(expanded: boolean) {
    if (expanded) {
      await expect(this.ui.skillsDetails).toHaveAttribute('open', '')
      await expect(this.ui.skillDescriptions).toHaveCount(15)
      await expect(this.ui.skillDescriptions).toContainText(['Веб-автотесты', 'Автоматизация тестирования', 'Автотесты расширения VS Code'])
      await expect(this.ui.skillDescriptions.first()).toBeVisible()
    } else {
      await expect(this.ui.skillsDetails).not.toHaveAttribute('open')
      await expect(this.ui.skillDescriptions.first()).toBeHidden()
    }
    await expect.poll(() => this.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0)
  }

  async isAtSection(section: 'about' | 'experience' | 'contact') {
    const target = this.ui[section]
    const link = { about: this.ui.aboutLink, experience: this.ui.experienceLink, contact: this.ui.contactLink }[section]
    await expect(this.page).toHaveURL(new RegExp(`#${section}$`))
    await expect(target).toBeInViewport()
    await expect(link).toHaveAttribute('aria-current', 'location')
    await expect.poll(async () => {
      const [targetBox, headerBox] = await Promise.all([target.boundingBox(), this.ui.header.boundingBox()])
      return targetBox && headerBox ? targetBox.y - (headerBox.y + headerBox.height) : -1
    }, { message: 'Секция не должна перекрываться закреплённой шапкой' }).toBeGreaterThanOrEqual(0)
  }

  async isAtTop() {
    await expect(this.page).toHaveURL(/#home$/)
    await expect(this.ui.title).toBeInViewport()
    await expect.poll(() => this.page.evaluate(() => window.scrollY)).toBeLessThanOrEqual(1)
  }

  async hasVisibleExperience(company: string, description: string, highlight: string) {
    await expect(this.ui.experienceHeading(company)).toBeVisible()
    await expect(this.ui.experienceDescription(company, description)).toBeVisible()
    await expect(this.ui.experienceItem(company)).toContainText(highlight)
  }

  async hasTheme(theme: 'light' | 'dark') {
    await expect(this.ui.root).toHaveAttribute('data-theme', theme)
    await expect(this.ui.root).toHaveCSS('background-color', theme === 'light' ? 'rgb(248, 248, 248)' : 'rgb(20, 20, 20)')
    await expect(this.ui.themeToggle).toHaveAccessibleName(theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему')
  }

  async hasContactLinks(email: string, telegram: string) {
    await expect(this.ui.emailLink).toHaveAttribute('href', `mailto:${email}`)
    for (const link of [this.ui.heroTelegramLink, this.ui.telegramLink]) {
      await expect(link).toHaveAttribute('href', telegram)
      await expect(link).toHaveAttribute('target', '_blank')
      await expect(link).toHaveAttribute('rel', /(?:^|\s)noreferrer(?:\s|$)/)
    }
  }

  async hasCopiedEmail(email: string) {
    await expect.poll(() => this.page.evaluate(() => (
      window as typeof window & { __copiedEmail?: string }
    ).__copiedEmail), { message: 'В Clipboard API должен передаваться полный адрес почты' }).toBe(email)
    await expect(this.ui.notification).toHaveText('Почта скопирована')
    await expect(this.ui.notification).toHaveCSS('opacity', '1')
  }

  async hasClipboardError() {
    await expect(this.ui.notification).toHaveText('Не удалось скопировать. Скопируйте адрес вручную.')
    await expect(this.ui.notification).toHaveCSS('opacity', '1')
    await expect(this.ui.emailLink).toBeVisible()
  }

  async hasDismissedNotification() {
    // Ожидаем пользовательский результат, без фиксированных sleep / waitForTimeout.
    await expect(this.ui.notification).toHaveText('', { timeout: 6_000 })
    await expect(this.ui.notification).toHaveCSS('opacity', '0')
  }

  async layoutFitsViewport() {
    await expect.poll(() => this.page.evaluate(() => (
      document.documentElement.scrollWidth - document.documentElement.clientWidth
    )), { message: 'Страница не должна прокручиваться по горизонтали' }).toBeLessThanOrEqual(0)

    for (const control of [this.ui.logo, this.ui.aboutLink, this.ui.experienceLink, this.ui.contactLink, this.ui.themeToggle]) {
      await expect(control).toBeInViewport({ ratio: 1 })
    }

    const titleBox = await this.ui.title.boundingBox()
    const aboutBox = await this.ui.about.boundingBox()
    if (!titleBox || !aboutBox) throw new Error('Заголовок и блок профиля должны быть видимы')
    const overlaps = titleBox.x < aboutBox.x + aboutBox.width && titleBox.x + titleBox.width > aboutBox.x &&
      titleBox.y < aboutBox.y + aboutBox.height && titleBox.y + titleBox.height > aboutBox.y
    expect(overlaps, 'Имя и блок обо мне не должны накладываться друг на друга').toBe(false)
  }

  async hasRunningAnimations() {
    await expect(this.ui.nameLines.first()).not.toHaveCSS('animation-name', 'none')
    await expect(this.ui.about).not.toHaveCSS('animation-name', 'none')
  }

  async respectsReducedMotion() {
    await expect(this.ui.nameLines.first()).toHaveCSS('animation-name', 'none')
    await expect(this.ui.about).toHaveCSS('animation-name', 'none')
    await expect(this.ui.about).toHaveCSS('opacity', '1')
    await expect(this.ui.experience).toHaveCSS('opacity', '1')
    await expect(this.ui.contact).toHaveCSS('opacity', '1')
  }

  async skipLinkHasFocus() {
    await expect(this.ui.skipLink).toBeFocused()
    await expect(this.ui.skipLink).toBeInViewport()
  }

  async mainHasFocus() {
    await expect(this.ui.main).toBeFocused()
    await expect(this.page).toHaveURL(/#main$/)
  }

  hasNoBrowserErrors(errors: string[]) {
    expect(errors, 'Ошибки JavaScript и console.error в браузере').toEqual([])
  }
}
