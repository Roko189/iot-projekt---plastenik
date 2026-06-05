interface Props {
  icon: string
  label: string
  value: string | null
  unit: string
  color: string
  subtitle?: string
}

export default function SensorCard({ icon, label, value, unit, color, subtitle }: Props) {
  return (
    <div className={`bg-white rounded-2xl shadow-md p-6 border-l-4 ${color}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl">{icon}</span>
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
      </div>
      <div className="mt-3">
        {value !== null ? (
          <span className="text-4xl font-bold text-gray-800">
            {value}
            <span className="text-xl font-normal text-gray-500 ml-1">{unit}</span>
          </span>
        ) : (
          <span className="text-2xl text-gray-300">—</span>
        )}
      </div>
      {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
    </div>
  )
}
