import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import Logo from '../components/Logo.jsx'
import AuroraBackground from '../components/motion/AuroraBackground.jsx'
import Magnetic from '../components/motion/Magnetic.jsx'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export default function Login() {
  const { login, loginAsGuestDemo } = useAuth()
  const { t } = useLanguage()
  const l = t.login
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/halex-chat'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError(l.fillAllFields)
      return
    }
    setLoading(true)
    setTimeout(() => {
      try {
        login({ email, password })
        navigate(from, { replace: true })
      } catch (err) {
        setError(t.auth[err.message] || err.message)
      } finally {
        setLoading(false)
      }
    }, 500)
  }

  function handleDemo() {
    loginAsGuestDemo()
    navigate('/halex-chat')
  }

  return (
    <div className="grid min-h-[calc(100vh-73px)] grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-navy-950 lg:block">
        <div className="absolute inset-0 bg-justice-hero bg-cover bg-[center_20%]" />
        <AuroraBackground />
        <div className="relative flex h-full flex-col justify-between p-12">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Logo />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="max-w-md font-display text-3xl font-bold leading-snug text-white">
              &ldquo;{l.quote}&rdquo;
            </h2>
            <p className="mt-4 max-w-sm text-sm text-cream-100/60">{l.sideParagraph}</p>
          </motion.div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-cream-50 px-6 py-16 sm:px-10">
        <motion.div variants={container} initial="hidden" animate="show" className="w-full max-w-sm">
          <motion.div variants={item} className="mb-8 lg:hidden">
            <Logo />
          </motion.div>

          <motion.h1 variants={item} className="font-display text-3xl font-bold text-navy-900">
            {l.title}
          </motion.h1>
          <motion.p variants={item} className="mt-2 text-sm text-navy-700/60">{l.subtitle}</motion.p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto', x: [0, -6, 6, -4, 4, 0] }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={item}>
              <label className="mb-1.5 block text-sm font-medium text-navy-800">{l.emailLabel}</label>
              <div className="relative">
                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={l.emailPlaceholder}
                  className="w-full rounded-xl border border-navy-900/10 bg-white py-3 pl-10 pr-4 text-sm text-navy-900 shadow-sm outline-none transition focus:border-gold-400 focus:ring-2 focus:ring-gold-400/20"
                />
              </div>
            </motion.div>

            <motion.div variants={item}>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-sm font-medium text-navy-800">{l.passwordLabel}</label>
                <a href="#" className="text-xs font-medium text-gold-600 hover:text-gold-700">
                  {l.forgotPassword}
                </a>
              </div>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <motion.label variants={item} className="flex items-center gap-2 text-sm text-navy-700/70">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-navy-900/20 text-gold-500 focus:ring-gold-400/30"
              />
              {l.rememberMe}
            </motion.label>

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
                  {l.submit}
                  <ArrowRight size={17} />
                </>
              )}
            </motion.button>
          </form>

          <motion.div variants={item} className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-navy-900/10" />
            <span className="text-xs text-navy-700/40">{t.common.or}</span>
            <div className="h-px flex-1 bg-navy-900/10" />
          </motion.div>

          <motion.button
            variants={item}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleDemo}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-navy-900/10 bg-white px-6 py-3.5 text-sm font-semibold text-navy-800 shadow-sm transition hover:border-gold-400/40 hover:text-gold-600"
          >
            <ShieldCheck size={17} />
            {l.demoButton}
          </motion.button>

          <motion.p variants={item} className="mt-8 text-center text-sm text-navy-700/60">
            {l.noAccount}{' '}
            <Link to="/inscription" className="font-semibold text-gold-600 hover:text-gold-700">
              {l.createAccount}
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
