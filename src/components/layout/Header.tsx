import { ArrowUpRight, Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { Asterisk } from '../ui/Asterisk'

export function Header({ activeSection }: { activeSection: string }) {
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="site-header">
      <div className="header-inner container">
        <a className="wordmark" href="#home" aria-label="Максим Маслов — в начало">
          <Asterisk /><span>МАКСИМ МАСЛОВ</span>
        </a>
        <nav className="navigation" aria-label="Основная навигация">
          <a href="#experience" aria-current={activeSection === 'experience' ? 'location' : undefined}>Опыт</a>
          <a href="#contact" aria-current={activeSection === 'contact' ? 'location' : undefined}>На связи <ArrowUpRight size={14} /></a>
        </nav>
        <button
          className="theme-button icon-button"
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Включить тёмную тему' : 'Включить светлую тему'}
          title={theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
        >
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>
    </header>
  )
}
