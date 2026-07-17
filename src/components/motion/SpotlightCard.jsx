import { useRef } from 'react'
import { motion } from 'framer-motion'

export default function SpotlightCard({
  children,
  className = '',
  dark = false,
  tilt = true,
  lift = true,
  as: Tag = 'div',
  ...rest
}) {
  const ref = useRef(null)

  function handleMouseMove(e) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--x', `${x}%`)
    el.style.setProperty('--y', `${y}%`)

    if (tilt) {
      const rx = ((y - 50) / 50) * -6
      const ry = ((x - 50) / 50) * 6
      el.style.setProperty('--rx', `${rx}deg`)
      el.style.setProperty('--ry', `${ry}deg`)
    }
  }

  function handleMouseLeave() {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  const MotionTag = motion[Tag] || motion.div

  return (
    <MotionTag
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={lift ? { y: -6 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className={`spotlight-card ${dark ? 'spotlight-card--dark' : ''} ${className}`}
      style={{
        transform: tilt ? 'perspective(800px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))' : undefined,
        transformStyle: 'preserve-3d',
      }}
      {...rest}
    >
      <div style={{ position: 'relative', zIndex: 2 }}>{children}</div>
    </MotionTag>
  )
}
