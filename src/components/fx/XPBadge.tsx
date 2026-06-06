import { Zap } from 'lucide-react'
import CountUp from './CountUp'

interface XPBadgeProps {
  amount: number
  className?: string
  animate?: boolean
}

/** Gold XP reward chip used on tests, achievements and rewards. */
export default function XPBadge({ amount, className = '', animate = true }: XPBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 ${className}`}>
      <Zap className="h-3 w-3 fill-amber-400 text-amber-500" />
      {animate ? <CountUp value={amount} /> : amount}
      <span>XP</span>
    </span>
  )
}
