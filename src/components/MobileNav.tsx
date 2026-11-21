import { NavLink } from 'react-router-dom'
import { House, UserRound } from 'lucide-react'

export default function MobileNav() {
  return (
    <nav className="mobile-nav" aria-label="Mobile primary">
      <NavLink to="/" end className={({ isActive }) => (isActive ? 'is-active' : '')}>
        <House size={19} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => (isActive ? 'is-active' : '')}>
        <UserRound size={19} />
        <span>Profile</span>
      </NavLink>
    </nav>
  )
}
