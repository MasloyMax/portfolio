import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { useClipboard } from '../../hooks/useClipboard'
import { profile } from '../../profile'
import { Asterisk } from '../ui/Asterisk'

export function ContactSection() {
  const { copy, status, message } = useClipboard()
  const email = profile.contacts.email!

  return (
    <section className="contact-section container reveal" id="contact" aria-labelledby="contact-title">
      <div className="contact-main">
        <div>
          <div className="eyebrow section-label">04 / КОНТАКТ</div>
          <h2 id="contact-title">Будем на связи<span className="muted">.</span></h2>
          <p>Обсудим автоматизацию, ваш продукт или сложную задачу.</p>
        </div>
        <a className="contact-telegram" href={profile.contacts.telegram} target="_blank" rel="noreferrer">
          Написать в Telegram<ArrowUpRight size={20} />
        </a>
      </div>
      <div className="contact-bottom">
        <div className="email-group">
          <a className="contact-email" href={`mailto:${email}`}>{email}</a>
          <button className="copy-button icon-button" onClick={() => copy(email, 'Почта скопирована')} aria-label="Скопировать почту" title="Скопировать почту">
            {status === 'success' ? <Check size={15} /> : <Copy size={15} />}
          </button>
        </div>
        <span className="contact-note"><Asterisk />Хорошие продукты начинаются с деталей.</span>
      </div>
      <div className={`toast ${message ? 'is-visible' : ''}`} role="status" aria-live="polite">{message}</div>
    </section>
  )
}
