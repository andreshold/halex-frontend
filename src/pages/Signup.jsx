import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, ShieldCheck, Loader2, Briefcase, Check, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import Logo from '../components/Logo.jsx'
import GoogleIcon from '../components/GoogleIcon.jsx'
import AuroraBackground from '../components/motion/AuroraBackground.jsx'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

const ACTIVITY_OPTIONS = [
  'etudiant',
  'avocat',
  'juriste',
  'fonctionnaire',
  'entrepreneur',
  'journaliste',
  'citoyen',
  'autre',
]

const SPECIAL_CHARS_REGEX = /[!@#$%^&*()_+\-=[\]{};':"|,.<>/?]/

function getPasswordChecks(pw) {
  return {
    length: pw.length >= 8,
    upper: /[A-Z]/.test(pw),
    lower: /[a-z]/.test(pw),
    number: /[0-9]/.test(pw),
    special: SPECIAL_CHARS_REGEX.test(pw),
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const FIELD_ORDER = ['prenom', 'nom', 'typeActivite', 'email', 'password', 'confirm']

// Retourne une clé d'erreur (à traduire via s.errors) ou '' si le champ est valide.
function validateField(field, values) {
  switch (field) {
    case 'prenom':
      return values.prenom.trim() ? '' : 'required'
    case 'nom':
      return values.nom.trim() ? '' : 'required'
    case 'email':
      if (!values.email.trim()) return 'required'
      return EMAIL_REGEX.test(values.email.trim()) ? '' : 'emailInvalid'
    case 'typeActivite':
      return values.typeActivite ? '' : 'activityRequired'
    case 'password':
      if (!values.password) return 'required'
      return Object.values(getPasswordChecks(values.password)).every(Boolean) ? '' : 'passwordWeak'
    case 'confirm':
      if (!values.confirm) return 'required'
      return values.confirm === values.password ? '' : 'passwordMismatch'
    default:
      return ''
  }
}

export default function Signup() {
  const { signup, loginAsGuestDemo, loginWithGoogle, user } = useAuth()
  const { t } = useLanguage()
  const s = t.signup
  const navigate = useNavigate()

  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [typeActivite, setTypeActivite] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const fieldRefs = {
    prenom: useRef(null),
    nom: useRef(null),
    typeActivite: useRef(null),
    email: useRef(null),
    password: useRef(null),
    confirm: useRef(null),
  }

  const passwordChecks = getPasswordChecks(password)

  useEffect(() => {
    if (user) navigate('/halex-chat', { replace: true })
  }, [user, navigate])

  // Valide un seul champ à partir de l'état courant (+ overrides éventuels) et met à jour `errors`.
  function runValidation(field, overrides = {}) {
    const values = { prenom, nom, email, typeActivite, password, confirm, ...overrides }
    const key = validateField(field, values)
    setErrors((prev) => {
      if (!key) {
        if (!(field in prev)) return prev
        const next = { ...prev }
        delete next[field]
        return next
      }
      return { ...prev, [field]: key }
    })
    return key
  }

  function revalidateIfErrored(field, overrides) {
    if (errors[field]) runValidation(field, overrides)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const values = { prenom, nom, email, typeActivite, password, confirm }
    const newErrors = {}
    FIELD_ORDER.forEach((field) => {
      const key = validateField(field, values)
      if (key) newErrors[field] = key
    })
    setErrors(newErrors)

    const firstErroredField = FIELD_ORDER.find((field) => newErrors[field])
    if (firstErroredField) {
      const node = fieldRefs[firstErroredField].current
      if (node) {
        node.scrollIntoView({ behavior: 'smooth', block: 'center' })
        node.focus()
      }
      return
    }

    if (!agree) {
      setError(s.mustAgree)
      return
    }
    setLoading(true)
    try {
      await signup({ prenom, nom, email, password, typeActivite })
      navigate('/halex-chat', { replace: true })
    } catch (err) {
      setError(t.auth[err.message] || err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleDemo() {
    loginAsGuestDemo()
    navigate('/halex-chat')
  }

 async function handleGoogleSignup() {
    setError('')
    setGoogleLoading(true)
    try {
      await loginWithGoogle()
      // Pas de navigate ici : Supabase redirige vers Google, puis revient sur /halex-chat
    } catch (err) {
      setError(err.message)
      setGoogleLoading(false)
    }
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
              {s.quote}
            </h2>
            <p className="mt-4 max-w-sm text-sm text-cream-100/60">{s.sideParagraph}</p>
          </motion.div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-cream-50 px-6 py-16 sm:px-10">
        <motion.div variants={container} initial="hidden" animate="show" className="w-full max-w-sm">
          <motion.div variants={item} className="mb-8 lg:hidden">
            <Logo />
          </motion.div>

          <motion.h1 variants={item} className="font-display text-3xl font-bold text-navy-900">
            {s.title}
          </motion.h1>
          <motion.p variants={item} className="mt-2 text-sm text-navy-700/60">{s.subtitle}</motion.p>

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

            <motion.div variants={item} className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy-800">{s.prenomLabel}</label>
                <div className="relative">
                  <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700/40" />
                  <input
                    ref={fieldRefs.prenom}
                    value={prenom}
                    onChange={(e) => {
                      const v = e.target.value
                      setPrenom(v)
                      revalidateIfErrored('prenom', { prenom: v })
                    }}
                    onBlur={() => runValidation('prenom')}
                    placeholder={s.prenomPlaceholder}
                    required
                    aria-invalid={errors.prenom ? 'true' : 'false'}
                    aria-describedby={errors.prenom ? 'prenom-error' : undefined}
                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-3 text-sm text-navy-900 shadow-sm outline-none transition focus:ring-2 ${
                      errors.prenom
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                        : 'border-navy-900/10 focus:border-gold-400 focus:ring-gold-400/20'
                    }`}
                  />
                </div>
                {errors.prenom && (
                  <p id="prenom-error" className="mt-1.5 text-xs text-red-500">
                    {s.errors[errors.prenom]}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy-800">{s.nomLabel}</label>
                <div className="relative">
                  <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700/40" />
                  <input
                    ref={fieldRefs.nom}
                    value={nom}
                    onChange={(e) => {
                      const v = e.target.value
                      setNom(v)
                      revalidateIfErrored('nom', { nom: v })
                    }}
                    onBlur={() => runValidation('nom')}
                    placeholder={s.nomPlaceholder}
                    required
                    aria-invalid={errors.nom ? 'true' : 'false'}
                    aria-describedby={errors.nom ? 'nom-error' : undefined}
                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-3 text-sm text-navy-900 shadow-sm outline-none transition focus:ring-2 ${
                      errors.nom
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                        : 'border-navy-900/10 focus:border-gold-400 focus:ring-gold-400/20'
                    }`}
                  />
                </div>
                {errors.nom && (
                  <p id="nom-error" className="mt-1.5 text-xs text-red-500">
                    {s.errors[errors.nom]}
                  </p>
                )}
              </div>
            </motion.div>

            <motion.div variants={item}>
              <label className="mb-1.5 block text-sm font-medium text-navy-800">{s.activityLabel}</label>
              <div className="relative">
                <Briefcase size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700/40" />
                <select
                  ref={fieldRefs.typeActivite}
                  value={typeActivite}
                  onChange={(e) => {
                    const v = e.target.value
                    setTypeActivite(v)
                    revalidateIfErrored('typeActivite', { typeActivite: v })
                  }}
                  onBlur={() => runValidation('typeActivite')}
                  required
                  aria-invalid={errors.typeActivite ? 'true' : 'false'}
                  aria-describedby={errors.typeActivite ? 'typeActivite-error' : undefined}
                  className={`w-full appearance-none rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-navy-900 shadow-sm outline-none transition focus:ring-2 ${
                    errors.typeActivite
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                      : 'border-navy-900/10 focus:border-gold-400 focus:ring-gold-400/20'
                  }`}
                >
                  <option value="" disabled>
                    {s.activityPlaceholder}
                  </option>
                  {ACTIVITY_OPTIONS.map((key) => (
                    <option key={key} value={key}>
                      {s.activityOptions[key]}
                    </option>
                  ))}
                </select>
              </div>
              {errors.typeActivite && (
                <p id="typeActivite-error" className="mt-1.5 text-xs text-red-500">
                  {s.errors[errors.typeActivite]}
                </p>
              )}
            </motion.div>

            <motion.div variants={item}>
              <label className="mb-1.5 block text-sm font-medium text-navy-800">{s.emailLabel}</label>
              <div className="relative">
                <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700/40" />
                <input
                  ref={fieldRefs.email}
                  type="email"
                  value={email}
                  onChange={(e) => {
                    const v = e.target.value
                    setEmail(v)
                    revalidateIfErrored('email', { email: v })
                  }}
                  onBlur={() => runValidation('email')}
                  placeholder={s.emailPlaceholder}
                  required
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-navy-900 shadow-sm outline-none transition focus:ring-2 ${
                    errors.email
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                      : 'border-navy-900/10 focus:border-gold-400 focus:ring-gold-400/20'
                  }`}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="mt-1.5 text-xs text-red-500">
                  {s.errors[errors.email]}
                </p>
              )}
            </motion.div>

            <motion.div variants={item}>
              <label className="mb-1.5 block text-sm font-medium text-navy-800">{s.passwordLabel}</label>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700/40" />
                <input
                  ref={fieldRefs.password}
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    const v = e.target.value
                    setPassword(v)
                    revalidateIfErrored('password', { password: v })
                    revalidateIfErrored('confirm', { password: v })
                  }}
                  onBlur={() => runValidation('password')}
                  placeholder={s.passwordPlaceholder}
                  required
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  className={`w-full rounded-xl border bg-white py-3 pl-10 pr-11 text-sm text-navy-900 shadow-sm outline-none transition focus:ring-2 ${
                    errors.password
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                      : 'border-navy-900/10 focus:border-gold-400 focus:ring-gold-400/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy-700/40 hover:text-navy-700"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="mt-1.5 text-xs text-red-500">
                  {s.errors[errors.password]}
                </p>
              )}
              {password.length > 0 && (
                <ul className="mt-2.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {[
                    ['length', s.passwordRequirements.length],
                    ['upper', s.passwordRequirements.upper],
                    ['lower', s.passwordRequirements.lower],
                    ['number', s.passwordRequirements.number],
                    ['special', s.passwordRequirements.special],
                  ].map(([key, label]) => {
                    const ok = passwordChecks[key]
                    return (
                      <li
                        key={key}
                        className={`flex items-center gap-1.5 text-xs transition-colors ${
                          ok ? 'text-gold-600' : 'text-navy-700/40'
                        }`}
                      >
                        {ok ? <Check size={13} className="shrink-0" /> : <X size={13} className="shrink-0" />}
                        {label}
                      </li>
                    )
                  })}
                </ul>
              )}
            </motion.div>

            <motion.div variants={item}>
              <label className="mb-1.5 block text-sm font-medium text-navy-800">{s.confirmLabel}</label>
              <div className="relative">
                <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700/40" />
                <input
                  ref={fieldRefs.confirm}
                  type={showPassword ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => {
                    const v = e.target.value
                    setConfirm(v)
                    revalidateIfErrored('confirm', { confirm: v })
                  }}
                  onBlur={() => runValidation('confirm')}
                  placeholder="••••••••"
                  required
                  aria-invalid={errors.confirm ? 'true' : 'false'}
                  aria-describedby={errors.confirm ? 'confirm-error' : undefined}
                  className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm text-navy-900 shadow-sm outline-none transition focus:ring-2 ${
                    errors.confirm
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                      : 'border-navy-900/10 focus:border-gold-400 focus:ring-gold-400/20'
                  }`}
                />
              </div>
              {errors.confirm && (
                <p id="confirm-error" className="mt-1.5 text-xs text-red-500">
                  {s.errors[errors.confirm]}
                </p>
              )}
            </motion.div>

            <motion.label variants={item} className="flex items-start gap-2 text-sm text-navy-700/70">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-navy-900/20 text-gold-500 focus:ring-gold-400/30"
              />
              <span>
                {s.agreePrefix}{' '}
                <a href="#" className="font-medium text-gold-600 hover:text-gold-700">
                  {s.agreeTerms}
                </a>{' '}
                {s.agreeSuffix}
              </span>
            </motion.label>

            <motion.button
              variants={item}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-navy-950 px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-navy-900 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
                  <Loader2 size={17} />
                </motion.span>
              ) : (
                <>
                  {s.submit}
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
            type="button"
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-full border border-navy-900/15 bg-white px-6 py-3.5 text-sm font-semibold text-navy-800 shadow-sm transition hover:border-navy-900/25 hover:shadow-md disabled:opacity-60"
          >
            {googleLoading ? (
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
                <Loader2 size={17} />
              </motion.span>
            ) : (
              <>
                <GoogleIcon size={18} />
                {s.continueWithGoogle}
              </>
            )}
          </motion.button>

          <motion.button
            variants={item}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleDemo}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-navy-900/10 bg-white px-6 py-3.5 text-sm font-semibold text-navy-800 shadow-sm transition hover:border-gold-400/40 hover:text-gold-600"
          >
            <ShieldCheck size={17} />
            {s.demoButton}
          </motion.button>

          <motion.p variants={item} className="mt-8 text-center text-sm text-navy-700/60">
            {s.haveAccount}{' '}
            <Link to="/connexion" className="font-semibold text-gold-600 hover:text-gold-700">
              {s.login}
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}
