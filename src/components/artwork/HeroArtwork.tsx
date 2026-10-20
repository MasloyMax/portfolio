import { useId, useRef } from 'react'
import type { PointerEvent } from 'react'

export function HeroArtwork() {
  const id = useId().replace(/:/g, '')
  const artRef = useRef<HTMLDivElement>(null)
  const shape = 'M-18-114H18V-31L90-73L108-42L36 0L108 42L90 73L18 31V114H-18V31L-90 73L-108 42L-36 0L-108-42L-90-73L-18-31Z'

  function moveSculpture(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    artRef.current?.style.setProperty('--art-x', `${x * 16}deg`)
    artRef.current?.style.setProperty('--art-y', `${y * -16}deg`)
  }

  function resetSculpture() {
    artRef.current?.style.setProperty('--art-x', '0deg')
    artRef.current?.style.setProperty('--art-y', '0deg')
  }

  return (
    <div className="hero-art" ref={artRef} onPointerMove={moveSculpture} onPointerLeave={resetSculpture} aria-hidden="true">
      <div className="art-coordinate"><span>КАЧЕСТВО В КАЖДОЙ ДЕТАЛИ</span><span>+</span></div>
      <div className="sculpture-perspective">
        <svg className="sculpture" viewBox="0 0 440 400" fill="none">
          <defs>
            <linearGradient id={`${id}-face`} x1="-110" y1="-114" x2="100" y2="114" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f5f5f5" /><stop offset=".32" stopColor="#b7b7b7" />
              <stop offset=".58" stopColor="#fafafa" /><stop offset="1" stopColor="#777" />
            </linearGradient>
            <linearGradient id={`${id}-side`} x1="-110" y1="-80" x2="110" y2="114" gradientUnits="userSpaceOnUse">
              <stop stopColor="#888" /><stop offset=".48" stopColor="#282828" /><stop offset="1" stopColor="#606060" />
            </linearGradient>
            <radialGradient id={`${id}-shadow`}><stop stopColor="currentColor" stopOpacity=".18" /><stop offset="1" stopColor="currentColor" stopOpacity="0" /></radialGradient>
          </defs>
          <g className="art-grid" stroke="currentColor" strokeWidth=".7">
            <circle cx="220" cy="194" r="159" />
            <circle cx="220" cy="194" r="117" strokeDasharray="1 7" />
            <path d="M220 19v350M45 194h350" strokeDasharray="2 8" />
            <ellipse cx="220" cy="194" rx="174" ry="61" transform="rotate(-28 220 194)" />
          </g>
          <g className="orbit-track" stroke="currentColor">
            <circle cx="220" cy="194" r="159" strokeDasharray="48 951" strokeWidth="1.3" />
            <circle cx="379" cy="194" r="4" fill="currentColor" stroke="none" />
          </g>
          <ellipse className="sculpture-shadow" cx="226" cy="343" rx="100" ry="14" fill={`url(#${id}-shadow)`} />
          <g className="star-float">
            <g transform="translate(207 181) rotate(-17) skewY(-8)">
              {Array.from({ length: 24 }, (_, i) => (
                <path key={i} d={shape} transform={`translate(${(24 - i) * .7} ${(24 - i) * 1.1})`} fill={`url(#${id}-side)`} />
              ))}
              <path d={shape} fill={`url(#${id}-face)`} stroke="#e0e0e0" strokeWidth=".7" />
              <path className="star-outline" d={shape} stroke="#fff" strokeWidth="1.2" pathLength="100" />
            </g>
          </g>
          <g className="art-grid" stroke="currentColor"><path d="M55 52h10m-5-5v10M375 337h10m-5-5v10" /></g>
        </svg>
      </div>
      <div className="art-coordinate art-coordinate-bottom"><span>СИСТЕМНОСТЬ × ЛЮБОПЫТСТВО</span><span>01 / ∞</span></div>
    </div>
  )
}
