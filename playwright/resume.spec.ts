import { readFile } from 'node:fs/promises'
import { expect } from '@playwright/test'
import { test } from './fixtures'

test.describe('Резюме для чтения и печати', () => {
  test('скачивает настоящий PDF с понятным именем', async ({ openPage, page }) => {
    await openPage()
    const pending = page.waitForEvent('download')
    await page.getByRole('link', { name: 'Скачать резюме' }).click()
    const download = await pending
    expect(download.suggestedFilename()).toBe('Maxim-Maslov-QA.pdf')
    expect(await download.failure()).toBeNull()
    const path = await download.path()
    expect(path).not.toBeNull()
    const data = await readFile(path!)
    expect(data.subarray(0, 5).toString()).toBe('%PDF-')
    expect(data.length).toBeGreaterThan(10_000)
  })

  test('сразу показывает результаты и стаж', async ({ openPage, page }) => {
    await openPage()
    for (const [company, duration] of [
      ['Raiffeisenbank', '1 год'],
      ['Haulmont', '2 года 7 месяцев'],
      ['Сбер', '1 год 1 месяц'],
      ['Яндекс', '6 месяцев'],
    ]) {
      const job = page.getByRole('article', { name: company, exact: true })
      await expect(job.getByRole('list').first().getByRole('listitem').first()).toBeVisible()
      await expect(job).toContainText(duration)
      expect(await job.getByRole('list').first().evaluate(element => parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(16)
    }
    for (const [company, metrics] of [
      ['Raiffeisenbank', ['30%', '50%', '100%']],
      ['Haulmont', ['30%', '100%']],
    ] as const) {
      const job = page.getByRole('article', { name: company, exact: true })
      await expect(job.getByText('Метрики', { exact: true })).toBeVisible()
      for (const metric of metrics) await expect(job).toContainText(metric)
    }
  })

  test('печатает весь опыт на белом фоне из тёмной темы без прокрутки', async ({ openPage, page }) => {
    const { actions } = await openPage()
    await actions.toggleTheme()
    await page.emulateMedia({ media: 'print' })
    await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await expect(page.getByRole('banner', { includeHidden: true })).toBeHidden()
    await expect(page.getByRole('button', { name: 'Печать', includeHidden: true })).toBeHidden()
    await expect(page.locator('#experience')).toHaveCSS('opacity', '1')
    for (const company of ['Raiffeisenbank', 'Haulmont', 'Сбер', 'Яндекс']) {
      const job = page.getByRole('article', { name: company, exact: true })
      await expect(job).toBeVisible()
      await expect(job).toHaveCSS('break-inside', 'avoid')
      await expect(job.getByRole('list').first().getByRole('listitem').last()).toBeVisible()
    }
    await expect(page.getByRole('group', { name: 'Образование' })).toBeVisible()
    await expect(page.getByRole('group', { name: 'Языки' })).toBeVisible()
  })

  test('кнопка печати вызывает системную печать', async ({ openPage, page }) => {
    await openPage()
    await page.evaluate(() => {
      const state = window as typeof window & { __printCalls?: number }
      state.__printCalls = 0
      window.print = () => { state.__printCalls! += 1 }
    })
    await page.getByRole('button', { name: 'Печать', exact: true }).click()
    expect(await page.evaluate(() => (window as typeof window & { __printCalls?: number }).__printCalls)).toBe(1)
  })
})
