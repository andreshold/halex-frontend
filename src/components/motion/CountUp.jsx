import { useEffect, useRef, useState } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

// Animates the leading numeric portion of a label (e.g. "4,202" / "24/7" / "100%")
// while preserving any non-numeric prefix/suffix as static text.
export default function CountUp({ value, className = '' }) {
  const match = String(value).match(/^(\D*)([\d,]+)(.*)$/)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.6 })
  const [display, setDisplay] = useState(match ? '0' : value)

  const target = match ? Number(match[2].replace(/,/g, '')) : 0
  const motionVal = useMotionValue(0)
  const spring = useSpring(motionVal, { stiffness: 90, damping: 20, mass: 1 })

  useEffect(() => {
    if (inView && match) motionVal.set(target)
  }, [inView])

  useEffect(() => {
    if (!match) return
    const unsub = spring.on('change', (v) => {
      setDisplay(Math.round(v).toLocaleString('en-US'))
    })
    return unsub
  }, [spring, match])

  if (!match) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    )
  }

  return (
    <span ref={ref} className={className}>
      {match[1]}
      {display}
      {match[3]}
    </span>
  )
}
