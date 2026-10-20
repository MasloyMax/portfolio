import { useState } from 'react'
import { profile } from '../../profile'
import type { Project } from '../../types/portfolio'
import { ProjectCard } from '../projects/ProjectCard'
import { ProjectDialog } from '../projects/ProjectDialog'
import { SectionHeading } from '../ui/SectionHeading'

export function ProjectsSection() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  return (
    <>
      <section className="projects-section section-space" id="projects">
        <div className="container">
          <SectionHeading
            number="02"
            label="Избранные работы"
            title="От задумки к результату."
            note="У каждой задачи своя история. И свой способ сделать сложное понятным."
          />
          {profile.projects.some(project => project.isDemo) && (
            <p className="content-note">
              <span />Демо-концепты для показа дизайна. Здесь будут ваши реальные проекты.
            </p>
          )}

          <div className="project-grid">
            {profile.projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onSelect={setSelectedProject}
              />
            ))}
          </div>
        </div>
      </section>
      <ProjectDialog project={selectedProject} onClose={() => setSelectedProject(null)} />
    </>
  )
}
