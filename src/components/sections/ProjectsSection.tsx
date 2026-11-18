import { ArrowUpRight } from 'lucide-react'
import { profile } from '../../profile'

export function ProjectsSection() {
  if (!profile.projects.length) return null

  return (
    <section className="practice-projects container" id="projects" aria-labelledby="projects-title">
      <div className="section-intro">
        <div className="eyebrow section-label">02 / ПРОЕКТЫ</div>
        <h2 id="projects-title">Проекты<span className="muted">.</span></h2>
        <p>Самостоятельная практика автоматизации на Java.</p>
      </div>
      {profile.projects.map(project => (
        <article className="experience-item" key={project.id} aria-label={project.title}>
          <h3 className="experience-company">{project.title}</h3>
          <p className="experience-period">{project.category} · {project.year}</p>
          <p className="experience-description">{project.description}</p>
          <ul className="experience-results">
            {project.details.map(detail => <li key={detail}>{detail}</li>)}
          </ul>
          <p className="experience-technologies"><strong>Стек и инструменты:</strong> {project.tags.join(', ')}.</p>
          {project.github && (
            <a className="project-source text-link" href={project.github} target="_blank" rel="noreferrer">
              Код на GitHub<ArrowUpRight size={16} aria-hidden="true" />
            </a>
          )}
        </article>
      ))}
    </section>
  )
}
