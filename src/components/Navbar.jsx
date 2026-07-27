import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, MessageSquareText, LogOut, User } from 'lucide-react'
import Logo from './Logo.jsx'
import Magnetic from './motion/Magnetic.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuth()
  const { lang, toggleLang, t } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()

  const navLinks = [
    { to: '/', label: t.nav.home },
    { to: '/fonctionnalites', label: t.nav.features },
    { to: '/documents', label: t.nav.documents },
    { to: '/article-du-jour', label: t.nav.articleOfDay },
    { to: '/tarifs', label: t.nav.pricing },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-navy-800/90 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-navy-800/60 backdrop-blur-sm'
      } border-b border-white/5`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Logo />
        </motion.div>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-gold-300' : 'text-cream-100/80 hover:text-gold-300'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full bg-white/5"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </NavLink>
            )
          })}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitch lang={lang} toggleLang={toggleLang} label={t.common.langSwitchLabel} />

          {user ? (
            <>
              <Magnetic>
                <Link
                  to="/halex-chat"
                  className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-4 py-2 text-sm font-semibold text-navy-950 shadow-gold transition hover:bg-gold-300"
                >
                  <MessageSquareText size={16} />
                  {t.nav.chat}
                </Link>
              </Magnetic>
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-cream-100/80 transition hover:border-gold-400/40 hover:text-gold-300"
              >
                <LogOut size={16} />
                {t.nav.logout}
              </motion.button>
            </>
          ) : (
            <>
              <Link
                to="/connexion"
                className="rounded-full px-4 py-2 text-sm font-medium text-cream-100/80 transition hover:text-gold-300"
              >
                {t.nav.login}
              </Link>
              <Magnetic>
                <Link
                  to="/inscription"
                  className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-5 py-2 text-sm font-semibold text-navy-950 shadow-gold transition hover:bg-gold-300"
                >
                  {t.nav.startFree}
                </Link>
              </Magnetic>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitch lang={lang} toggleLang={toggleLang} label={t.common.langSwitchLabel} compact />

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="rounded-lg p-2.5 text-cream-100"
            onClick={() => setOpen((o) => !o)}
            aria-label={t.nav.openMenu}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={open ? 'x' : 'menu'}
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
                transition={{ duration: 0.2 }}
                className="flex"
              >
                {open ? <X size={24} /> : <Menu size={24} />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-white/5 bg-navy-950/98 lg:hidden"
          >
            <div className="flex flex-col gap-1 px-5 pb-6 pt-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.25 }}
                >
                  <NavLink
                    to={link.to}
                    className={({ isActive }) =>
                      `block rounded-lg px-4 py-3 text-sm font-medium ${
                        isActive ? 'bg-white/5 text-gold-300' : 'text-cream-100/80'
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                </motion.div>
              ))}
            </div>
            <div className="flex flex-col gap-2 border-t border-white/10 px-5 pb-6 pt-4">
              {user ? (
                <>
                  <Link
                    to="/halex-chat"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-400 px-4 py-3 text-sm font-semibold text-navy-950"
                  >
                    <MessageSquareText size={16} />
                    {t.nav.goToChat}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-cream-100/80"
                  >
                    <LogOut size={16} />
                    {t.nav.logout}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/connexion"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm font-medium text-cream-100/80"
                  >
                    <User size={16} />
                    {t.nav.login}
                  </Link>
                  <Link
                    to="/inscription"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-400 px-4 py-3 text-sm font-semibold text-navy-950"
                  >
                    {t.nav.startFree}
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

function LanguageSwitch({ lang, toggleLang, label, compact = false }) {
  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.94 }}
      onClick={toggleLang}
      aria-label={label}
      title={label}
      className={`relative inline-flex items-center rounded-full border border-white/15 bg-white/5 p-0.5 text-xs font-bold ${
        compact ? '' : ''
      }`}
    >
      {['ht', 'fr'].map((code) => (
        <span
          key={code}
          className={`relative z-10 rounded-full px-2.5 py-1 uppercase transition-colors ${
            lang === code ? 'text-navy-950' : 'text-cream-100/70'
          }`}
        >
          {code}
        </span>
      ))}
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="absolute inset-y-0.5 w-[calc(50%-2px)] rounded-full bg-gold-400"
        style={{ left: lang === 'ht' ? 2 : 'calc(50% + 0px)' }}
      />
    </motion.button>
  )
}
