import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Lock, ArrowRight, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import Logo from '../components/Logo.jsx'
import AuroraBackground from '../components/motion/AuroraBackground.jsx'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

// Affichée globalement (depuis App.jsx) quand Supabase déclenche l'événement
// PASSWORD_RECOVERY, indépendamment de la route où l'utilisateur atterrit
// après avoir cliqué le lien reçu par email.
export default function ReinitialiserMotDePasse() {
  const { definirNouveauMotDePasse } = useAuth()
  const { t } = useLanguage()
  const l = t.login
  const navigate = useNavigate()

  const [motDePasse, setMotDePasse] = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!motDePasse || !confirmation) {
      setError(l.fillAllFields)
      return
    }
    if (motDePasse.length < 6) {
      setError(l.passwordTooShort)
      return
    }
    if (motDePasse !== confirmation) {
      setError(l.passwordMismatch)
      return
    }
    setLoading(true)
    try {
      await definirNouveauMotDePasse(motDePasse)
      navigate('/halex-chat', { replace: true })
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-navy-950 lg:block">
        <div className="absolute inset-0 bg-justice-hero bg-cover bg-[center_20%]" />
        <AuroraBackground />
        <div className="relative flex h-full flex-col justify-between p-12">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Logo />
          </motion.div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-cream-50 px-6 py-16 sm:px-10">
        <motion.div variants={container} initial="hidden" animate="show" className="w-full max-w-sm">
          <motion.div variants={item} className="mb-8 lg:hidden">
            <Logo />
          </motion.div>

          <motion.h1 variants={item} className="font-display text-3xl font-bold text-navy-900">
            {l.newPasswordTitle}
          </motion.h1>
          <motion.p variants={item} className="mt-2 text-sm text-navy-700/60">{l.newPasswordSubtitle}</motion.p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto', x: [0, -6, 6, -4, 4, 0] }}
                transition={{ duration: 0.4 }}
                className="overflow-hidden rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
              >
                {error}
              </motion.div>
            )}

            <motion.div variants={item}>
              <label className="mb-1.5 block text-sm font-medium text-navy-800">{l.newPasswordLabel}</label>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-navy-900/10 bg-white py-3 pl-10 pr-11 text-sm text-navy-900 shadow-sm outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-700/40 hover:text-navy-700"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={item}>
              <label className="mb-1.5 block text-sm font-medium text-navy-800">{l.confirmNewPasswordLabel}</label>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-navy-900/10 bg-white py-3 pl-10 pr-4 text-sm text-navy-900 shadow-sm outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
                />
              </div>
            </motion.div>

            <motion.button
              variants={item}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-navy-950 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-navy-900 disabled:opacity-60"
            >
              {loading ? (
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
                  <Loader2 size={17} />
                </motion.span>
              ) : (
                <>
                  {l.updatePasswordButton}
                  <ArrowRight size={17} />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
