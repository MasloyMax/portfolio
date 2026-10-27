import { test } from './fixtures'

// Ожидания независимы от src/profile.ts: неправильный контент должен ломать тест.
const experience = [
  {
    company: 'Raiffeisenbank',
    description: 'Автоматизация и ручное тестирование банковских систем.',
    highlight: 'проверял REST и gRPC API',
  },
  {
    company: 'Haulmont',
    description: 'Плагины для IntelliJ IDEA и VS Code — инструменты для разработчиков.',
    highlight: 'Разработал и внедрил систему автотестов',
  },
  {
    company: 'Сбер',
    description: 'Веб-сервис «Пульс» для обучения сотрудников.',
    highlight: 'С нуля разработал тестовую модель сервиса отчётности.',
  },
  {
    company: 'Яндекс',
    description: 'Мобильные приложения и веб-версия сервиса такси.',
    highlight: 'Создал и обучил команду из трёх тестировщиков.',
  },
]

const email = 'masloymax@gmail.com'
const telegram = 'https://t.me/masloymax'

test.describe('Одностраничное портфолио', () => {
  test('показывает профиль, стек и четыре места работы', async ({ openPage }) => {
    const { check } = await openPage()
    await check.hasProfile(
      experience.map(job => job.company),
      ['Playwright', 'TypeScript', 'WebdriverIO', 'Java', 'PostgreSQL', 'GitLab CI/CD'],
    )
    for (const job of experience) await check.hasVisibleExperience(job.company, job.description, job.highlight)
  })

  test('показывает город, факты, образование и языки вместо графики', async ({ openPage }) => {
    const { check } = await openPage()
    await check.hasBiography()
  })

  test('раскрывает и скрывает описание навыков', async ({ openPage }) => {
    const { actions, check } = await openPage()
    await check.skillDetailsAreExpanded(false)
    await actions.toggleSkillDetails()
    await check.skillDetailsAreExpanded(true)
    await actions.toggleSkillDetails()
    await check.skillDetailsAreExpanded(false)
  })

  test('переходит по якорям из первого экрана, шапки и подвала', async ({ openPage }) => {
    const { actions, check } = await openPage()
    await actions.goToAbout()
    await check.isAtSection('about')
    await actions.goToExperience('hero')
    await check.isAtSection('experience')
    await actions.goToContacts()
    await check.isAtSection('contact')
    await actions.goToTop('footer')
    await check.isAtTop()
    await actions.goToExperience('header')
    await check.isAtSection('experience')
    await actions.goToTop('logo')
    await check.isAtTop()
  })

  test('переключает обе темы и сохраняет выбор после перезагрузки', async ({ openPage }) => {
    const { actions, check } = await openPage()
    await check.hasTheme('light')
    await actions.toggleTheme()
    await check.hasTheme('dark')
    await actions.reload()
    await check.hasTheme('dark')
    await actions.toggleTheme()
    await check.hasTheme('light')
    await actions.reload()
    await check.hasTheme('light')
  })

  test('содержит корректные ссылки на почту и Telegram', async ({ openPage }) => {
    const { check } = await openPage()
    await check.hasContactLinks(email, telegram)
  })

  test('копирует почту и автоматически убирает уведомление', async ({ openPage }) => {
    const { actions, check } = await openPage()
    await actions.mockClipboard('success')
    await actions.copyEmail()
    await check.hasCopiedEmail(email)
    await check.hasDismissedNotification()
  })

  test('сообщает об отказе Clipboard API и позволяет повторить копирование', async ({ openPage }) => {
    const { actions, check } = await openPage()
    await actions.mockClipboard('denied')
    await actions.copyEmail()
    await check.hasClipboardError()
    await actions.mockClipboard('success')
    await actions.copyEmail()
    await check.hasCopiedEmail(email)
  })

  test('сохраняет вёрстку в обеих темах', async ({ openPage }, testInfo) => {
    const { actions, check } = await openPage()
    for (const theme of ['light', 'dark'] as const) {
      if (theme === 'dark') await actions.toggleTheme()
      await check.hasTheme(theme)
      await actions.prepareScreenshot()
      await check.isAtTop()
      await check.layoutFitsViewport()
      await testInfo.attach(`portfolio-${theme}`, {
        body: await actions.screenshot(),
        contentType: 'image/png',
      })
    }
  })

  test('отключает движение при prefers-reduced-motion', async ({ openPage }) => {
    const { actions, check } = await openPage()
    await check.hasRunningAnimations()
    await actions.preferReducedMotion()
    await check.respectsReducedMotion()
  })

  test('позволяет перейти к содержимому клавишами Tab и Enter', async ({ openPage }) => {
    const { actions, check } = await openPage()
    await actions.focusSkipLink()
    await check.skipLinkHasFocus()
    await actions.activateSkipLink()
    await check.mainHasFocus()
  })
})
