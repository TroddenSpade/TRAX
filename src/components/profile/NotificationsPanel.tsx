import { Bell } from 'lucide-react'
import type { NotificationPrefs } from '../../context/DeskContext'
import Toggle from '../Toggle'
import PanelHead from './PanelHead'

export default function NotificationsPanel({
  notifications,
  onChange,
}: {
  notifications: NotificationPrefs
  onChange: (patch: Partial<NotificationPrefs>) => void
}) {
  return (
    <section className="panel" id="notifications">
      <PanelHead
        icon={<Bell size={16} />}
        title="Notifications"
        description="Choose when the desk is allowed to interrupt you."
        aside={<span className="mini-status ok">ON DEVICE</span>}
      />

      <div className="toggle-list">
        <div className="toggle-row">
          <div className="toggle-copy">
            <strong>Push alerts</strong>
            <span>When a call clears your conviction bar.</span>
          </div>
          <Toggle
            checked={notifications.push}
            onChange={(push) => onChange({ push })}
            label="Push alerts"
          />
        </div>

        <div className="toggle-row">
          <div className="toggle-copy">
            <strong>Daily digest</strong>
            <span>A morning recap of every open call.</span>
          </div>
          <Toggle
            checked={notifications.digest}
            onChange={(digest) => onChange({ digest })}
            label="Daily digest"
          />
        </div>

        <div className="toggle-row">
          <div className="toggle-copy">
            <strong>High-conviction only</strong>
            <span>Mute anything under 70% confidence.</span>
          </div>
          <Toggle
            checked={notifications.highConvictionOnly}
            onChange={(highConvictionOnly) => onChange({ highConvictionOnly })}
            label="High-conviction only"
          />
        </div>
      </div>

      <p className="field-hint">
        Alerts are delivered by the desk service once your model endpoint is
        connected. Preferences are stored on this device.
      </p>
    </section>
  )
}
