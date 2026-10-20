import { useState } from 'react'
import { profile } from '../../profile'
import type { SkillCategory } from '../../types/portfolio'
import { SkillCard } from '../skills/SkillCard'
import { SectionHeading } from '../ui/SectionHeading'

const categories: SkillCategory[] = ['Все', 'Frontend', 'Инструменты', 'Подход']

export function SkillsSection() {
  const [category, setCategory] = useState<SkillCategory>('Все')
  const filteredSkills = profile.skills.filter(skill => (
    category === 'Все' || skill.category === category
  ))

  function countSkills(item: SkillCategory) {
    return item === 'Все'
      ? profile.skills.length
      : profile.skills.filter(skill => skill.category === item).length
  }

  return (
    <section className="skills-section container section-space" id="skills">
      <SectionHeading
        number="03"
        label="Инструменты и подход"
        title="Всё, чтобы собрать идею."
        note="Технологии важны. Ещё важнее — выбирать их под задачу."
      />
      {profile.isDraft && (
        <p className="content-note">
          <span />Примеры навыков. Список будет заменён данными вашего профиля.
        </p>
      )}

      <div className="skills-tabs" role="group" aria-label="Фильтр навыков">
        {categories.map(item => (
          <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>
            {item}<span>{countSkills(item)}</span>
          </button>
        ))}
      </div>
      <div className="skills-grid" aria-live="polite">
        {filteredSkills.map(skill => <SkillCard key={skill.name} skill={skill} />)}
      </div>
      {filteredSkills.length === 0 && (
        <p className="empty-category">В этой категории пока нет навыков.</p>
      )}
    </section>
  )
}
