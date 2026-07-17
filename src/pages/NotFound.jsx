import { Link } from 'react-router-dom'
import { Scale, ArrowLeft } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function NotFound() {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-[calc(100vh-73px)] flex-col items-center justify-center bg-navy-950 px-5 text-center">
      <div className="inline-flex rounded-2xl bg-white/5 p-5 text-gold-400">
        <Scale size={36} />
      </div>
      <h1 className="mt-6 font-display text-6xl font-black text-white">404</h1>
      <p className="mt-3 max-w-sm text-cream-100/60">{t.notFound.message}</p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-400 px-6 py-3 text-sm font-semibold text-navy-950 shadow-gold transition hover:bg-gold-300"
      >
        <ArrowLeft size={16} />
        {t.notFound.backHome}
      </Link>
    </div>
  )
}
