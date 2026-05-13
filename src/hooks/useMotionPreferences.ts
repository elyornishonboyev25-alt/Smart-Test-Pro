import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

type NavigatorWithDeviceMemory = Navigator & {
  deviceMemory?: number
}

export function useMotionPreferences() {
  const prefersReducedMotion = useReducedMotion()
  const [isLowPowerDevice, setIsLowPowerDevice] = useState(false)
  const [isCoarsePointer, setIsCoarsePointer] = useState(false)

  useEffect(() => {
    const nav = navigator as NavigatorWithDeviceMemory
    const deviceMemory = nav.deviceMemory ?? 8
    const cpuCores = navigator.hardwareConcurrency ?? 8
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches
    const compactViewport = window.matchMedia('(max-width: 900px)').matches

    setIsCoarsePointer(coarsePointer)
    setIsLowPowerDevice(deviceMemory <= 4 || cpuCores <= 4 || (coarsePointer && compactViewport))
  }, [])

  const reducedMotion = Boolean(prefersReducedMotion)
  const minimalMotion = reducedMotion || isLowPowerDevice
  const allowHoverMotion = !minimalMotion && !isCoarsePointer

  return {
    reducedMotion,
    isLowPowerDevice,
    minimalMotion,
    allowHoverMotion,
  }
}

