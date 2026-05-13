import { useEffect } from 'react'
import { ClockIcon } from '@heroicons/react/24/outline'

interface TimerProps {
    duration: number // in seconds
    timeLeft: number
    setTimeLeft: (time: number) => void
    onTimeUp?: () => void
    isActive: boolean
    showWarning?: boolean // Show red color when time is low
    variant?: 'default' | 'readingCompact'
}

export default function Timer({
    timeLeft,
    setTimeLeft,
    onTimeUp,
    isActive,
    showWarning = true,
    variant = 'default',
}: TimerProps) {

    useEffect(() => {
        if (!isActive || timeLeft <= 0) return

        const timer = setInterval(() => {
            const newTime = timeLeft - 1
            setTimeLeft(newTime)
            if (newTime <= 0) {
                clearInterval(timer)
                onTimeUp?.()
            }
        }, 1000)

        return () => clearInterval(timer)
    }, [isActive, timeLeft, setTimeLeft, onTimeUp])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const isLowTime = showWarning && timeLeft > 0 && timeLeft < 300 // Less than 5 mins

    if (variant === 'readingCompact') {
        return (
            <span className={`font-mono text-base font-semibold tracking-[0.08em] ${isLowTime ? 'text-red-600' : 'text-slate-700'}`}>
                {timeLeft === -1 ? 'Unlimited' : formatTime(timeLeft)}
            </span>
        )
    }

    return (
        <div className={`
      flex items-center space-x-2 px-4 py-2 rounded-lg font-mono font-semibold transition-colors
      ${isLowTime
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }
    `}>
            <ClockIcon className="h-5 w-5" />
            <span className="text-lg">
                {timeLeft === -1 ? 'Unlimited' : formatTime(timeLeft)}
            </span>
        </div>
    )
}

