import { useId, useState } from 'react'
import { Plus } from 'lucide-react'
import { profile } from '../../profile'
import type { Experience } from '../../types/portfolio'

function ExperienceItem({ job, open, onToggle, index }: { job: Experience; open: boolean; onToggle: () => void; index: number }) {
  const id = useId()

  return (
    <article className={`experience-item ${open ? 'is-open' : ''}`}>
      <h3>
        <button className="experience-toggle" aria-expanded={open} aria-controls={`${id}-details`} id={`${id}-button`} onClick={onToggle}>
          <span className="experience-number" aria-hidden="true">0{index + 1}</span>
          <span className="experience-position"><span className="experience-company">{job.company}</span><span className="experience-role">{job.role}</span></span>
          <span className="experience-period">{job.period}</span>
          <span className="experience-plus"><Plus size={17} /></span>
        </button>
      </h3>
      <div className="experience-panel" id={`${id}-details`} role="region" aria-labelledby={`${id}-button`} aria-hidden={!open} inert={!open}>
        <div className="experience-panel-inner">
          <div className="experience-detail">
            <p>{job.description}</p>
            <ul>{job.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul>
          </div>
        </div>
      </div>
    </article>
  )
}

export function ExperienceSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="experience-section container reveal" id="experience" aria-labelledby="experience-title">
      <div className="section-intro">
        <div className="eyebrow section-label">01 / ПРАКТИКА</div>
        <h2 id="experience-title">Опыт<span className="muted">.</span></h2>
        <p>{profile.about[0]}</p>
        <span className="experience-range">2021 — СЕЙЧАС</span>
      </div>
      <div className="experience-list">
        {profile.experience.map((job, index) => (
          <ExperienceItem key={job.company} job={job} index={index} open={openIndex === index} onToggle={() => setOpenIndex(current => current === index ? null : index)} />
        ))}
      </div>
    </section>
  )
}
