import { useEffect, useState } from 'react'
import type { Cadence } from '../context/DeskContext'

export const CADENCE_MINUTES: Record<Cadence, number> = {
  '15m': 15,
  '1h': 60,
  '4h': 240,
  '1d': 1440,
}

export const CADENCE_LABELS: Record<Cadence, string> = {
  '15m': 'Every 15 min',
  '1h': 'Every hour',
  '4h': 'Every 4 hours',
  '1d': 'Every day',
}

export const CADENCE_SHORT: Record<Cadence, string> = {
  '15m': '15 min',
  '1h': '1 hour',
  '4h': '4 hours',
  '1d': 'Daily',
}

function nextScanAt(cadence: Cadence, now = Date.now()): number {
  const interval = CADENCE_MINUTES[cadence] * 60_000
  return Math.ceil((now + 1_000) / interval) * interval
}

export function secondsToNextScan(cadence: Cadence, now = Date.now()): number {
  return Math.max(0, Math.floor((nextScanAt(cadence, now) - now) / 1_000))
}

export function nextScanClock(cadence: Cadence, now = Date.now()): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(nextScanAt(cadence, now)))
}

export function formatCountdown(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3_600)
  const minutes = Math.floor((totalSeconds % 3_600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function useNextScanCountdown(cadence: Cadence): number {
  const [seconds, setSeconds] = useState(() => secondsToNextScan(cadence))

  useEffect(() => {
    const update = () => setSeconds(secondsToNextScan(cadence))
    update()
    const id = window.setInterval(update, 1_000)
    return () => window.clearInterval(id)
  }, [cadence])

  return seconds
}
