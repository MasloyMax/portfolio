import { useEffect } from 'react'

export function useRevealOnScroll() {
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.08 })

    document.querySelectorAll('.reveal').forEach(element => {
      element.classList.add('will-reveal')
      observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])
}
