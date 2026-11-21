import { Link } from 'react-router-dom'

export function LogoMark({
  size = 38,
  className = '',
}: {
  size?: number
  className?: string
}) {
  return (
    <img
      src="/logo.svg"
      width={size}
      height={size}
      alt=""
      className={`logo-mark ${className}`.trim()}
      aria-hidden="true"
    />
  )
}

export default function Logo() {
  return (
    <Link to="/" className="brand" aria-label="TRAX home">
      <LogoMark />
      <span className="brand-text">
        <span className="brand-name">TRAX</span>
        <span className="brand-tag">AI TRADING DESK</span>
      </span>
    </Link>
  )
}
