import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  MessagesSquare,
  ShieldCheck,
  Languages,
  Clock,
  ScrollText,
  Sparkles,
  CheckCircle2,
  PlayCircle,
} from 'lucide-react'
import SectionHeading from '../components/SectionHeading.jsx'
import ArticleOfDay from '../components/ArticleOfDay.jsx'
import { legalCodes } from '../data/legalCodes.js'
import Reveal, { RevealGroup, RevealItem } from '../components/motion/Reveal.jsx'
import SpotlightCard from '../components/motion/SpotlightCard.jsx'
import Magnetic from '../components/motion/Magnetic.jsx'
import CountUp from '../components/motion/CountUp.jsx'
import AuroraBackground from '../components/motion/AuroraBackground.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

const featureIcons = [MessagesSquare, ScrollText, Languages, Clock, ShieldCheck, Sparkles]

const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
}
const heroItem = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

export default function Home() {
  const { lang, t } = useLanguage()
  const home = t.home

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950">
        <div className="absolute inset-0 bg-justice-hero bg-cover bg-[center_20%]" />
        <AuroraBackground />
        <motion.div
          variants={heroContainer}
          initial="hidden"
          animate="show"
          className="relative mx-auto flex max-w-7xl flex-col items-center px-5 pb-24 pt-20 text-center sm:px-8 sm:pb-32 sm:pt-28"
        >
          <motion.div
            variants={heroItem}
            className="inline-flex items-center gap-2 rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold-300"
          >
            <motion.span
              animate={{ rotate: [0, 15, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles size={14} />
            </motion.span>
            {home.heroEyebrow}
          </motion.div>

          <motion.h1
            variants={heroItem}
            className="mt-8 max-w-4xl font-display text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-6xl"
          >
            <span className="text-gradient-animated">{home.heroTitleGradient}</span> {home.heroTitleRest}
          </motion.h1>

          <motion.p
            variants={heroItem}
            className="mt-6 max-w-2xl text-lg leading-relaxed text-cream-100/75 sm:text-xl"
          >
            {home.heroParagraph}
          </motion.p>

          <motion.div variants={heroItem} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Magnetic>
              <Link
                to="/inscription"
                className="group inline-flex items-center gap-2 rounded-full bg-gold-400 px-7 py-3.5 text-sm font-semibold text-navy-950 shadow-gold transition hover:bg-gold-300"
              >
                {home.startFree}
                <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.25}>
              <Link
                to="/halex-chat"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:border-gold-400/40 hover:text-gold-300"
              >
                <PlayCircle size={18} />
                {home.seeDemo}
              </Link>
            </Magnetic>
          </motion.div>

          <motion.div
            variants={heroItem}
            className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-6 border-t border-white/10 pt-10 sm:grid-cols-4"
          >
            {home.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl font-bold text-white sm:text-3xl">
                  <CountUp value={stat.value} />
                </div>
                <div className="mt-1 text-xs text-cream-100/50 sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Article du jour */}
      <section className="relative overflow-hidden bg-navy-950 px-5 pb-24 sm:px-8">
        <Reveal direction="scale" className="mx-auto max-w-4xl">
          <ArticleOfDay />
        </Reveal>
      </section>

      {/* Features preview */}
      <section className="bg-cream-50 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              eyebrow={home.featuresEyebrow}
              title={home.featuresTitle}
              subtitle={home.featuresSubtitle}
            />
          </Reveal>

          <RevealGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
            {home.features.map((feature, i) => {
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

          <div className="mt-12 text-center">
            <Link
              to="/fonctionnalites"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-gold-600"
            >
              {home.seeAllFeatures}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="relative overflow-hidden bg-navy-900 px-5 py-24 sm:px-8">
        <div className="absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <SectionHeading eyebrow={home.howItWorksEyebrow} title={home.howItWorksTitle} light />
          </Reveal>

          <RevealGroup className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3" stagger={0.15}>
            {home.steps.map((step, i) => (
              <RevealItem key={step.number} className="relative">
                <div className="font-display text-6xl font-black text-white/10">{step.number}</div>
                <h3 className="-mt-6 font-display text-xl font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream-100/60">{step.description}</p>
                {i < home.steps.length - 1 && (
                  <motion.div
                    className="absolute right-[-1.25rem] top-3 hidden text-gold-400/40 md:block"
                    animate={{ x: [0, 6, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ArrowRight size={24} />
                  </motion.div>
                )}
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-16 text-center" delay={0.1}>
            <Magnetic>
              <Link
                to="/inscription"
                className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-7 py-3.5 text-sm font-semibold text-navy-950 shadow-gold transition hover:bg-gold-300"
              >
                {home.tryFree}
                <ArrowRight size={18} />
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>

      {/* Documents preview */}
      <section className="bg-cream-50 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionHeading
              eyebrow={home.libraryEyebrow}
              title={home.libraryTitle}
              subtitle={home.librarySubtitle}
            />
          </Reveal>

          <RevealGroup className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
            {legalCodes.map((code) => (
              <RevealItem key={code.id}>
                <SpotlightCard className="h-full rounded-2xl border border-navy-900/5 bg-white p-6 shadow-card">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold text-navy-900">
                      {lang === 'fr' ? code.nameFr : code.name}
                    </h3>
                    <span className="rounded-full bg-gold-50 px-2.5 py-1 text-xs font-semibold text-gold-600">
                      {code.articles} {home.articlesSuffix}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-navy-700/70">
                    {lang === 'fr' ? code.descriptionFr : code.description}
                  </p>
                </SpotlightCard>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="mt-12 text-center">
            <Link
              to="/documents"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-gold-600"
            >
              {home.exploreLibrary}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="relative overflow-hidden bg-navy-950 px-5 py-24 sm:px-8">
        <AuroraBackground />
        <div className="relative mx-auto max-w-5xl">
          <Reveal>
            <SectionHeading eyebrow={home.pricingEyebrow} title={home.pricingTitle} light />
          </Reveal>

          <RevealGroup className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3" stagger={0.1}>
            {home.pricingPlans.map((plan, i) => (
              <RevealItem key={plan.name} direction="scale" className="relative h-full">
                {i === 1 && (
                  <div className="animate-pulse-glow absolute -inset-2 rounded-3xl bg-gold-400/20 blur-xl" />
                )}
                <SpotlightCard
                  dark
                  className={`relative h-full rounded-2xl border p-7 ${
                    i === 1
                      ? 'border-gold-400/40 bg-navy-950 shadow-gold'
                      : 'border-white/10 bg-white/[0.03]'
                  }`}
                >
                  <h3 className="font-display text-lg font-bold text-white">{plan.name}</h3>
                  <p className="mt-2 font-display text-3xl font-bold text-gold-300">{plan.price}</p>
                  <ul className="mt-5 space-y-2.5">
                    {plan.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-cream-100/70">
                        <CheckCircle2 size={15} className="text-gold-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </SpotlightCard>
              </RevealItem>
            ))}
          </RevealGroup>

          <div className="mt-12 text-center">
            <Link
              to="/tarifs"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-gold-300 hover:text-gold-200"
            >
              {home.seePricing}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />

            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
