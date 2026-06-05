export interface User {
  id: { id: string }
  email: string
  firstName: string
  lastName: string
  authority: 'TENANT_ADMIN' | 'CUSTOMER_USER' | 'SYS_ADMIN'
  customerId?: { id: string }
}

export interface AuthState {
  token: string
  refreshToken: string
  user: User
}

export interface Device {
  id: { id: string }
  name: string
  label?: string
  type: string
  createdTime: number
}

export interface TelemetryPoint {
  ts: number
  value: string
}

export interface LatestTelemetry {
  temperature?: TelemetryPoint[]
  humidity?: TelemetryPoint[]
  illuminance?: TelemetryPoint[]
}

export interface HistoryTelemetry {
  temperature?: TelemetryPoint[]
  humidity?: TelemetryPoint[]
  illuminance?: TelemetryPoint[]
}

export type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d'
