import { Plus } from 'lucide-react'
import { profile } from '../../profile'

export function ResumeSkillsSection() {
  const groups = [...new Set(profile.skills.map(skill => skill.group))]

  return (
    <section className="resume-skills container" id="skills" aria-labelledby="skills-title">
      <div className="section-intro">
        <div className="eyebrow section-label">03 / ИНСТРУМЕНТЫ</div>
        <h2 id="skills-title">Навыки<span className="muted">.</span></h2>
      </div>
      <dl className="stack-groups">
        {groups.map(group => (
          <div key={group}>
            <dt>{group}</dt>
            <dd><ul aria-label="Технологии">{profile.skills.filter(skill => skill.group === group).map(skill => <li key={skill.name}>{skill.name}{skill.note && ` (${skill.note})`}</li>)}</ul>{profile.skillGroupNotes[group] && <p className="stack-group-note">{profile.skillGroupNotes[group]}</p>}</dd>
          </div>
        ))}
      </dl>
      <details className="stack-details">
        <summary>Как использую стек<Plus size={16} aria-hidden="true" /></summary>
        <dl>{profile.skills.map(skill => <div key={skill.name}><dt>{skill.name}</dt><dd>{skill.detail}</dd></div>)}</dl>
      </details>
    </section>
  )
}