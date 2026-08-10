import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ShieldCheck,
  FileJson,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  Check,
  Home,
} from 'lucide-react'
import { verifierAccesAdmin, validerFichier, insererFichier } from '../lib/apiAdmin.js'

function normaliserResume(resume) {
  if (!resume) return []
  if (Array.isArray(resume)) {
    return resume.map((item, i) => {
      if (item && typeof item === 'object') {
        const label = item.source ?? item.nom ?? item.name ?? `Source ${i + 1}`
        const valeur = item.nb_chunks ?? item.count ?? item.total ?? item.valeur ?? ''
        return [String(label), valeur]
      }
      return [String(i), item]
    })
  }
  if (typeof resume === 'object') return Object.entries(resume)
  return []
}

function decrireDoublon(item) {
  if (typeof item === 'string') return item
  if (item && typeof item === 'object') {
    const parts = [item.article, item.raison ?? item.source].filter(Boolean)
    return parts.length ? parts.join(' — ') : JSON.stringify(item)
  }
  return String(item)
}

export default function Admin() {
  const navigate = useNavigate()
  const [accessState, setAccessState] = useState('loading') // 'loading' | 'granted'

  const [file, setFile] = useState(null)
  const [validating, setValidating] = useState(false)
  const [rapport, setRapport] = useState(null)
  const [erreurValidation, setErreurValidation] = useState(null)

  const [confirmOuvert, setConfirmOuvert] = useState(false)
  const [inserting, setInserting] = useState(false)
  const [resultat, setResultat] = useState(null)
  const [erreurInsertion, setErreurInsertion] = useState(null)
  const [commandeCopiee, setCommandeCopiee] = useState(false)

  useEffect(() => {
    let annule = false
    verifierAccesAdmin()
      .then(({ ok }) => {
        if (annule) return
        if (ok) setAccessState('granted')
        else navigate('/', { replace: true })
      })
      .catch(() => {
        if (!annule) navigate('/', { replace: true })
      })
    return () => {
      annule = true
    }
  }, [navigate])

  function handleFileChange(e) {
    const f = e.target.files?.[0] ?? null
    setFile(f)
    setRapport(null)
    setErreurValidation(null)
    setResultat(null)
    setErreurInsertion(null)
  }

  async function handleValider() {
    if (!file || validating) return
    setValidating(true)
    setErreurValidation(null)
    setRapport(null)
    setResultat(null)
    setErreurInsertion(null)
    try {
      const { ok, status, data } = await validerFichier(file)
      if (ok) {
        setRapport(data)
      } else if (status === 409 && data?.detail && typeof data.detail === 'object') {
        setRapport(data.detail)
      } else {
        const message =
          (typeof data?.detail === 'string' && data.detail) || `Échec de la validation (code ${status})`
        setErreurValidation(message)
      }
    } catch {
      setErreurValidation('Impossible de joindre le serveur Halex pour la validation.')
    } finally {
      setValidating(false)
    }
  }

  async function confirmerInsertion() {
    setConfirmOuvert(false)
    if (!file || inserting) return
    setInserting(true)
    setErreurInsertion(null)
    try {
      const { ok, status, data } = await insererFichier(file)
      if (ok) {
        setResultat(data)
      } else {
        const message =
          (typeof data?.detail === 'string' && data.detail) || `Échec de l'insertion (code ${status})`
        setErreurInsertion(message)
      }
    } catch {
      setErreurInsertion("Impossible de joindre le serveur Halex pour l'insertion.")
    } finally {
      setInserting(false)
    }
  }

  function copierCommande() {
    if (!resultat?.commande_annulation) return
    navigator.clipboard?.writeText(resultat.commande_annulation)
    setCommandeCopiee(true)
    setTimeout(() => setCommandeCopiee(false), 1800)
  }

  if (accessState === 'loading') {
    return (
      <div className="flex h-dvh items-center justify-center bg-cream-50">
        <p className="text-sm text-navy-700/50">Vérification des droits d&apos;accès…</p>
      </div>
    )
  }

  const pret = rapport?.pret_pour_insertion === true
  const resumeEntries = normaliserResume(rapport?.resume_par_source)
  const erreurs = Array.isArray(rapport?.erreurs) ? rapport.erreurs : []
  const doublonsInternes = Array.isArray(rapport?.doublons_internes) ? rapport.doublons_internes : []
  const doublonsEnBase = Array.isArray(rapport?.doublons_en_base) ? rapport.doublons_en_base : []

  return (
    <div className="min-h-dvh bg-cream-50">
      <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-navy-900/[0.06] bg-cream-50/80 px-4 py-3 backdrop-blur-md sm:px-6">
        <ShieldCheck size={18} className="text-gold-600" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-navy-900">Panneau Admin — Documents juridiques</p>
        </div>
        <Link
          to="/"
          className="flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-navy-700/60 transition-colors hover:bg-navy-900/5 hover:text-navy-900"
        >
          <Home size={14} />
          <span className="hidden sm:inline">Accueil</span>
        </Link>
      </div>

      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6">
        {/* Étape 1 : sélection + validation */}
        <div className="rounded-2xl border border-navy-900/10 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-navy-700/50">
            1. Téléverser un fichier JSON
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-navy-900/20 bg-navy-900/[0.02] px-4 py-3 text-sm text-navy-700 transition-colors hover:border-gold-400/50 hover:bg-gold-400/5">
              <FileJson size={16} className="text-gold-600" />
              {file ? file.name : 'Choisir un fichier .json'}
              <input type="file" accept=".json,application/json" onChange={handleFileChange} className="hidden" />
            </label>
            <button
              type="button"
              onClick={handleValider}
              disabled={!file || validating || inserting}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 px-4 py-2.5 text-sm font-semibold text-navy-950 shadow-gold transition hover:from-gold-200 hover:to-gold-400 disabled:cursor-not-allowed disabled:bg-none disabled:bg-navy-900/10 disabled:text-navy-900/30 disabled:shadow-none"
            >
              {validating && <Loader2 size={15} className="animate-spin" />}
              {validating ? 'Validation en cours…' : 'Valider'}
            </button>
          </div>
          {erreurValidation && (
            <p className="mt-3 flex items-start gap-2 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
              <AlertTriangle size={14} className="mt-0.5 shrink-0" />
              {erreurValidation}
            </p>
          )}
        </div>

        {/* Étape 2 : rapport */}
        {rapport && (
          <div className="rounded-2xl border border-navy-900/10 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-navy-700/50">
                2. Rapport de validation
              </h2>
              <span
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  pret ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}
              >
                {pret ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                {pret ? "Prêt pour l'insertion" : "Non prêt pour l'insertion"}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-navy-900/[0.03] px-3 py-2.5">
                <p className="text-[11px] uppercase tracking-wide text-navy-700/40">Chunks total</p>
                <p className="mt-0.5 text-lg font-semibold text-navy-900">{rapport.nb_chunks_total ?? '—'}</p>
              </div>
              <div className="rounded-xl bg-navy-900/[0.03] px-3 py-2.5">
                <p className="text-[11px] uppercase tracking-wide text-navy-700/40">Chunks valides</p>
                <p className="mt-0.5 text-lg font-semibold text-navy-900">{rapport.nb_chunks_valides ?? '—'}</p>
              </div>
            </div>

            {resumeEntries.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-navy-700/40">Résumé par source</p>
                <div className="scroll-thin mt-2 overflow-x-auto rounded-lg border border-navy-900/[0.06]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-navy-900/[0.03] text-navy-700/50">
                      <tr>
                        <th className="px-3 py-2 font-medium">Source</th>
                        <th className="px-3 py-2 font-medium">Chunks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {resumeEntries.map(([label, valeur]) => (
                        <tr key={label} className="border-t border-navy-900/[0.06]">
                          <td className="px-3 py-2 text-navy-800">{label}</td>
                          <td className="px-3 py-2 text-navy-800">{valeur}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {erreurs.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-rose-600/70">
                  Erreurs ({erreurs.length})
                </p>
                <div className="scroll-thin mt-2 max-h-56 overflow-y-auto rounded-lg border border-rose-100">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-rose-50 text-rose-700">
                      <tr>
                        <th className="px-3 py-2 font-medium">Index</th>
                        <th className="px-3 py-2 font-medium">Article</th>
                        <th className="px-3 py-2 font-medium">Raison</th>
                      </tr>
                    </thead>
                    <tbody>
                      {erreurs.map((err, i) => (
                        <tr key={i} className="border-t border-rose-100">
                          <td className="px-3 py-2 text-navy-800">{err.index ?? '—'}</td>
                          <td className="px-3 py-2 text-navy-800">{err.article ?? '—'}</td>
                          <td className="px-3 py-2 text-navy-800">{err.raison ?? '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {doublonsInternes.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-600/80">
                  Doublons internes ({doublonsInternes.length})
                </p>
                <ul className="mt-2 space-y-1 text-xs text-navy-700">
                  {doublonsInternes.map((item, i) => (
                    <li key={i} className="rounded-lg bg-amber-50 px-3 py-1.5">
                      {decrireDoublon(item)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {doublonsEnBase.length > 0 && (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-600/80">
                  Doublons déjà en base ({doublonsEnBase.length})
                </p>
                <ul className="mt-2 space-y-1 text-xs text-navy-700">
                  {doublonsEnBase.map((item, i) => (
                    <li key={i} className="rounded-lg bg-amber-50 px-3 py-1.5">
                      {decrireDoublon(item)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setConfirmOuvert(true)}
                disabled={!pret || inserting || validating}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-gold-300 to-gold-500 px-4 py-2.5 text-sm font-semibold text-navy-950 shadow-gold transition hover:from-gold-200 hover:to-gold-400 disabled:cursor-not-allowed disabled:bg-none disabled:bg-navy-900/10 disabled:text-navy-900/30 disabled:shadow-none"
              >
                {inserting && <Loader2 size={15} className="animate-spin" />}
                {inserting ? 'Insertion en cours…' : 'Insérer en base'}
              </button>
            </div>
            {erreurInsertion && (
              <p className="mt-3 flex items-start gap-2 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                {erreurInsertion}
              </p>
            )}
          </div>
        )}

        {/* Étape 3 : résultat */}
        {resultat && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-emerald-700">
              <CheckCircle2 size={16} />
              Insertion réussie
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-emerald-700/60">Lot d&apos;ingestion</p>
                <p className="mt-0.5 break-all text-sm font-medium text-navy-900">{resultat.lot_ingestion ?? '—'}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-emerald-700/60">Date d&apos;ingestion</p>
                <p className="mt-0.5 text-sm font-medium text-navy-900">{resultat.date_ingestion ?? '—'}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-emerald-700/60">Chunks insérés</p>
                <p className="mt-0.5 text-sm font-medium text-navy-900">{resultat.nb_chunks_inseres ?? '—'}</p>
              </div>
            </div>
            {resultat.commande_annulation && (
              <div className="mt-4">
                <p className="text-[11px] uppercase tracking-wide text-emerald-700/60">Commande d&apos;annulation</p>
                <div className="mt-1.5 flex items-start gap-2 rounded-lg border border-emerald-200 bg-white px-3 py-2">
                  <code className="flex-1 whitespace-pre-wrap break-all text-xs text-navy-800">
                    {resultat.commande_annulation}
                  </code>
                  <button
                    type="button"
                    onClick={copierCommande}
                    className="flex shrink-0 items-center gap-1 rounded-lg border border-navy-900/10 px-2.5 py-1 text-xs font-medium text-navy-700 transition-colors hover:border-gold-400/40 hover:text-gold-700"
                  >
                    {commandeCopiee ? <Check size={12} /> : <Copy size={12} />}
                    {commandeCopiee ? 'Copié !' : 'Copier'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <AnimatePresence>
        {confirmOuvert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/50 px-4 backdrop-blur-sm"
            onClick={() => setConfirmOuvert(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-sm rounded-2xl border border-navy-900/10 bg-white p-5 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                <AlertTriangle size={16} className="text-gold-600" />
                Confirmer l&apos;insertion
              </h3>
              <p className="mt-2.5 text-sm text-navy-700">
                Cette action écrit définitivement les documents en base et consomme des crédits OpenAI. Voulez-vous
                continuer ?
              </p>
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmOuvert(false)}
                  className="rounded-lg px-3.5 py-2 text-sm font-medium text-navy-700/60 transition-colors hover:bg-navy-900/5 hover:text-navy-900"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={confirmerInsertion}
                  className="rounded-lg bg-gradient-to-br from-gold-300 to-gold-500 px-3.5 py-2 text-sm font-semibold text-navy-950 shadow-gold transition hover:from-gold-200 hover:to-gold-400"
                >
                  Confirmer l&apos;insertion
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
