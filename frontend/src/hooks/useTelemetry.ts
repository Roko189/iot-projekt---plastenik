import { useState, useEffect, useCallback } from 'react'
import { telemetryApi } from '../api/client'
import type { LatestTelemetry, HistoryTelemetry, TimeRange } from '../types'

const TIME_RANGES: Record<TimeRange, { ms: number; interval: number; label: string }> = {
  '1h':  { ms: 3_600_000,   interval: 60_000,    label: 'Zadnji sat' },
  '6h':  { ms: 21_600_000,  interval: 300_000,   label: 'Zadnjih 6h' },
  '24h': { ms: 86_400_000,  interval: 3_600_000, label: 'Zadnja 24h' },
  '7d':  { ms: 604_800_000, interval: 86_400_000, label: 'Zadnjih 7 dana' },
  '30d': { ms: 2_592_000_000, interval: 86_400_000, label: 'Zadnjih 30 dana' },
}

export function useTimeRanges() {
  return TIME_RANGES
}

export function useLatestTelemetry(deviceId: string | null, refreshMs = 10_000) {
  const [data, setData] = useState<LatestTelemetry | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    if (!deviceId) return
    setLoading(true)
    try {
      const res = await telemetryApi.latest(deviceId)
      setData(res.data)
      setError(null)
    } catch {
      setError('Greška pri dohvaćanju podataka')
    } finally {
      setLoading(false)
    }
  }, [deviceId])

  useEffect(() => {
    fetch()
    const id = setInterval(fetch, refreshMs)
    return () => clearInterval(id)
  }, [fetch, refreshMs])

  return { data, loading, error, refresh: fetch }
}

export function useHistoryTelemetry(deviceId: string | null, range: TimeRange) {
  const [data, setData] = useState<HistoryTelemetry | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!deviceId) return
    setLoading(true)
    const now = Date.now()
    const { ms, interval } = TIME_RANGES[range]
    telemetryApi
      .history(deviceId, now - ms, now, interval)
      .then((res) => {
        setData(res.data)
        setError(null)
      })
      .catch(() => setError('Greška pri dohvaćanju povijesti'))
      .finally(() => setLoading(false))
  }, [deviceId, range])

  return { data, loading, error }
}
