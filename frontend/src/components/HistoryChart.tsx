import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { format } from 'date-fns'
import { hr } from 'date-fns/locale'
import type { HistoryTelemetry, TimeRange } from '../types'

interface ChartPoint {
  ts: number
  temperature?: number
  humidity?: number
  illuminance?: number
}

function buildChartData(data: HistoryTelemetry): ChartPoint[] {
  const map = new Map<number, ChartPoint>()

  const add = (key: keyof HistoryTelemetry, points: { ts: number; value: string }[]) => {
    for (const p of points) {
      const existing = map.get(p.ts) ?? { ts: p.ts }
      existing[key] = parseFloat(p.value)
      map.set(p.ts, existing)
    }
  }

  if (data.temperature) add('temperature', data.temperature)
  if (data.humidity) add('humidity', data.humidity)
  if (data.illuminance) add('illuminance', data.illuminance)

  return Array.from(map.values()).sort((a, b) => a.ts - b.ts)
}

const DATE_FORMAT: Record<TimeRange, string> = {
  '1h':  'HH:mm',
  '6h':  'HH:mm',
  '24h': 'HH:mm',
  '7d':  'dd.MM',
  '30d': 'dd.MM',
}

interface Props {
  data: HistoryTelemetry | null
  loading: boolean
  range: TimeRange
}

export default function HistoryChart({ data, loading, range }: Props) {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 flex items-center justify-center h-72">
        <span className="text-gray-400 animate-pulse">Učitavanje podataka…</span>
      </div>
    )
  }

  if (!data) return null

  const chartData = buildChartData(data)
  const fmt = DATE_FORMAT[range]

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Povijest podataka</h2>

      {data.temperature || data.humidity ? (
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Temperatura & vlaga</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="ts"
                tickFormatter={(ts) => format(ts, fmt, { locale: hr })}
                tick={{ fontSize: 11 }}
              />
              <YAxis yAxisId="temp" tick={{ fontSize: 11 }} unit="°C" />
              <YAxis yAxisId="hum" orientation="right" tick={{ fontSize: 11 }} unit="%" />
              <Tooltip
                labelFormatter={(ts) => format(Number(ts), 'dd.MM.yyyy HH:mm', { locale: hr })}
                formatter={(v: number, name: string) => [
                  `${v.toFixed(1)} ${name === 'Temperatura' ? '°C' : '%'}`,
                  name,
                ]}
              />
              <Legend />
              {data.temperature && (
                <Line
                  yAxisId="temp"
                  type="monotone"
                  dataKey="temperature"
                  name="Temperatura"
                  stroke="#ef4444"
                  dot={false}
                  strokeWidth={2}
                />
              )}
              {data.humidity && (
                <Line
                  yAxisId="hum"
                  type="monotone"
                  dataKey="humidity"
                  name="Vlaga"
                  stroke="#3b82f6"
                  dot={false}
                  strokeWidth={2}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : null}

      {data.illuminance ? (
        <div>
          <p className="text-sm text-gray-500 mb-2">Osvjetljenje</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="ts"
                tickFormatter={(ts) => format(ts, fmt, { locale: hr })}
                tick={{ fontSize: 11 }}
              />
              <YAxis tick={{ fontSize: 11 }} unit=" lx" />
              <Tooltip
                labelFormatter={(ts) => format(Number(ts), 'dd.MM.yyyy HH:mm', { locale: hr })}
                formatter={(v: number) => [`${v.toFixed(0)} lx`, 'Osvjetljenje']}
              />
              <Line
                type="monotone"
                dataKey="illuminance"
                name="Osvjetljenje"
                stroke="#f59e0b"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : null}

      {!data.temperature && !data.humidity && !data.illuminance && (
        <p className="text-gray-400 text-center py-10">Nema podataka za odabrani period</p>
      )}
    </div>
  )
}
