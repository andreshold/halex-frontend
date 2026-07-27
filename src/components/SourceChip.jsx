import { FileText } from 'lucide-react'

export default function SourceChip({ article, source, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-full border border-navy-900/10 bg-navy-900/[0.02] px-2.5 py-1.5 text-xs text-navy-700 transition-colors hover:border-gold-400/40 hover:bg-gold-400/5 hover:text-gold-700"
    >
      <FileText size={12} className="shrink-0 text-gold-600/70" />
      <span className="font-mono text-[11px]">
        {article} — {source}
      </span>
    </button>
  )
}
