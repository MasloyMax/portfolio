import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../../types/portfolio'
import { ProjectArtwork } from './ProjectArtwork'

interface ProjectCardProps {
  project: Project
  index: number
  onSelect: (project: Project) => void
}

export function ProjectCard({ project, index, onSelect }: ProjectCardProps) {
  return (
    <button
      className={`project-card reveal project-${index + 1}`}
      onClick={() => onSelect(project)}
      aria-label={`Подробнее о проекте ${project.title}`}
    >
      <div className="project-cover">
        <div className="project-cover-label">
          <span>{project.isDemo ? 'Демо-концепт' : project.category}</span>
          <span>{project.year}</span>
        </div>
        <ProjectArtwork kind={project.visual} />
        <span className="project-open"><ArrowUpRight size={24} /></span>
      </div>

      <div className="project-info">
        <div>
          <span className="project-category">{project.category}</span>
          <h3>{project.title}<ArrowUpRight size={23} /></h3>
        </div>
        <p>{project.description}</p>
      </div>
      <div className="project-tags">
        {project.tags.map(tag => <span key={tag}>{tag}</span>)}
      </div>
    </button>
  )
}
