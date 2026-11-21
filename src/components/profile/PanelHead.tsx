import type { ReactNode } from 'react'

export default function PanelHead({
  icon,
  title,
  description,
  aside,
}: {
  icon: ReactNode
  title: string
  description: string
  aside?: ReactNode
}) {
  return (
    <div className="panel-head">
      <div className="panel-head-main">
        <span className="panel-icon">{icon}</span>
        <div>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>
      {aside}
    </div>
  )
}
