import type { PortfolioProfile } from './types/portfolio'

// Подтверждённый опыт. Поля в квадратных скобках автор заполнит своими метриками.
export const profile: PortfolioProfile = {
  isDraft: false,
  name: 'Максим Маслов',
  initials: 'ММ',
  role: 'Automation QA Engineer (TypeScript / Playwright)',
  location: 'Воронеж, Россия',
  headline: ['Максим', 'Маслов.', ''],
  introduction: 'В тестировании с 2021 года, в автоматизации — с 2023 года. Разрабатываю автотесты, проверяю веб-приложения и API. Работал с банковскими системами, плагинами IDE и мобильными сервисами.',
  about: [
    'Сочетаю ручное тестирование и автоматизацию: проверяю пользовательские сценарии и API, работаю с данными и анализирую логи при поиске дефектов.',
    'Разрабатывал и внедрял системы автотестов, обновлял архитектуру существующего проекта. Есть опыт создания тестовой модели сервиса и обучения команды тестировщиков.',
  ],
  facts: [
    { label: 'В тестировании', value: 'С 2021 года' },
    { label: 'В автоматизации', value: 'С 2023 года' },
  ],
  skills: [
    { name: 'Playwright', category: 'Инструменты', group: 'Автоматизация и языки', detail: 'Веб-автотесты' },
    { name: 'TypeScript', category: 'Инструменты', group: 'Автоматизация и языки', detail: 'Автоматизация тестирования' },
    { name: 'WebdriverIO', category: 'Инструменты', group: 'Автоматизация и языки', detail: 'Автотесты расширения VS Code' },
    { name: 'UI-Robot', category: 'Инструменты', group: 'Автоматизация и языки', detail: 'Автотесты IDE-плагинов' },
    { name: 'Java', category: 'Инструменты', group: 'Автоматизация и языки', detail: 'UI-автоматизация с UI-Robot' },
    { name: 'REST / gRPC / GraphQL', category: 'Инструменты', group: 'API', detail: 'Тестирование API' },
    { name: 'PostgreSQL', category: 'Инструменты', group: 'Базы данных и кэш', detail: 'Работа с базами данных' },
    { name: 'Redis', category: 'Инструменты', group: 'Базы данных и кэш', detail: 'Работа с кэшом' },
    { name: 'GitLab CI/CD', category: 'Инструменты', group: 'CI/CD и окружение', detail: 'Работа с пайплайнами' },
    { name: 'Docker', category: 'Инструменты', group: 'CI/CD и окружение', detail: 'Работа с контейнерами' },
    { name: 'Charles Proxy', category: 'Инструменты', group: 'Логи, метрики и диагностика', detail: 'Подмена запросов' },
    { name: 'Postman / Bruno / Swagger', category: 'Инструменты', group: 'API', detail: 'Отправка запросов к backend' },
    { name: 'OpenSearch / OpenLens / Kibana', category: 'Инструменты', group: 'Логи, метрики и диагностика', detail: 'Анализ логов' },
    { name: 'Linux', category: 'Инструменты', group: 'CI/CD и окружение', detail: 'Работа с Bash и виртуализацией' },
    { name: 'Grafana', category: 'Инструменты', group: 'Логи, метрики и диагностика', detail: 'Анализ метрик' },
  ],
  projects: [],
  experience: [
    {
      period: 'Окт 2025 — окт 2026',
      duration: '1 год',
      role: 'Regular Software QA Engineer',
      company: 'Raiffeisenbank',
      description: 'Автоматизация и ручное тестирование банковских систем.',
      highlights: [
        'Автоматизировал проверки ролевой модели банковских систем — 30% (это были сложные сценарии), сценариев.',
        'Автоматизировал проверки части внутренней системы банка- 100%',
        'Обновил архитектуру проекта автотестов на Playwright и TypeScript; поддерживал и развивал проект.',
        'Проводил ручное тестирование, проверял REST и gRPC API, работал с PostgreSQL и Redis.',
        'Анализировал логи и метрики в OpenSearch, OpenLens и Grafana. Участвовал во внедрении shift-left и решал небольшие задачи на backend и frontend.',
      ],
      technologies: ['TypeScript', 'Playwright', 'REST', 'gRPC', 'PostgreSQL', 'Redis', 'GitLab CI/CD', 'OpenSearch', 'OpenLens', 'Grafana'],
      metrics: [
        'Прогон АТ сократил регресс внутренней системы на 100%, а ролевой модели на 50%'
      ],
    },
    {
      period: 'Мар 2023 — окт 2025',
      duration: '2 года 7 месяцев',
      role: 'Automation QA Engineer',
      company: 'Haulmont',
      description: 'Плагины для IntelliJ IDEA и VS Code — инструменты для разработчиков.',
      highlights: [
        'Разработал и внедрил систему автотестов для плагинов двух IDE: IntelliJ IDEA и VS Code.',
        'Автоматизировал UI-сценарии на TypeScript с Playwright и WebdriverIO; писал UI-автотесты на Java с UI-Robot.',
        'Проверял API с использованием Postman и GraphQL, работал с PostgreSQL и локализовал дефекты.',
      ],
      technologies: ['TypeScript', 'Playwright', 'WebdriverIO', 'Java', 'UI-Robot', 'Postman', 'GraphQL', 'PostgreSQL'],
      metrics: [
        'Покрытие: 30% автотестов для IntelliJ IDEA и 100% для VS Code.',
      ],
    },
    {
      period: 'Фев 2022 — мар 2023',
      duration: '1 год 1 месяц',
      role: 'QA Engineer',
      company: 'Сбер',
      description: 'Веб-сервис «Пульс» для обучения сотрудников.',
      highlights: [
        'С нуля разработал тестовую модель сервиса отчётности.',
        'Тестировал backend и frontend сервиса на Web, iOS и Android.',
        'Составлял чек-листы и тест-кейсы для проверок сервиса.',
      ],
      technologies: ['Web', 'iOS', 'Android', 'Тест-кейсы', 'Чек-листы'],
    },
    {
      period: 'Авг 2021 — фев 2022',
      duration: '6 месяцев',
      role: 'Тестировщик ПО · Яндекс Такси',
      company: 'Яндекс',
      description: 'Мобильные приложения и веб-версия сервиса такси.',
      highlights: [
        'Создал и обучил команду из трёх тестировщиков.',
        'Тестировал приложения Яндекс Такси на iOS и Android и веб-версию сервиса.',
        'Анализировал логи и оформлял баг-репорты по найденным дефектам.',
      ],
      technologies: ['iOS', 'Android', 'Web', 'Анализ логов', 'Баг-репорты'],
    },
  ],
  education: [
    { title: 'Инженер', institution: 'Воронежский государственный технический университет', period: '2022' },
    { title: 'Техник · радиоэлектроника', institution: 'ВГПГК', period: '2018' },
  ],
  languages: ['Русский — родной', 'Английский — B1'],
  contacts: {
    email: 'masloymax@gmail.com',
    telegram: 'https://t.me/masloymax',
    resume: './resume-maxim-maslov.pdf',
  },
}
