import { Link } from 'react-router-dom'

export default function Logo({ className = '', to = '/' }) {
  return (
    <Link to={to} className={`flex items-center shrink-0 ${className}`}>
      <img
        src="/image/halex_anim.png"
        alt="Logo Halex AI"
        className="h-10 w-auto sm:h-12"
      />
    </Link>
  )
}
