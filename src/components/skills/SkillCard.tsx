import { ArrowUpRight, Code2, Layers3 } from 'lucide-react'
import type { Skill } from '../../types/portfolio'
import { Asterisk } from '../ui/Asterisk'

interface SkillCardProps {
  skill: Skill
}

const categoryClasses: Record<Skill['category'], string> = {
  Frontend: 'frontend',
  Инструменты: 'tools',
  Подход: 'approach',
}

function SkillIcon({ category }: { category: Skill['category'] }) {
  switch (category) {
    case 'Frontend':
      return <Code2 size={21} />
    case 'Инструменты':
      return <Layers3 size={21} />
    case 'Подход':
      return <Asterisk />
  }
}

export function SkillCard({ skill }: SkillCardProps) {
  return (
    <div className="skill-card">
      <span className={`skill-icon ${categoryClasses[skill.category]}`}>
        <SkillIcon category={skill.category} />
      </span>
      <div>
        <h3>{skill.name}</h3>
        <p>{skill.detail}</p>
      </div>
      <ArrowUpRight className="skill-arrow" size={17} />
    </div>
  )
}
