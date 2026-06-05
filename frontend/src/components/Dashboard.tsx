import { useEffect, useState } from 'react'
import { devicesApi } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { useLatestTelemetry, useHistoryTelemetry, useTimeRanges } from '../hooks/useTelemetry'
import SensorCard from './SensorCard'
import HistoryChart from './HistoryChart'
import DeviceSelector from './DeviceSelector'
import type { Device, TimeRange } from '../types'
import { format } from 'date-fns'
import { hr } from 'date-fns/locale'

function extractValue(points?: { ts: number; value: string }[]): string | null {
  if (!points || points.length === 0) return null
  return parseFloat(points[0].value).toFixed(1)
}

export default function Dashboard() {
  const { auth, logout } = useAuth()
  const [devices, setDevices] = useState<Device[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [devicesLoading, setDevicesLoading] = useState(true)
  const [range, setRange] = useState<TimeRange>('24h')
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const timeRanges = useTimeRanges()

  useEffect(() => {
    devicesApi
      .list()
      .then((res) => {
        const list: Device[] = res.data?.data ?? []
        setDevices(list)
        if (list.length > 0) setSelectedId(list[0].id.id)
      })
      .finally(() => setDevicesLoading(false))
  }, [])

  const { data: latest, loading: latestLoading, refresh } = useLatestTelemetry(selectedId)
  const { data: history, loading: historyLoading } = useHistoryTelemetry(selectedId, range)

  useEffect(() => {
    if (latest) setLastUpdate(new Date())
  }, [latest])

  const user = auth?.user
  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : user?.email ?? 'Korisnik'

  const temp = extractValue(latest?.temperature)
  const hum = extractValue(latest?.humidity)
  const lux = extractValue(latest?.illuminance)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-greenhouse-700 text-white px-6 py-4 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌿</span>
            <div>
              <h1 className="font-bold text-lg leading-tight">Greenhouse Monitor</h1>
              <p className="text-greenhouse-200 text-xs">Dobrodošli, {displayName}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdate && (
              <span className="text-greenhouse-200 text-xs hidden sm:block">
                Zadnje: {format(lastUpdate, 'HH:mm:ss', { locale: hr })}
              </span>
            )}
            <button
              onClick={refresh}
              className="text-greenhouse-200 hover:text-white text-sm transition-colors"
              title="Osvježi"
            >
              ↻
            </button>
            <button
              onClick={logout}
              className="bg-greenhouse-600 hover:bg-greenhouse-500 px-3 py-1.5 rounded-lg text-sm transition-colors"
            >
              Odjava
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <section>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Odaberi plastenik
          </h2>
          {devicesLoading ? (
            <p className="text-gray-400 text-sm animate-pulse">Učitavanje uređaja…</p>
          ) : (
            <DeviceSelector
              devices={devices}
              selected={selectedId}
              onSelect={setSelectedId}
            />
          )}
        </section>

        {selectedId && (
          <>
            <section>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Trenutno stanje
                {latestLoading && (
                  <span className="ml-2 text-xs text-gray-300 font-normal animate-pulse">
                    osvježavanje…
                  </span>
                )}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SensorCard
                  icon="🌡️"
                  label="Temperatura"
                  value={temp}
                  unit="°C"
                  color="border-red-400"
                  subtitle={temp ? getTemperatureStatus(parseFloat(temp)) : undefined}
                />
                <SensorCard
                  icon="💧"
                  label="Vlaga zraka"
                  value={hum}
                  unit="%"
                  color="border-blue-400"
                  subtitle={hum ? getHumidityStatus(parseFloat(hum)) : undefined}
                />
                <SensorCard
                  icon="☀️"
                  label="Osvjetljenje"
                  value={lux}
                  unit="lx"
                  color="border-yellow-400"
                  subtitle={lux ? getLightStatus(parseFloat(lux)) : undefined}
                />
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Povijesni podaci
                </h2>
                <div className="flex gap-2">
                  {(Object.keys(timeRanges) as TimeRange[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => setRange(r)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        range === r
                          ? 'bg-greenhouse-600 text-white'
                          : 'bg-white text-gray-600 border border-gray-200 hover:border-greenhouse-400'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <HistoryChart data={history} loading={historyLoading} range={range} />
            </section>
          </>
        )}
      </main>
    </div>
  )
}

function getTemperatureStatus(t: number): string {
  if (t < 10) return 'Prehladno za biljke'
  if (t < 18) return 'Hladno — pazi na osjetljive biljke'
  if (t <= 28) return 'Optimalni uvjeti'
  if (t <= 35) return 'Toplo — pojačaj ventilaciju'
  return 'Previsoka temperatura!'
}

function getHumidityStatus(h: number): string {
  if (h < 40) return 'Prenisko — rizik od sušenja'
  if (h <= 70) return 'Optimalna vlaga'
  if (h <= 85) return 'Visoka vlaga — pazi na gljivice'
  return 'Kritično visoka vlaga!'
}

function getLightStatus(lux: number): string {
  if (lux < 1000) return 'Slabo osvjetljenje'
  if (lux < 10000) return 'Umjereno osvjetljenje'
  if (lux < 50000) return 'Dobro osvjetljenje'
  return 'Jako sunčevo svjetlo'
}
