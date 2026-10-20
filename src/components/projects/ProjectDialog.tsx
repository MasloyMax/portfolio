import { useEffect, useRef } from 'react'
import { Check, ExternalLink, Github, X } from 'lucide-react'
import type { Project } from '../../types/portfolio'
import { ProjectArtwork } from './ProjectArtwork'

interface ProjectDialogProps {
  project: Project | null
  onClose: () => void
}

export function ProjectDialog({ project, onClose }: ProjectDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !project) return

    const previousFocus = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    dialog.showModal()
    document.body.style.overflow = 'hidden'

    return () => {
      dialog.close()
      document.body.style.overflow = previousOverflow
      previousFocus?.focus()
    }
  }, [project])

  return (
    <dialog
      ref={dialogRef}
      className="project-dialog"
      aria-labelledby="project-dialog-title"
      onClose={onClose}
      onClick={event => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {project && (
        <div className="dialog-content">
          <button
            className="icon-button dialog-close"
            aria-label="Закрыть проект"
            onClick={onClose}
            autoFocus
          >
            <X size={22} />
          </button>
          <ProjectArtwork kind={project.visual} />

          <div className="dialog-text">
            <div className="eyebrow">
              {project.isDemo ? 'Демонстрационный концепт' : project.category}
            </div>
            <h2 id="project-dialog-title">{project.title}<span>↗</span></h2>
            <p className="dialog-lead">{project.description}</p>
            <div className="project-tags">
              {project.tags.map(tag => <span key={tag}>{tag}</span>)}
            </div>

            <div className="dialog-columns">
              <div><h3>Идея</h3><p>{project.challenge}</p></div>
              <div><h3>Решение</h3><p>{project.solution}</p></div>
            </div>
            <ul className="project-details">
              {project.details.map(detail => (
                <li key={detail}><Check size={16} />{detail}</li>
              ))}
            </ul>

            {(project.url || project.github) && (
              <div className="dialog-links">
                {project.url && (
                  <a className="button button-dark" href={project.url} target="_blank" rel="noreferrer">
                    Открыть проект<ExternalLink size={17} />
                  </a>
                )}
                {project.github && (
                  <a className="button button-outline" href={project.github} target="_blank" rel="noreferrer">
                    Код на GitHub<Github size={17} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </dialog>
  )
}
