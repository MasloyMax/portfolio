import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { ContactSection } from './components/sections/ContactSection'
import { ExperienceSection } from './components/sections/ExperienceSection'
import { HeroSection } from './components/sections/HeroSection'
import { ResumeSkillsSection } from './components/sections/ResumeSkillsSection'
import { MyLive } from './components/live/MyLive'
import { usePageScroll } from './hooks/usePageScroll'
import { useRevealOnScroll } from './hooks/useRevealOnScroll'

export default function App() {
  const activeSection = usePageScroll()
  useRevealOnScroll()

  return (
    <>
      <a className="skip-link" href="#main">Перейти к содержимому</a>
      <div className="scroll-progress" aria-hidden="true" />
      <Header activeSection={activeSection} />
      <main id="main" tabIndex={-1}>
        <HeroSection />
        <ExperienceSection />
        <ResumeSkillsSection />
        <MyLive />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
