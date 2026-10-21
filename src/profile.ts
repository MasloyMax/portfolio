import type { PortfolioProfile } from './types/portfolio'

// Профессиональные данные из резюме, обновлённого 20 октября 2026 года.
export const profile: PortfolioProfile = {
  isDraft: false,
  name: 'Максим Маслов',
  initials: 'ММ',
  role: 'Automation QA Engineer',
  location: 'Воронеж, Россия',
  headline: ['Максим', 'Маслов.', ''],
  introduction: 'Автоматизирую тестирование, разбираюсь в сложных системах и помогаю выпускать надёжные продукты.',
  about: ['От мобильных сервисов до банковских систем и инструментов разработчика.'],
  facts: [
    { label: 'В тестировании', value: 'С 2021 года' },
    { label: 'Сейчас', value: '----' },
  ],
  skills: [
    { name: 'Playwright', category: 'Инструменты', detail: 'Web Автотесты' },
    { name: 'TypeScript', category: 'Frontend', detail: 'Автоматизация тестирования' },
    { name: 'WebdriverIO', category: 'Инструменты', detail: 'Автотесты расширения в VSCode' },
    { name: 'UI-Robot', category: 'Инструменты', detail: 'Автотесты IDE-плагинов' },
    { name: 'Java', category: 'Инструменты', detail: 'UI-автоматизация в ui-robot' },
    { name: 'REST / gRPC / GraphQL', category: 'Инструменты', detail: 'Тестирование API' },
    { name: 'PostgreSQL', category: 'Инструменты', detail: 'Работа с базами данных' },
    { name: 'Redis', category: 'Инструменты', detail: 'Работа с кэшом' },
    { name: 'GitLab CI/CD', category: 'Инструменты', detail: 'Работа с пайплайнами' },
    { name: 'Docker', category: 'Инструменты', detail: 'Работа с контейнерами'},
    { name: 'Charles Proxy', category: 'Инструменты', detail: 'Работа с подменой запросов' },
    { name: 'Postman/Bruno/Swagger ', category: 'Инструменты', detail: 'Работа отправкой запросов на backend' },
    { name: 'Open Lens/Search/Kibana', category: 'Инструменты', detail: 'Работа с логами' },
    { name: 'Linux', category: 'Инструменты', detail: 'Работа с bash, виртуализацией' },
    { name: 'Grafana', category: 'Инструменты', detail: 'Работа метриками' }

  ],
  projects: [],
  experience: [
    {
      period: 'Окт 2025 — Окт 2026',
      role: 'Regular Software QA Engineer',
      company: 'Raiffeisenbank',
      description: 'Автоматизация и ручное тестирование банковских систем.',
      highlights: [
        'Поддержка и развивитие проекта автотестов. Проверка REST- и gRPC API, работа с GitLab CI/CD.',
        'Анализ логи и метрик в OpenSearch, OpenLens и Grafana. Работаю с PostgreSQL и Redis, решаю небольшие задачи на backend и frontend.',
        'Архитектурно проапгрейдил тестовый проект.',
        'Автоматизировал функционал ролевой модели',
        'Учавствовал во внедрении shift-left'
      ],
    },
    {
      period: 'Мар 2023 — окт 2025',
      role: 'Automation QA Engineer',
      company: 'Haulmont',
      description: 'Автотесты для инструментов, которыми пользуются разработчики.',
      highlights: [
        'Разработал и внедрил систему автотестов для плагинов IntelliJ IDEA и VS Code: Playwright + TypeScript, WebdriverIO + TypeScript.',
        'Писал UI-автотесты на Java с ui-robot. Тестировал API через Postman и GraphQL, работал с PostgreSQL и локализовал дефекты.',
      ],
    },
    {
      period: 'Фев 2022 — мар 2023',
      role: 'QA Engineer',
      company: 'Сбер',
      description: 'Веб-сервис «Пульс» для обучения сотрудников.',
      highlights: [
        'С нуля разработал тестовую модель сервиса отчётности.',
        'Тестировал backend и frontend на Web, iOS и Android. Составлял чек-листы и тест-кейсы.',
      ],
    },
    {
      period: 'Авг 2021 — фев 2022',
      role: 'Тестировщик ПО · Яндекс Такси',
      company: 'Яндекс',
      description: 'Мобильные приложения и веб-версия сервиса такси.',
      highlights: [
        'Тестировал iOS, Android и веб, анализировал логи и составлял баг-репорты.',
        'Создал и обучил команду из трёх тестировщиков.',
      ],
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
  },
}
