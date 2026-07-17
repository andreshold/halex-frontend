import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  MessagesSquare,
  ScrollText,
  Languages,
  Clock,
  ShieldCheck,
  Sparkles,
  Search,
  FileSearch,
  Users,
  ArrowRight,
} from 'lucide-react'
import SectionHeading from '../components/SectionHeading.jsx'
import Reveal, { RevealGroup, RevealItem } from '../components/motion/Reveal.jsx'
import SpotlightCard from '../components/motion/SpotlightCard.jsx'
import Magnetic from '../components/motion/Magnetic.jsx'
import AuroraBackground from '../components/motion/AuroraBackground.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

const featureIcons = [
  MessagesSquare,
  FileSearch,
  ScrollText,
  Languages,
  Clock,
  ShieldCheck,
  Search,
  Users,
  Sparkles,
]

export default function Features() {
  const { t } = useLanguage()
  const f = t.features

  return (
    <div>
      <section className="relative overflow-hidden bg-navy-950 px-5 py-20 sm:px-8">
        <AuroraBackground />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-4xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-300">
            {f.eyebrow}
          </span>
          <h1 className="mt-6 font-display text-4xl font-extrabold text-white sm:text-5xl">
            {f.titleStart} <span className="text-gradient-animated">{f.titleGradient}</span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-cream-100/70">{f.paragraph}</p>
        </motion.div>
      </section>

      <section className="bg-cream-50 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
            {f.list.map((feature, i) => {
              const Icon = featureIcons[i]
              return (
                <RevealItem key={feature.title}>
                  <SpotlightCard className="group h-full rounded-2xl border border-navy-900/5 bg-white p-7 shadow-card">
                    <motion.div
                      whileHover={{ rotate: -6, scale: 1.08 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                      className="inline-flex rounded-xl bg-navy-950 p-3 text-gold-400 transition-colors group-hover:bg-gold-400 group-hover:text-navy-950"
                    >
                      <Icon size={22} />
                    </motion.div>
                    <h3 className="mt-5 font-display text-lg font-bold text-navy-900">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-navy-700/70">
                      {feature.description}
                    </p>
                  </SpotlightCard>
                </RevealItem>
              )
            })}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-navy-900 px-5 py-20 sm:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <SectionHeading eyebrow={f.ctaEyebrow} title={f.ctaTitle} light />
          </Reveal>
          <Reveal delay={0.1} className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Magnetic>
              <Link
                to="/inscription"
                className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-7 py-3.5 text-sm font-semibold text-navy-950 shadow-gold transition hover:bg-gold-300"
              >
                {f.startFree}
                <ArrowRight size={18} />
              </Link>
            </Magnetic>
            <Link
              to="/tarifs"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition hover:border-gold-400/40 hover:text-gold-300"
            >
              {f.seePricing}
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
