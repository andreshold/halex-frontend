import { motion } from 'framer-motion'

// Decorative animated backdrop for dark sections: soft gradient orbs + a faint
// scanning grid, layered under content (pointer-events disabled).
export default function AuroraBackground({ className = '' }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <motion.div
        className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-gold-400/20 blur-3xl"
        animate={{ x: [0, 40, -20, 0], y: [0, -30, 20, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-gold-300/10 blur-3xl"
        animate={{ x: [0, -30, 20, 0], y: [0, 30, -15, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-navy-500/20 blur-3xl"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
