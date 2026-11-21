import { Link, NavLink } from 'react-router-dom'
import { Bell } from 'lucide-react'
import Logo from './Logo'
import { useDesk } from '../context/DeskContext'

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

export default function Header() {
  const { settings } = useDesk()
  const modelReady = settings.llm.apiKey.trim().length > 0

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Logo />

        <nav className="desk-nav" aria-label="Primary">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
          >
            Home
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
          >
            Profile
          </NavLink>
        </nav>

        <div className="header-actions">
          <Link
            to="/profile#ai-engine"
            className="engine-chip"
            title={modelReady ? 'Your model is connected' : 'Add an API key to start analysis'}
          >
            <span className={`pulse-dot${modelReady ? '' : ' is-warn'}`} />
            <span>{modelReady ? 'Desk live' : 'Model needed'}</span>
          </Link>

          <Link
            to="/profile#notifications"
            className="icon-btn header-bell"
            aria-label="Notification settings"
          >
            <Bell size={17} />
            {settings.notifications.push && <span className="notif-dot" />}
          </Link>

          <Link to="/profile" className="avatar" aria-label="Open your profile">
            {initialsFrom(settings.name)}
          </Link>
        </div>
      </div>
    </header>
  )
}
