import type { Page } from '@playwright/test'

// Все селекторы страницы хранятся здесь. В действиях и проверках селекторов нет.
export function portfolioLocators(page: Page) {
  const header = page.getByRole('banner')
  const navigation = header.getByRole('navigation', { name: 'Основная навигация' })
  const main = page.getByRole('main')
  const hero = main.getByRole('region', { name: 'Максим Маслов', exact: true })
  const about = main.getByRole('region', { name: 'Обо мне.', exact: true })
  const experience = main.getByRole('region', { name: 'Опыт.', exact: true })
  const contact = main.getByRole('region', { name: 'Будем на связи.', exact: true })
  const skills = main.getByRole('region', { name: 'Навыки.', exact: true })
  const experienceItem = (company: string) => experience.getByRole('article', { name: company, exact: true })

  return {
    root: page.locator('html'),
    header,
    main,
    hero,
    about,
    education: about.getByRole('group', { name: 'Образование' }),
    languages: about.getByRole('group', { name: 'Языки' }),
    facts: about.locator('dl'),
    skillsToggle: skills.getByText('Как использую стек', { exact: true }),
    skillsDetails: skills.locator('details'),
    skillDescriptions: skills.locator('details dd'),
    experience,
    contact,
    sections: main.locator(':scope > section'),
    title: hero.getByRole('heading', { level: 1, name: 'Максим Маслов' }),
    role: hero.getByText('Automation QA Engineer (TypeScript / Playwright)', { exact: true }),
    location: hero.getByText('Воронеж, Россия', { exact: true }),
    technologies: skills.getByRole('list', { name: 'Технологии', exact: true }).getByRole('listitem'),
    logo: header.getByRole('link', { name: 'Максим Маслов — в начало' }),
    aboutLink: navigation.getByRole('link', { name: 'Обо мне', exact: true }),
    experienceLink: navigation.getByRole('link', { name: 'Опыт', exact: true }),
    contactLink: navigation.getByRole('link', { name: 'На связи' }),
    heroExperienceLink: hero.getByRole('link', { name: 'Мой опыт' }),
    heroTelegramLink: hero.getByRole('link', { name: 'Обсудим задачу' }),
    telegramLink: contact.getByRole('link', { name: 'Написать в Telegram' }),
    emailLink: contact.getByRole('link', { name: 'masloymax@gmail.com', exact: true }),
    copyEmail: contact.getByRole('button', { name: 'Скопировать почту' }),
    notification: contact.getByRole('status'),
    themeToggle: header.getByRole('button', { name: /^Включить (тёмную|светлую) тему$/ }),
    backToTop: page.getByRole('contentinfo').getByRole('link', { name: 'Наверх' }),
    skipLink: page.getByRole('link', { name: 'Перейти к содержимому' }),
    experienceItems: experience.getByRole('article'),
    experienceItem,
    experienceHeading: (company: string) => experienceItem(company).getByRole('heading', { level: 3 }),
    experienceDescription: (company: string, description: string) => experienceItem(company).getByText(description, { exact: true }),
    // Отсутствие прежней графики и анимация появления заголовка.
    artwork: hero.locator('.hero-art'),
    nameLines: hero.locator('.name-line > span'),
  }
}

export type PortfolioLocators = ReturnType<typeof portfolioLocators>
