import { Asterisk } from '../ui/Asterisk'

const principles = [
  'Любопытство',
  'Осмысленный дизайн',
  'Чистая реализация',
  'Внимание к деталям',
]

export function PrinciplesStrip() {
  return (
    <div className="principles-strip">
      <div className="container principles-inner">
        {principles.map(text => <span key={text}><Asterisk />{text}</span>)}
      </div>
    </div>
  )
}
