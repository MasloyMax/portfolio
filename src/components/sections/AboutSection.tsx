import { ArrowDownLeft } from 'lucide-react'
import { profile } from '../../profile'
import { SectionHeading } from '../ui/SectionHeading'

export function AboutSection() {
  return (
    <section className="about-section container section-space" id="about">
      <SectionHeading number="01" label="Человек за интерфейсом" title="Приятно познакомиться." />
      <div className="about-grid">
        <div className="identity-card reveal">
          <div className="identity-top">
            <span>HELLO, WORLD.</span>
            <ArrowDownLeft size={22} />
          </div>
          <div className="identity-monogram">
            {profile.initials}
            <span>✳</span>
          </div>
          <div className="identity-bottom">
            <h3>{profile.name}</h3>
            <span>{profile.role}</span>
          </div>
          <span className="identity-border" />
        </div>
        <div className="about-content reveal">
          <h3>В деталях —<br />весь <span className="accent">характер.</span></h3>
          {profile.about.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          <dl className="about-facts">
            {profile.facts.map(fact => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
