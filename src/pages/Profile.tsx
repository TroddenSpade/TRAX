import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ArrowRight, Check } from 'lucide-react'
import { useDesk } from '../context/DeskContext'
import type {
  DeskSettings,
  LlmConfig,
  NotificationPrefs,
} from '../context/DeskContext'
import { ASSETS, type Category } from '../data/assets'
import IdentityPanel from '../components/profile/IdentityPanel'
import InterestsPanel from '../components/profile/InterestsPanel'
import NotificationsPanel from '../components/profile/NotificationsPanel'
import AiEnginePanel from '../components/profile/AiEnginePanel'
import CadencePanel from '../components/profile/CadencePanel'
import InstallPanel from '../components/profile/InstallPanel'
import { Toast, useToast } from '../components/Toast'

export default function Profile() {
  const { settings, saveSettings } = useDesk()
  const [draft, setDraft] = useState<DeskSettings>(settings)
  const { toast, showToast, dismiss } = useToast()
  const location = useLocation()
  const dirty = JSON.stringify(draft) !== JSON.stringify(settings)

  useEffect(() => {
    setDraft(settings)
  }, [settings])

  useEffect(() => {
    if (!location.hash) return
    const element = document.getElementById(location.hash.slice(1))
    if (!element) return
    const timer = window.setTimeout(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
    return () => window.clearTimeout(timer)
  }, [location.hash])

  function updateField<K extends keyof DeskSettings>(
    key: K,
    value: DeskSettings[K],
  ) {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  function updateLlm(patch: Partial<LlmConfig>) {
    setDraft((current) => ({
      ...current,
      llm: { ...current.llm, ...patch },
    }))
  }

  function updateNotifications(patch: Partial<NotificationPrefs>) {
    setDraft((current) => ({
      ...current,
      notifications: { ...current.notifications, ...patch },
    }))
  }

  function toggleInterest(id: string) {
    setDraft((current) => ({
      ...current,
      interests: current.interests.includes(id)
        ? current.interests.filter((interest) => interest !== id)
        : [...current.interests, id],
    }))
  }

  function toggleCategory(category: Category) {
    const ids = ASSETS.filter((asset) => asset.category === category).map(
      (asset) => asset.id,
    )
    const allSelected = ids.every((id) => draft.interests.includes(id))

    setDraft((current) => ({
      ...current,
      interests: allSelected
        ? current.interests.filter((id) => !ids.includes(id))
        : Array.from(new Set([...current.interests, ...ids])),
    }))
  }

  function save() {
    if (draft.interests.length === 0) {
      showToast('Pick at least one asset before saving.', 'error')
      return
    }

    saveSettings(draft)
    showToast(
      draft.llm.apiKey.trim()
        ? 'Desk settings saved.'
        : 'Saved — add an API key to bring the desk online.',
    )
  }

  return (
    <div className="page profile-page">
      <div className="page-head profile-head">
        <div>
          <span className="eyebrow eyebrow--muted">DESK SETTINGS</span>
          <h1>Your desk, your rules.</h1>
          <p>
            TRAX only watches what you care about — and thinks with the model you
            choose.
          </p>
        </div>
        <div className="profile-head-actions">
          <span className="save-state">
            {dirty ? 'Unsaved changes' : 'All changes saved'}
          </span>
          <button
            type="button"
            className="btn btn--primary"
            onClick={save}
            disabled={!dirty}
          >
            <Check size={15} />
            {dirty ? 'Save changes' : 'Saved'}
          </button>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-col">
          <IdentityPanel draft={draft} onChange={updateField} />
          <InterestsPanel
            interests={draft.interests}
            onToggle={toggleInterest}
            onToggleCategory={toggleCategory}
          />
          <NotificationsPanel
            notifications={draft.notifications}
            onChange={updateNotifications}
          />
        </div>

        <div className="profile-col">
          <AiEnginePanel llm={draft.llm} onChange={updateLlm} />
          <CadencePanel
            cadence={draft.cadence}
            marketHoursOnly={draft.marketHoursOnly}
            maxSources={draft.maxSources}
            onCadence={(cadence) => updateField('cadence', cadence)}
            onMarketHours={(value) => updateField('marketHoursOnly', value)}
            onMaxSources={(value) => updateField('maxSources', value)}
          />
          <InstallPanel onNotify={(message) => showToast(message)} />
        </div>
      </div>

      <div className="profile-footer">
        <span>Settings are stored on this device only.</span>
        <Link to="/" className="section-link">
          Back to the desk
          <ArrowRight size={13} />
        </Link>
      </div>

      {dirty && (
        <div className="mobile-save">
          <span>Unsaved changes</span>
          <button type="button" className="btn btn--primary" onClick={save}>
            <Check size={14} />
            Save
          </button>
        </div>
      )}

      <Toast toast={toast} onDismiss={dismiss} />
    </div>
  )
}
