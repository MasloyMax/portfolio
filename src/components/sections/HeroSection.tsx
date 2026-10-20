import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { profile } from '../../profile'
import { HeroArtwork } from '../artwork/HeroArtwork'

export function HeroSection() {
  return (
    <section className="hero container" id="home" aria-labelledby="hero-title">
      <div className="hero-main">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow"><span className="status-dot" />{profile.role}</p>
          <h1 id="hero-title" aria-label={profile.name}>
            <span className="name-line"><span>Максим</span></span>
            <span className="name-line"><span>Маслов<span className="name-period">.</span></span></span>
          </h1>
          <p className="hero-description">{profile.introduction}</p>
          <div className="hero-buttons">
            <a href={profile.contacts.telegram} target="_blank" rel="noreferrer" className="button button-dark">Обсудим задачу<ArrowUpRight size={17} /></a>
            <a href="#experience" className="text-link">Мой опыт<ArrowDown size={15} /></a>
          </div>
        </div>
        <HeroArtwork />
      </div>
      <div className="hero-caption">
        <span>{profile.location}</span>
        <span>В тестировании с 2021 года</span>
        <span className="caption-note">ВНИМАНИЕ К ДЕТАЛЯМ — В ПРИВЫЧКЕ</span>
      </div>
      <div className="stack-line" aria-label="Основные технологии">
        <span className="stack-label">СТЕК</span>
        <ul>{profile.skills.map(skill => <li key={skill.name}>{skill.name}</li>)}</ul>
      </div>
    </section>
  )
}
