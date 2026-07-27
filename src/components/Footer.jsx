import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Scale, MessageCircle, Mail, ShieldCheck } from 'lucide-react'
import Logo from './Logo.jsx'
import Reveal from './motion/Reveal.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

function FooterLink({ to, href, children }) {
  const Component = to ? Link : 'a'
  return (
    <Component
      to={to}
      href={href || '#'}
      className="group inline-flex items-center gap-1 transition-colors hover:text-gold-300"
    >
      <span className="relative">
        {children}
        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold-300 transition-all duration-300 group-hover:w-full" />
      </span>
    </Component>
  )
}

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="border-t border-white/5 bg-navy-950 text-cream-100/70">
      <Reveal className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14" amount={0.1}>
        <div className="grid grid-cols-2 gap-8 gap-y-10 sm:gap-10 lg:grid-cols-5">
          <div className="col-span-full sm:col-span-2">
            <motion.div whileHover={{ scale: 1.03 }} className="inline-block">
              <Logo />
            </motion.div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">{t.footer.tagline}</p>
            <p className="mt-4 font-display text-sm italic text-gold-300/90">
              &ldquo;{t.footer.quote}&rdquo;
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cream-50">
              {t.footer.productHeading}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><FooterLink to="/fonctionnalites">{t.footer.features}</FooterLink></li>
              <li><FooterLink to="/documents">{t.footer.legalLibrary}</FooterLink></li>
              <li><FooterLink to="/tarifs">{t.footer.pricing}</FooterLink></li>
              <li><FooterLink to="/halex-chat">{t.footer.legalChat}</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cream-50">
              {t.footer.resourcesHeading}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><FooterLink to="/article-du-jour">{t.footer.articleOfDay}</FooterLink></li>
              <li><FooterLink href="#">{t.footer.legalBlog}</FooterLink></li>
              <li><FooterLink href="#">{t.footer.discordCommunity}</FooterLink></li>
              <li><FooterLink href="#">{t.footer.careers}</FooterLink></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-cream-50">
              {t.footer.supportHeading}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2"><Mail size={14} /> sipò@halex.ai</li>
              <li className="flex items-center gap-2"><MessageCircle size={14} /> {t.footer.liveChat}</li>
              <li className="flex items-center gap-2"><ShieldCheck size={14} /> {t.footer.privacy}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-cream-100/50 sm:flex-row">
          <p className="flex items-center gap-2">
            <Scale size={14} className="text-gold-400" />
            &copy; {new Date().getFullYear()} Halex AI. {t.footer.rightsReserved}
          </p>
          <div className="flex gap-6">
            <FooterLink href="#">{t.footer.terms}</FooterLink>
            <FooterLink href="#">{t.footer.privacy}</FooterLink>
            <FooterLink href="#">{t.footer.contact}</FooterLink>
          </div>
        </div>
      </Reveal>
    </footer>
  )
}
