import type { PortfolioProfile } from './types/portfolio'

// Профессиональные данные из резюме; формулировки уточнены без добавления новых фактов.
export const profile: PortfolioProfile = {
  isDraft: false,
  name: 'Максим Маслов',
  initials: 'ММ',
  role: 'Automation QA Engineer (TypeScript / Playwright)',
  location: 'Воронеж, Россия',
  headline: ['Максим', 'Маслов.', ''],
  introduction: 'В тестировании с 2021 года. Опыт работы с банковскими системами, мобильными сервисами и инструментами разработчика.',
  about: [
    'В Haulmont разработал и внедрил систему автотестов для плагинов IntelliJ IDEA и VS Code на TypeScript с Playwright и WebdriverIO.',
    'В Raiffeisenbank обновил архитектуру проекта автотестов и автоматизировал тестирование ролевой модели.',
  ],
  facts: [
    { label: 'В тестировании', value: 'С 2021 года' },
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
      role: 'Regular Software QA Engineer',
      company: 'Raiffeisenbank',
      description: 'Автоматизация и ручное тестирование банковских систем.',
      highlights: [
        'Обновил архитектуру проекта автотестов на Playwright и TypeScript; поддерживал и развивал проект.',
        'Автоматизировал тестирование функционала ролевой модели. Участвовал во внедрении shift-left.',
        'Проводил ручное и автоматизированное тестирование банковских систем, проверял REST и gRPC API. Работал с GitLab CI/CD.',
        'Анализировал логи и метрики в OpenSearch, OpenLens и Grafana, работал с PostgreSQL и Redis.',
        'Решал небольшие задачи на backend и frontend.',
      ],
    },
    {
      period: 'Мар 2023 — окт 2025',
      role: 'Automation QA Engineer',
      company: 'Haulmont',
      description: 'Автотесты для инструментов, которыми пользуются разработчики.',
      highlights: [
        'Разработал и внедрил систему автотестов для плагинов IntelliJ IDEA и VS Code: Playwright + TypeScript, WebdriverIO + TypeScript.',
        'Писал UI-автотесты на Java с UI-Robot.',
        'Тестировал API с использованием Postman и GraphQL, работал с PostgreSQL и локализовал дефекты.',
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
        'Создал и обучил команду из трёх тестировщиков.',
        'Тестировал мобильные приложения на iOS и Android и веб-версию сервиса, анализировал логи и составлял баг-репорты.',
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
    resume: './resume-maxim-maslov.pdf',
  },
}
