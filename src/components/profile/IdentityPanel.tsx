import { UserRound } from 'lucide-react'
import type { DeskSettings } from '../../context/DeskContext'
import PanelHead from './PanelHead'

const TIMEZONES = [
  'GMT-8 · Los Angeles',
  'GMT-5 · New York',
  'GMT+0 · London',
  'GMT+1 · Berlin',
  'GMT+3:30 · Tehran',
  'GMT+4 · Dubai',
  'GMT+5:30 · Mumbai',
  'GMT+8 · Singapore',
  'GMT+9 · Tokyo',
]

function initialsFrom(name: string): string {
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return initials || 'TR'
}

export default function IdentityPanel({
  draft,
  onChange,
}: {
  draft: DeskSettings
  onChange: <K extends keyof DeskSettings>(key: K, value: DeskSettings[K]) => void
}) {
  return (
    <section className="panel" id="identity">
      <PanelHead
        icon={<UserRound size={16} />}
        title="Trader identity"
        description="How your desk addresses you."
        aside={<span className="mini-status ok">LOCAL-FIRST</span>}
      />

      <div className="identity-top">
        <span className="avatar avatar--lg">{initialsFrom(draft.name)}</span>
        <div className="identity-copy">
          <strong>{draft.name.trim() || 'Your desk'}</strong>
          <span>{draft.email.trim() || 'No email yet'}</span>
        </div>
        <span className="identity-meta">Desk since Nov 2026</span>
      </div>

      <div className="form-grid">
        <div className="field">
          <label htmlFor="profile-name">Display name</label>
          <input
            id="profile-name"
            value={draft.name}
            onChange={(event) => onChange('name', event.target.value)}
            placeholder="Your name"
            maxLength={40}
            autoComplete="name"
          />
        </div>

        <div className="field">
          <label htmlFor="profile-email">Email for digests</label>
          <input
            id="profile-email"
            type="email"
            value={draft.email}
            onChange={(event) => onChange('email', event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>

        <div className="field field--full">
          <label htmlFor="profile-timezone">Timezone</label>
          <select
            id="profile-timezone"
            value={draft.timezone}
            onChange={(event) => onChange('timezone', event.target.value)}
          >
            {TIMEZONES.map((timezone) => (
              <option key={timezone} value={timezone}>
                {timezone}
              </option>
            ))}
          </select>
          <span className="field-hint">
            Used for crawl windows, digest timing, and market-hours rules.
          </span>
        </div>
      </div>
    </section>
  )
}
