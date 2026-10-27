import { ArrowDown, ArrowUpRight, Download, Printer } from 'lucide-react'
import { profile } from '../../profile'

export function HeroSection() {
  return (
    <section className="hero container" id="home" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow hero-eyebrow">{profile.role}</p>
        <h1 id="hero-title" aria-label={profile.name}>
          {profile.headline.filter(Boolean).map(line => (
            <span className="name-line" key={line}><span>{line.replace(/\.$/, '')}</span></span>
          ))}
        </h1>
        <p className="hero-description">{profile.introduction}</p>
        <div className="hero-contacts" aria-label="Контакты">
          <a href={`mailto:${profile.contacts.email}`}>{profile.contacts.email}</a>
          <a href={profile.contacts.telegram} target="_blank" rel="noreferrer">@masloymax</a>
          <span>{profile.location}</span>
        </div>
        <p className="print-website"><a href="https://masloymax.github.io/portfolio/">masloymax.github.io/portfolio</a></p>
        <div className="hero-buttons">
          {profile.contacts.resume && <a href={profile.contacts.resume} download="Maxim-Maslov-QA.pdf" className="button button-dark">Скачать резюме<Download size={17} /></a>}
          <a href="#experience" className="text-link">Мой опыт<ArrowDown size={16} /></a>
          <button type="button" className="text-link print-button" onClick={() => window.print()}>Печать<Printer size={16} /></button>
          <a href={profile.contacts.telegram} target="_blank" rel="noreferrer" className="text-link">Обсудим задачу<ArrowUpRight size={16} /></a>
        </div>
      </div>
    </section>
  )
}