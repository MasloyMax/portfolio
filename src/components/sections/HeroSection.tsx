import { ArrowDown, ArrowUpRight, Download, Plus } from 'lucide-react'
import { profile } from '../../profile'
import { MyLive } from '../live/MyLive'

export function HeroSection() {
  const skillGroups = [...new Set(profile.skills.map(skill => skill.group))]

  return (
    <section className="hero container" id="home" aria-labelledby="hero-title">
      <div className="hero-main">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><span className="status-dot" />{profile.role}</p>
          <h1 id="hero-title" aria-label={profile.name}>
            {profile.headline.filter(Boolean).map(line => (
              <span className="name-line" key={line}>
                <span>{line.endsWith('.') ? <>{line.slice(0, -1)}<span className="name-period">.</span></> : line}</span>
              </span>
            ))}
          </h1>
          <p className="hero-description">{profile.introduction}</p>
          <div className="hero-contacts" aria-label="Контакты">
            <a href={`mailto:${profile.contacts.email}`}>{profile.contacts.email}</a>
            <a href={profile.contacts.telegram} target="_blank" rel="noreferrer">@masloymax</a>
          </div>
          <div className="hero-buttons">
            <a href={profile.contacts.telegram} target="_blank" rel="noreferrer" className="button button-dark">Обсудим задачу<ArrowUpRight size={17} /></a>
            <a href="#experience" className="text-link">Мой опыт<ArrowDown size={15} /></a>
            {profile.contacts.resume && <a href={profile.contacts.resume} download className="text-link">Скачать резюме<Download size={15} /></a>}
          </div>
        </div>
        <MyLive />
      </div>
      <div className="stack-line" aria-label="Основные технологии">
        <span className="stack-label">СТЕК</span>
        <dl className="stack-groups">
          {skillGroups.map(group => (
            <div key={group}>
              <dt>{group}</dt>
              <dd><ul aria-label="Технологии">{profile.skills.filter(skill => skill.group === group).map(skill => <li key={skill.name}>{skill.name}</li>)}</ul></dd>
            </div>
          ))}
        </dl>
      </div>
      <details className="stack-details">
        <summary>Как использую стек<Plus size={14} aria-hidden="true" /></summary>
        <dl>
          {profile.skills.map(skill => (
            <div key={skill.name}>
              <dt>{skill.name}</dt>
              <dd>{skill.detail}</dd>
            </div>
          ))}
        </dl>
      </details>
    </section>
  )
}
