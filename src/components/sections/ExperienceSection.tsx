import { profile } from '../../profile'

export function ExperienceSection() {
  return (
    <section className="experience-section container reveal" id="experience" aria-labelledby="experience-title">
      <div className="section-intro">
        <div className="eyebrow section-label">01 / ОПЫТ РАБОТЫ</div>
        <h2 id="experience-title">Опыт<span className="muted">.</span></h2>
        <p>Банковские системы, инструменты разработчика и мобильные сервисы.</p>
      </div>
      <div className="experience-list">
        {profile.experience.map(job => (
          <article className="experience-item" key={job.company} aria-label={job.company}>
            <header className="experience-heading">
              <h3 className="experience-company">{job.company}</h3>
              <p className="experience-role">{job.role}</p>
              <p className="experience-period">{job.period}<span aria-hidden="true"> · </span><strong>{job.duration}</strong></p>
            </header>
            <p className="experience-description">{job.description}</p>
            <ul className="experience-results">
              {job.highlights.map((highlight, index) => <li key={highlight}>{index === 0 ? <strong>{highlight}</strong> : highlight}</li>)}
            </ul>
            {job.metrics && (
              <div className="experience-metrics">
                <p className="metrics-label">Метрики</p>
                <ul>{job.metrics.map(metric => <li key={metric}>{metric}</li>)}</ul>
              </div>
            )}
            <p className="experience-technologies"><strong>Стек и инструменты:</strong> {job.technologies.join(', ')}.</p>
          </article>
        ))}
      </div>
    </section>
  )
}
