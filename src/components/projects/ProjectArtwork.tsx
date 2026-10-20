import type { ComponentType } from 'react'
import type { ProjectVisual } from '../../types/portfolio'
import { FormaArtwork } from '../artwork/FormaArtwork'
import { OrbitArtwork } from '../artwork/OrbitArtwork'
import { SignalArtwork } from '../artwork/SignalArtwork'

interface ProjectArtworkProps {
  kind: ProjectVisual
}

const artworkByKind = {
  signal: SignalArtwork,
  forma: FormaArtwork,
  orbit: OrbitArtwork,
} satisfies Record<ProjectVisual, ComponentType>

export function ProjectArtwork({ kind }: ProjectArtworkProps) {
  const Artwork = artworkByKind[kind]
  return <Artwork />
}
