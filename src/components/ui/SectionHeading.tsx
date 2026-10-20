interface SectionHeadingProps {
  number: string
  label: string
  title: string
  note?: string
}

export function SectionHeading({ number, label, title, note }: SectionHeadingProps) {
  return (
    <div className="section-heading reveal">
      <div>
        <div className="eyebrow">
          <span>{number}</span>
          <span>{label}</span>
        </div>
        <h2>{title}</h2>
      </div>
      {note && <p className="section-note">{note}</p>}
    </div>
  )
}
