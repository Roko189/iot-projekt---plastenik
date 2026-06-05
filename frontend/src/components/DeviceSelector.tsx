import type { Device } from '../types'

interface Props {
  devices: Device[]
  selected: string | null
  onSelect: (id: string) => void
}

export default function DeviceSelector({ devices, selected, onSelect }: Props) {
  if (devices.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
        Nema pronađenih uređaja za ovaj korisnik.
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {devices.map((d) => (
        <button
          key={d.id.id}
          onClick={() => onSelect(d.id.id)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
            selected === d.id.id
              ? 'bg-greenhouse-600 text-white shadow'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-greenhouse-400'
          }`}
        >
          🌱 {d.label || d.name}
        </button>
      ))}
    </div>
  )
}
