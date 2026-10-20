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
    await expect(this.ui.sections).toHaveCount(3)
    await expect(this.ui.role).toBeVisible()
    await expect(this.ui.location).toBeVisible()
    await expect(this.ui.experienceItems).toHaveCount(companies.length)
    for (const company of companies) await expect(this.ui.experienceButton(company)).toBeVisible()
    await expect(this.ui.technologies).toContainText(technologies)
  }

  async isAtSection(section: 'experience' | 'contact') {
    const target = section === 'experience' ? this.ui.experience : this.ui.contact
    const link = section === 'experience' ? this.ui.experienceLink : this.ui.contactLink
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

  async hasExpandedExperience(company: string, description: string, highlight: string) {
    await expect(this.ui.experienceButton(company)).toHaveAttribute('aria-expanded', 'true')
    await expect(this.ui.expandedExperienceButtons).toHaveCount(1)
    await expect(this.ui.experiencePanel(company)).toBeVisible()
    await expect(this.ui.experiencePanel(company)).toHaveAttribute('aria-hidden', 'false')
    await expect(this.ui.experienceDescription(company, description)).toBeVisible()
    await expect(this.ui.experiencePanel(company)).toContainText(highlight)
  }

  async hasCollapsedExperience(company: string) {
    await expect(this.ui.experienceButton(company)).toHaveAttribute('aria-expanded', 'false')
    await expect(this.ui.experiencePanel(company)).toHaveAttribute('aria-hidden', 'true')
    await expect(this.ui.experiencePanel(company)).toBeHidden()
  }

  async hasNoExpandedExperience() {
    await expect(this.ui.expandedExperienceButtons).toHaveCount(0)
  }

  async experienceHasFocus(company: string) {
    await expect(this.ui.experienceButton(company)).toBeFocused()
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

    for (const control of [this.ui.logo, this.ui.experienceLink, this.ui.contactLink, this.ui.themeToggle]) {
      await expect(control).toBeInViewport({ ratio: 1 })
    }

    await expect.poll(async () => {
      const sculptureBox = await this.ui.sculpture.boundingBox()
      if (!sculptureBox) return true
      const lines = await this.ui.nameLines.evaluateAll(elements => elements.map(element => {
        const range = document.createRange()
        range.selectNodeContents(element)
        const rect = range.getBoundingClientRect()
        return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom }
      }))
      return lines.some(line => (
        line.left < sculptureBox.x + sculptureBox.width && line.right > sculptureBox.x &&
        line.top < sculptureBox.y + sculptureBox.height && line.bottom > sculptureBox.y
      ))
    }, { message: 'Имя и декоративная звезда не должны накладываться друг на друга' }).toBe(false)
  }

  async hasRunningAnimations() {
    await expect(this.ui.sculpture).not.toHaveCSS('animation-name', 'none')
    await expect(this.ui.orbit).not.toHaveCSS('animation-name', 'none')
    await expect(this.ui.sculpture).toHaveCSS('animation-play-state', 'running')
  }

  async respectsReducedMotion() {
    await expect(this.ui.sculpture).toHaveCSS('animation-name', 'none')
    await expect(this.ui.orbit).toHaveCSS('animation-name', 'none')
    await expect(this.ui.perspective).toHaveCSS('transform', 'none')
    await expect(this.ui.experience).toHaveCSS('opacity', '1')
    await expect(this.ui.contact).toHaveCSS('opacity', '1')
  }

  async artworkIsTilted(tilted: boolean) {
    await expect.poll(() => this.ui.perspective.evaluate(element => (
      !new DOMMatrixReadOnly(getComputedStyle(element).transform).isIdentity
    )), { message: tilted ? 'Графика реагирует на курсор' : 'Графика возвращается в исходное положение' }).toBe(tilted)
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
