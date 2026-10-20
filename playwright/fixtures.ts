import { test as base } from '@playwright/test'
import { PortfolioActions } from './portfolio.actions'
import { PortfolioExpect } from './portfolio.expect'
import { portfolioLocators } from './portfolio.locators'

interface PortfolioPage {
  actions: PortfolioActions
  check: PortfolioExpect
}

interface Fixtures {
  openPage: () => Promise<PortfolioPage>
}

// Одна страница, один набор объектов. BrowserContext изолирован Playwright для каждого теста.
export const test = base.extend<Fixtures>({
  openPage: async ({ page }, use) => {
    const ui = portfolioLocators(page)
    const actions = new PortfolioActions(page, ui)
    const check = new PortfolioExpect(page, ui)
    const browserErrors: string[] = []
    page.on('pageerror', error => browserErrors.push(error.message))
    page.on('console', message => {
      if (message.type() === 'error') browserErrors.push(message.text())
    })

    await use(async () => {
      await actions.open()
      await check.isReady()
      return { actions, check }
    })

    await check.hasNoBrowserErrors(browserErrors)
  },
})
