import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Cadence = '15m' | '1h' | '4h' | '1d'

export type LlmConfig = {
  baseUrl: string
  model: string
  apiKey: string
}

export type NotificationPrefs = {
  push: boolean
  digest: boolean
  highConvictionOnly: boolean
}

export type DeskSettings = {
  name: string
  email: string
  timezone: string
  interests: string[]
  llm: LlmConfig
  cadence: Cadence
  marketHoursOnly: boolean
  notifications: NotificationPrefs
  maxSources: number
}

export const DEFAULT_SETTINGS: DeskSettings = {
  name: 'Parsa',
  email: 'parsa@trax.desk',
  timezone: 'GMT+3:30 · Tehran',
  interests: ['gold', 'silver', 'wti', 'bitcoin', 'ethereum', 'eur-usd'],
  llm: {
    baseUrl: 'https://api.openai.com/v1',
    model: 'gpt-4o-mini',
    apiKey: '',
  },
  cadence: '1h',
  marketHoursOnly: false,
  notifications: {
    push: true,
    digest: true,
    highConvictionOnly: false,
  },
  maxSources: 14,
}

const STORAGE_KEY = 'trax.desk.v1'
const CADENCES: Cadence[] = ['15m', '1h', '4h', '1d']

function mergeSettings(raw: unknown): DeskSettings {
  if (!raw || typeof raw !== 'object') return DEFAULT_SETTINGS

  const partial = raw as Partial<DeskSettings>
  const merged: DeskSettings = {
    ...DEFAULT_SETTINGS,
    ...partial,
    llm: { ...DEFAULT_SETTINGS.llm, ...(partial.llm ?? {}) },
    notifications: {
      ...DEFAULT_SETTINGS.notifications,
      ...(partial.notifications ?? {}),
    },
    interests: Array.isArray(partial.interests)
      ? partial.interests.filter((id): id is string => typeof id === 'string')
      : DEFAULT_SETTINGS.interests,
  }

  if (!CADENCES.includes(merged.cadence)) merged.cadence = DEFAULT_SETTINGS.cadence
  if (typeof merged.maxSources !== 'number' || Number.isNaN(merged.maxSources)) {
    merged.maxSources = DEFAULT_SETTINGS.maxSources
  }
  merged.maxSources = Math.min(20, Math.max(6, Math.round(merged.maxSources)))

  return merged
}

function loadSettings(): DeskSettings {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    return mergeSettings(JSON.parse(raw))
  } catch {
    return DEFAULT_SETTINGS
  }
}

type DeskContextValue = {
  settings: DeskSettings
  saveSettings: (next: DeskSettings) => void
  resetSettings: () => void
}

const DeskContext = createContext<DeskContextValue | null>(null)

export function DeskProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<DeskSettings>(loadSettings)

  const value = useMemo<DeskContextValue>(
    () => ({
      settings,
      saveSettings(next) {
        setSettings(next)
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch {
          // The desk still works for this session if storage is unavailable.
        }
      },
      resetSettings() {
        setSettings(DEFAULT_SETTINGS)
        try {
          window.localStorage.removeItem(STORAGE_KEY)
        } catch {
          // Ignore storage failures.
        }
      },
    }),
    [settings],
  )

  return <DeskContext.Provider value={value}>{children}</DeskContext.Provider>
}

export function useDesk(): DeskContextValue {
  const context = useContext(DeskContext)
  if (!context) {
    throw new Error('useDesk must be used inside DeskProvider')
  }
  return context
}
