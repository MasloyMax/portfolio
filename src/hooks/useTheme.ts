import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => (
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
  ))

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('portfolio-theme', theme) } catch { /* Storage is optional. */ }
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#141414' : '#f8f8f8')
  }, [theme])

  return { theme, toggleTheme: () => setTheme(current => current === 'light' ? 'dark' : 'light') }
}
