import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, ChevronDown } from 'lucide-react'
import Reveal, { RevealGroup, RevealItem } from '../components/motion/Reveal.jsx'
import SpotlightCard from '../components/motion/SpotlightCard.jsx'
import Magnetic from '../components/motion/Magnetic.jsx'
import AuroraBackground from '../components/motion/AuroraBackground.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

function FaqItem({ faq, isOpen, onToggle }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-white"
      >
        {faq.q}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0 text-gold-400"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-cream-100/70">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Pricing() {
  const { t } = useLanguage()
  const p = t.pricing
  const [openFaq, setOpenFaq] = useState(0)

  return (
    <div>
      <section className="relative overflow-hidden bg-navy-950 px-5 py-20 sm:px-8">
        <AuroraBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-300">
            {p.eyebrow}
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold text-white sm:text-5xl">
            {p.titleStart} <span className="text-gradient-animated">{p.titleGradient}</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-cream-100/70">{p.paragraph}</p>
        </motion.div>
      </section>

      <section className="bg-cream-50 px-5 py-20 sm:px-8">
        <RevealGroup className="mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3" stagger={0.1}>
          {p.plans.map((plan, i) => {
            const highlight = i === 1
            return (
              <RevealItem key={plan.name} direction="scale" className={`relative ${highlight ? 'lg:-translate-y-4' : ''}`}>
                {highlight && (
                  <div className="animate-pulse-glow absolute -inset-2 rounded-[2rem] bg-gold-400/25 blur-xl" />
                )}
                <SpotlightCard
                  dark={highlight}
                  lift={!highlight}
                  className={`relative flex h-full flex-col rounded-3xl border p-8 ${
                    highlight ? 'border-gold-400 bg-navy-950 shadow-2xl' : 'border-navy-900/10 bg-white shadow-card'
                  }`}
                >
                  {highlight && (
                    <motion.span
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-400 px-4 py-1 text-xs font-bold uppercase tracking-wide text-navy-950"
                    >
                      {p.mostPopular}
                    </motion.span>
                  )}
                  <h3
                    className={`font-display text-xl font-bold ${highlight ? 'text-white' : 'text-navy-900'}`}
                  >
                    {plan.name}
                  </h3>
                  <p className={`mt-2 text-sm ${highlight ? 'text-cream-100/60' : 'text-navy-700/60'}`}>
                    {plan.description}
                  </p>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span
                      className={`font-display text-4xl font-bold ${highlight ? 'text-gold-300' : 'text-navy-900'}`}
                    >
                      {plan.price}
                    </span>
                    <span className={`text-sm ${highlight ? 'text-cream-100/50' : 'text-navy-700/50'}`}>
                      {plan.period}
                    </span>
                  </div>

                  <Magnetic strength={0.2} fullWidth className="mt-7">
                    <Link
                      to="/inscription"
                      className={`inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${
                        highlight
                          ? 'bg-gold-400 text-navy-950 shadow-gold hover:bg-gold-300'
                          : 'border border-navy-900/15 text-navy-900 hover:border-gold-400 hover:text-gold-600'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  </Magnetic>

                  <ul className="mt-8 space-y-3.5">
                    {plan.features.map((f) => (
                      <li
                        key={f.label}
                        className={`flex items-start gap-2.5 text-sm ${
                          f.included
                            ? highlight
                              ? 'text-cream-100/80'
                              : 'text-navy-700/80'
                            : highlight
                              ? 'text-cream-100/30'
                              : 'text-navy-700/30'
                        }`}
                      >
                        {f.included ? (
                          <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-gold-400" />
                        ) : (
                          <XCircle size={16} className="mt-0.5 shrink-0" />
                        )}
                        {f.label}
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </RevealItem>
            )
          })}
        </RevealGroup>
      </section>

      <section className="bg-navy-900 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="text-center font-display text-3xl font-bold text-white">{p.faqTitle}</h2>
          </Reveal>
          <RevealGroup className="mt-10 space-y-4" stagger={0.06}>
            {p.faqs.map((faq, i) => (
              <RevealItem key={faq.q}>
                <FaqItem
                  faq={faq}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? -1 : i)}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>
    </div>
  )
}
