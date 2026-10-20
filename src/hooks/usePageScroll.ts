import { useEffect, useState } from 'react'

export function usePageScroll() {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('main section[id]')
    let frame = 0

    function updateScroll() {
      frame = 0
      const height = document.documentElement.scrollHeight - window.innerHeight
      const progress = height > 0 ? Math.min(1, Math.max(0, window.scrollY / height)) : 0
      document.documentElement.style.setProperty('--scroll-progress', `${progress}`)
      let currentSection = ''
      sections.forEach(section => {
        if (section.getBoundingClientRect().top <= 160) currentSection = section.id
      })
      if (height > 0 && window.scrollY >= height - 4) currentSection = 'contact'
      setActiveSection(currentSection)
    }

    function scheduleUpdate() {
      if (!frame) frame = window.requestAnimationFrame(updateScroll)
    }

    updateScroll()
    const observer = new ResizeObserver(scheduleUpdate)
    observer.observe(document.body)
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [])

  return activeSection
}
