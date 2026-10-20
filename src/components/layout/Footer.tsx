import { ArrowUp } from 'lucide-react'

export function Footer() {
  return (
    <footer className="site-footer container">
      <span>© {new Date().getFullYear()} Максим Маслов</span>
      <a className="back-to-top" href="#home">Наверх<ArrowUp size={14} /></a>
    </footer>
  )
}
