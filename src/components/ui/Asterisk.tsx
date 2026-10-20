interface AsteriskProps {
  className?: string
}

export function Asterisk({ className = '' }: AsteriskProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M20 3h8v14l12-7 4 7-12 7 12 7-4 7-12-7v14h-8V31L8 38l-4-7 12-7L4 17l4-7 12 7V3Z"
        fill="currentColor"
      />
    </svg>
  )
}
