import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  X,
  User,
  Globe,
  History,
  KeyRound,
  LogOut,
  Info,
  Check,
  Loader2,
  AlertTriangle,
  Trash2,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { supabase } from '../supabaseClient.js'
import { chargerProfil, sauvegarderProfil, lireProfilCache } from '../lib/profil.js'
import { supprimerToutHistorique } from '../lib/historique.js'

const APP_VERSION = '1.0.0'

function SectionTitre({ icon: Icon, children }) {
  return (
    <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-navy-700/40">
      <Icon size={12} />
      {children}
    </p>
  )
}

export default function ParametresModal({ onClose, onHistoriqueEffacee }) {
  const { user, logout, mettreAJourNomAffichage, mettreAJourModeReponse } = useAuth()
  const { setLang, t } = useLanguage()
  const tp = t.parametres
  const navigate = useNavigate()

  const [profil, setProfil] = useState(() => lireProfilCache())
  const [chargement, setChargement] = useState(!lireProfilCache())
  const [erreur, setErreur] = useState('')
  const [etatSauvegarde, setEtatSauvegarde] = useState('idle') // 'idle' | 'saving' | 'saved'

  // Initialisé directement depuis le contexte (source de vérité unique du nom),
  // pas depuis `profil` : plus besoin d'attendre chargerProfil() ni de ref d'init.
  const [nomAffichage, setNomAffichage] = useState(() => user?.name || '')
  const debounceRef = useRef(null)

  const [confirmerEffacement, setConfirmerEffacement] = useState(false)
  const [effacementEnCours, setEffacementEnCours] = useState(false)

  const [nouveauMdp, setNouveauMdp] = useState('')
  const [confirmationMdp, setConfirmationMdp] = useState('')
  const [etatMdp, setEtatMdp] = useState('idle') // 'idle' | 'saving' | 'success' | 'error'
  const [erreurMdp, setErreurMdp] = useState('')

  const [confirmerSuppressionCompte, setConfirmerSuppressionCompte] = useState(false)
  const [confirmationEmail, setConfirmationEmail] = useState('')
  const [suppressionCompteEnCours, setSuppressionCompteEnCours] = useState(false)
  const [erreurSuppressionCompte, setErreurSuppressionCompte] = useState('')

  const estCompteDemo = Boolean(user?.isDemo)

  const modeOptions = [
    { valeur: 'citoyen', ...tp.mode.options.citoyen },
    { valeur: 'educatif', ...tp.mode.options.educatif },
    { valeur: 'judiciaire', ...tp.mode.options.judiciaire },
  ]
  const langueOptions = [
    { valeur: 'fr', label: tp.langue.options.fr },
    { valeur: 'ht', label: tp.langue.options.ht },
  ]

  // Fermeture au clavier (Échap) + verrouillage du scroll de fond, comme ArticleModal.
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  useEffect(() => {
    if (estCompteDemo) {
      setChargement(false)
      return
    }
    chargerProfil()
      .then((p) => {
        setProfil(p)
      })
      .catch((err) => {
        console.error(err)
        setErreur(tp.loadError)
      })
      .finally(() => setChargement(false))
  }, [estCompteDemo])

  useEffect(() => () => clearTimeout(debounceRef.current), [])

  async function sauvegarder(champs) {
    setEtatSauvegarde('saving')
    try {
      const maj = await sauvegarderProfil(champs)
      setProfil(maj)
      setEtatSauvegarde('saved')
      setTimeout(() => setEtatSauvegarde((e) => (e === 'saved' ? 'idle' : e)), 1800)
    } catch (err) {
      console.error(err)
      setErreur(tp.saveError)
      setEtatSauvegarde('idle')
    }
  }

  async function sauvegarderNom(valeur) {
    setEtatSauvegarde('saving')
    try {
      await mettreAJourNomAffichage(valeur)
      setEtatSauvegarde('saved')
      setTimeout(() => setEtatSauvegarde((e) => (e === 'saved' ? 'idle' : e)), 1800)
    } catch (err) {
      console.error(err)
      setErreur(tp.saveError)
      setEtatSauvegarde('idle')
    }
  }

  function handleNomAffichageChange(e) {
    const valeur = e.target.value
    setNomAffichage(valeur)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => sauvegarderNom(valeur), 700)
  }

  async function choisirMode(valeur) {
    if (valeur === (user?.modeReponse || 'citoyen')) return
    setEtatSauvegarde('saving')
    try {
      await mettreAJourModeReponse(valeur)
      setEtatSauvegarde('saved')
      setTimeout(() => setEtatSauvegarde((e) => (e === 'saved' ? 'idle' : e)), 1800)
    } catch (err) {
      console.error(err)
      setErreur(tp.saveError)
      setEtatSauvegarde('idle')
    }
  }

  function choisirLangue(valeur) {
    if (valeur === profil?.langue) return
    setProfil((p) => ({ ...p, langue: valeur }))
    setLang(valeur)
    sauvegarder({ langue: valeur })
  }

  async function effacerHistorique() {
    if (!user?.id) return
    setEffacementEnCours(true)
    try {
      await supprimerToutHistorique(user.id)
      onHistoriqueEffacee?.()
      setConfirmerEffacement(false)
    } catch (err) {
      console.error(err)
      setErreur(tp.historique.deleteError)
    } finally {
      setEffacementEnCours(false)
    }
  }

  async function changerMotDePasse(e) {
    e.preventDefault()
    setErreurMdp('')
    if (nouveauMdp.length < 8) {
      setErreurMdp(tp.compte.passwordMinLength)
      return
    }
    if (nouveauMdp !== confirmationMdp) {
      setErreurMdp(tp.compte.passwordMismatch)
      return
    }
    setEtatMdp('saving')
    try {
      const { error } = await supabase.auth.updateUser({ password: nouveauMdp })
      if (error) throw error
      setEtatMdp('success')
      setNouveauMdp('')
      setConfirmationMdp('')
      setTimeout(() => setEtatMdp('idle'), 2500)
    } catch (err) {
      setEtatMdp('error')
      setErreurMdp(err.message || tp.saveError)
    }
  }

  async function seDeconnecter() {
    await logout()
    navigate('/')
  }

  // Suppression définitive du compte : nécessite la clé service_role Supabase, impossible
  // et dangereux à faire directement depuis le frontend avec la clé anonyme. La fonction
  // "supprimer-compte" (supabase/functions/supprimer-compte) supprime elle-même
  // messages/conversations/profils avant de supprimer le compte auth.
  async function supprimerCompte() {
    if (confirmationEmail.trim().toLowerCase() !== (user?.email || '').toLowerCase()) {
      setErreurSuppressionCompte(tp.compte.deleteAccountConfirmMismatch)
      return
    }
    setErreurSuppressionCompte('')
    setSuppressionCompteEnCours(true)
    try {
      const { error } = await supabase.functions.invoke('supprimer-compte')
      if (error) throw error

      await logout()
      navigate('/')
    } catch (err) {
      console.error(err)
      setErreurSuppressionCompte(tp.compte.deleteAccountError)
      setSuppressionCompteEnCours(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-navy-900/10 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-navy-900/[0.06] px-5 py-3.5">
          <h2 className="font-display text-lg font-bold text-navy-900">{tp.title}</h2>
          <div className="flex items-center gap-3">
            {etatSauvegarde === 'saving' && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-navy-700/50">
                <Loader2 size={13} className="animate-spin" />
                {tp.saving}
              </span>
            )}
            {etatSauvegarde === 'saved' && (
              <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <Check size={13} />
                {tp.saved}
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label={t.chat.close}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-navy-700/50 transition-colors hover:bg-navy-900/5 hover:text-navy-900"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Corps scrollable */}
        <div className="scroll-thin flex-1 overflow-y-auto px-5 py-5">
          {estCompteDemo ? (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
              <AlertTriangle size={24} className="text-gold-500" />
              <p className="max-w-xs text-sm text-navy-700/70">{tp.demoMessage}</p>
            </div>
          ) : chargement ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 size={20} className="animate-spin text-navy-700/40" />
            </div>
          ) : (
            <div className="space-y-7">
              {erreur && (
                <div className="rounded-xl border border-rose-400/30 bg-rose-400/5 px-3.5 py-2.5 text-xs text-rose-700">
                  {erreur}
                </div>
              )}

              {/* 1. Profil */}
              <section>
                <SectionTitre icon={User}>{tp.profil.sectionTitle}</SectionTitre>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-navy-700/60">
                      {tp.profil.nomLabel}
                    </label>
                    <input
                      type="text"
                      value={nomAffichage}
                      onChange={handleNomAffichageChange}
                      placeholder={tp.profil.nomPlaceholder}
                      className="w-full rounded-xl border border-navy-900/10 bg-navy-900/[0.02] px-3.5 py-2.5 text-sm text-navy-900 outline-none transition-colors focus:border-gold-400/50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-navy-700/60">
                      {tp.profil.emailLabel}
                    </label>
                    <input
                      type="text"
                      value={user?.email || ''}
                      readOnly
                      className="w-full cursor-not-allowed rounded-xl border border-navy-900/10 bg-navy-900/[0.03] px-3.5 py-2.5 text-sm text-navy-700/60"
                    />
                  </div>
                </div>
              </section>

              {/* 2. Mode de réponse */}
              <section>
                <SectionTitre icon={Info}>{tp.mode.sectionTitle}</SectionTitre>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {modeOptions.map((opt) => {
                    const actif = (user?.modeReponse || 'citoyen') === opt.valeur
                    return (
                      <button
                        key={opt.valeur}
                        type="button"
                        onClick={() => choisirMode(opt.valeur)}
                        className={`rounded-xl border px-3.5 py-3 text-left transition-colors ${
                          actif
                            ? 'border-gold-400/50 bg-gold-400/5'
                            : 'border-navy-900/10 hover:border-navy-900/20'
                        }`}
                      >
                        <p
                          className={`text-sm font-semibold ${actif ? 'text-gold-700' : 'text-navy-900'}`}
                        >
                          {opt.label}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-navy-700/55">
                          {opt.description}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* 3. Langue */}
              <section>
                <SectionTitre icon={Globe}>{tp.langue.sectionTitle}</SectionTitre>
                <div className="flex gap-2">
                  {langueOptions.map((opt) => {
                    const actif = profil?.langue === opt.valeur
                    return (
                      <button
                        key={opt.valeur}
                        type="button"
                        onClick={() => choisirLangue(opt.valeur)}
                        className={`flex-1 rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-colors ${
                          actif
                            ? 'border-gold-400/50 bg-gold-400/5 text-gold-700'
                            : 'border-navy-900/10 text-navy-700 hover:border-navy-900/20'
                        }`}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </section>

              {/* 4. Historique */}
              <section>
                <SectionTitre icon={History}>{tp.historique.sectionTitle}</SectionTitre>
                {!confirmerEffacement ? (
                  <button
                    type="button"
                    onClick={() => setConfirmerEffacement(true)}
                    className="rounded-xl border border-rose-400/30 px-3.5 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-400/5"
                  >
                    {tp.historique.effacerButton}
                  </button>
                ) : (
                  <div className="space-y-2.5 rounded-xl border border-rose-400/30 bg-rose-400/5 px-3.5 py-3">
                    <p className="flex items-start gap-2 text-xs text-rose-700">
                      <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                      {tp.historique.confirmWarning}
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setConfirmerEffacement(false)}
                        disabled={effacementEnCours}
                        className="rounded-lg px-3 py-1.5 text-xs font-medium text-navy-700/60 transition-colors hover:bg-navy-900/5 hover:text-navy-900 disabled:opacity-50"
                      >
                        {tp.historique.cancel}
                      </button>
                      <button
                        type="button"
                        onClick={effacerHistorique}
                        disabled={effacementEnCours}
                        className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {effacementEnCours && <Loader2 size={12} className="animate-spin" />}
                        {tp.historique.confirmButton}
                      </button>
                    </div>
                  </div>
                )}
              </section>

              {/* 5. Compte */}
              <section>
                <SectionTitre icon={KeyRound}>{tp.compte.sectionTitle}</SectionTitre>
                <form onSubmit={changerMotDePasse} className="space-y-2.5">
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <input
                      type="password"
                      value={nouveauMdp}
                      onChange={(e) => setNouveauMdp(e.target.value)}
                      placeholder={tp.compte.newPasswordPlaceholder}
                      className="w-full rounded-xl border border-navy-900/10 bg-navy-900/[0.02] px-3.5 py-2.5 text-sm text-navy-900 outline-none transition-colors focus:border-gold-400/50 focus:bg-white"
                    />
                    <input
                      type="password"
                      value={confirmationMdp}
                      onChange={(e) => setConfirmationMdp(e.target.value)}
                      placeholder={tp.compte.confirmPasswordPlaceholder}
                      className="w-full rounded-xl border border-navy-900/10 bg-navy-900/[0.02] px-3.5 py-2.5 text-sm text-navy-900 outline-none transition-colors focus:border-gold-400/50 focus:bg-white"
                    />
                  </div>
                  {erreurMdp && <p className="text-xs text-rose-600">{erreurMdp}</p>}
                  {etatMdp === 'success' && (
                    <p className="flex items-center gap-1.5 text-xs text-emerald-600">
                      <Check size={13} />
                      {tp.compte.passwordUpdated}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={etatMdp === 'saving' || !nouveauMdp || !confirmationMdp}
                    className="flex items-center gap-1.5 rounded-xl border border-navy-900/10 px-3.5 py-2 text-sm font-medium text-navy-900 transition-colors hover:border-gold-400/40 hover:bg-gold-400/5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {etatMdp === 'saving' && <Loader2 size={13} className="animate-spin" />}
                    {tp.compte.changePasswordButton}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={seDeconnecter}
                  className="mt-3 flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-medium text-navy-700/70 transition-colors hover:bg-navy-900/5 hover:text-navy-900"
                >
                  <LogOut size={14} />
                  {tp.compte.logoutButton}
                </button>

                <div className="mt-5 border-t border-navy-900/[0.06] pt-4">
                  {!confirmerSuppressionCompte ? (
                    <button
                      type="button"
                      onClick={() => setConfirmerSuppressionCompte(true)}
                      className="flex items-center gap-1.5 rounded-xl border border-rose-400/30 px-3.5 py-2.5 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-400/5"
                    >
                      <Trash2 size={14} />
                      {tp.compte.deleteAccountButton}
                    </button>
                  ) : (
                    <div className="space-y-2.5 rounded-xl border border-rose-400/30 bg-rose-400/5 px-3.5 py-3">
                      <p className="flex items-start gap-2 text-xs text-rose-700">
                        <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                        {tp.compte.deleteAccountWarning}
                      </p>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-rose-700/80">
                          {tp.compte.deleteAccountConfirmLabel(user?.email || '')}
                        </label>
                        <input
                          type="text"
                          value={confirmationEmail}
                          onChange={(e) => setConfirmationEmail(e.target.value)}
                          placeholder={tp.compte.deleteAccountConfirmPlaceholder}
                          className="w-full rounded-xl border border-rose-400/30 bg-white px-3.5 py-2.5 text-sm text-navy-900 outline-none transition-colors focus:border-rose-500"
                        />
                      </div>
                      {erreurSuppressionCompte && (
                        <p className="text-xs text-rose-700">{erreurSuppressionCompte}</p>
                      )}
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmerSuppressionCompte(false)
                            setConfirmationEmail('')
                            setErreurSuppressionCompte('')
                          }}
                          disabled={suppressionCompteEnCours}
                          className="rounded-lg px-3 py-1.5 text-xs font-medium text-navy-700/60 transition-colors hover:bg-navy-900/5 hover:text-navy-900 disabled:opacity-50"
                        >
                          {tp.historique.cancel}
                        </button>
                        <button
                          type="button"
                          onClick={supprimerCompte}
                          disabled={suppressionCompteEnCours || !confirmationEmail}
                          className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {suppressionCompteEnCours && <Loader2 size={12} className="animate-spin" />}
                          {tp.compte.deleteAccountConfirmButton}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* 6. À propos */}
              <section>
                <SectionTitre icon={Info}>{tp.apropos.sectionTitle}</SectionTitre>
                <div className="space-y-1.5 text-xs text-navy-700/55">
                  <p>{tp.apropos.version(APP_VERSION)}</p>
                  <p>{tp.apropos.corpus}</p>
                  <p className="pt-1 text-navy-700/40">{tp.apropos.disclaimer}</p>
                </div>
              </section>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
