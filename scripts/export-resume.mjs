import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import { chromium } from '@playwright/test'
import { createServer } from 'vite'
import { profile } from '../src/profile.ts'

// Сайт, PDF и DOCX используют один источник: src/profile.ts.
const root = fileURLToPath(new URL('../', import.meta.url))
process.chdir(root)
mkdirSync('public', { recursive: true })
const blocks = []
const add = (style, text, label) => blocks.push({ style, text, ...(label ? { label } : {}) })
add('name', profile.name)
add('role', profile.role)
add('contact', `${profile.location} · ${profile.contacts.email} · @masloymax`)
if (profile.availability) add('contact', profile.availability)
add('contact', 'masloymax.github.io/portfolio')
add('section', 'Профессиональный профиль')
add('body', profile.introduction)
profile.summary.forEach(text => add('body', text))
add('section', 'Опыт работы')
for (const job of profile.experience) {
  add('job', `${job.company} · ${job.period} · ${job.duration}`)
  add('jobrole', job.role)
  add('body', job.description)
  job.highlights.forEach(text => add('bullet', text))
  if (job.metrics?.length) {
    add('body', 'Метрики:')
    job.metrics.forEach(text => add('bullet', text))
  }
  add('body', `${job.technologies.join(', ')}.`, 'Стек и инструменты:')
}
if (profile.projects.length) {
  add('section', 'Проекты')
  for (const project of profile.projects) {
    add('job', `${project.title} · ${project.year}`)
    add('jobrole', project.category)
    add('body', project.description)
    project.details.forEach(text => add('bullet', text))
    add('body', `${project.tags.join(', ')}.`, 'Стек и инструменты:')
    if (project.github) add('body', project.github, 'Код:')
  }
}
add('section', 'Ключевые навыки')
for (const group of new Set(profile.skills.map(skill => skill.group))) {
  const skills = profile.skills.filter(skill => skill.group === group).map(skill => skill.note ? `${skill.name} (${skill.note})` : skill.name).join(', ')
  add('skill', [skills, profile.skillGroupNotes[group]].filter(Boolean).join('. '), `${group}:`)
}
add('section', 'Образование')
profile.education.forEach(item => add('body', `${item.period} · ${item.title} — ${item.institution}`))
add('section', 'Языки')
add('body', profile.languages.join(' · '))

const python = process.env.CV_PYTHON || (existsSync('.venv/Scripts/python.exe') ? resolve('.venv/Scripts/python.exe') : 'python')
const docx = spawnSync(python, ['scripts/write-resume-docx.py'], {
  input: JSON.stringify({ basename: 'Маслов Максим — резюме ATS', blocks }),
  encoding: 'utf8',
  windowsHide: true,
})
if (docx.error) throw docx.error
if (docx.status !== 0) throw new Error(docx.stderr || 'Не удалось создать DOCX')

const server = await createServer({ server: { host: '127.0.0.1', port: 0, watch: null }, logLevel: 'error' })
let browser
try {
  await server.listen()
  const address = server.httpServer.address()
  browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await page.emulateMedia({ media: 'print', reducedMotion: 'reduce' })
  await page.goto(`http://127.0.0.1:${address.port}/`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  const pdf = await page.pdf({ path: 'public/resume-maxim-maslov.pdf', preferCSSPageSize: true, printBackground: true, tagged: true, outline: true })
  if (!pdf.subarray(0, 5).equals(Buffer.from('%PDF-'))) throw new Error('Некорректный PDF')
  copyFileSync('Маслов Максим — резюме ATS.docx', 'Маслов Максим — резюме ATS — обновлённое.docx')
  for (const name of ['Маслов Максим — резюме ATS.pdf', 'Маслов Максим — резюме.pdf', 'Маслов Максим — резюме ATS — обновлённое.pdf']) {
    copyFileSync('public/resume-maxim-maslov.pdf', name)
  }
  console.log(docx.stdout.trim())
  console.log(JSON.stringify({ pdf: 'public/resume-maxim-maslov.pdf', bytes: readFileSync('public/resume-maxim-maslov.pdf').length, pages: [...pdf.toString('latin1').matchAll(/\/Type\s*\/Page\b/g)].length }, null, 2))
} finally {
  await browser?.close()
  await server.close()
}
