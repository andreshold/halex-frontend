export default function SectionHeading({ eyebrow, title, subtitle, center = true, light = false }) {
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${
            light
              ? 'border-gold-400/30 bg-gold-400/10 text-gold-300'
              : 'border-gold-500/20 bg-gold-50 text-gold-600'
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`mt-4 font-display text-3xl font-bold sm:text-4xl ${
          light ? 'text-white' : 'text-navy-900'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base leading-relaxed sm:text-lg ${light ? 'text-cream-100/70' : 'text-navy-700/70'}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
