import { Link } from 'react-router-dom'

export default function Logo({ className = '', showText = false, to = '/' }) {
  return (
    <Link to={to} className={`flex items-center gap-2 shrink-0 ${className}`}>
      <img
        src="/image/logo_app.png"
        alt="Halex AI"
        className="h-12 w-auto object-contain"
      />
      {showText && (
        <span className="font-display text-lg font-bold tracking-wide text-white">
          HALEX <span className="text-gold-400">AI</span>
        </span>
      )}
    </Link>
  )
}
