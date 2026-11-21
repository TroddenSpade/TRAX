import type { CSSProperties } from 'react'
import { Newspaper } from 'lucide-react'
import { getAsset } from '../data/assets'
import { ACTION_LABELS, type Signal, type SignalAction } from '../data/signals'

const ACTION_COLORS: Record<SignalAction, string> = {
  buy: '#5fe3a1',
  sell: '#ff7a7a',
  hold: '#f2c14e',
}

export default function SignalRow({ signal }: { signal: Signal }) {
  const asset = getAsset(signal.assetId)
  if (!asset) return null

  return (
    <article
      className={`signal-row signal-row--${signal.action}`}
      style={{ '--action-color': ACTION_COLORS[signal.action] } as CSSProperties}
    >
      <div className="signal-asset">
        <span
          className="asset-badge"
          style={{ '--asset-color': asset.color } as CSSProperties}
        >
          {asset.symbol}
        </span>
        <div>
          <h3>{asset.name}</h3>
          <div className="signal-meta">
            <span>{signal.timeframe}</span>
            <i aria-hidden="true" />
            <span>{signal.age}</span>
          </div>
        </div>
      </div>

      <div className="signal-main">
        <h4>{signal.title}</h4>
        <p className="signal-thesis">{signal.thesis}</p>
      </div>

      <div className="signal-side">
        <div className="signal-side-top">
          <span className={`action action--${signal.action}`}>
            {ACTION_LABELS[signal.action]}
          </span>
          <span className="confidence-num">{signal.confidence}%</span>
        </div>

        <div
          className="confidence-bar"
          role="img"
          aria-label={`${signal.confidence} percent confidence`}
        >
          <span style={{ width: `${signal.confidence}%` }} />
        </div>

        <div className="signal-levels">
          <span>
            <em>Entry</em>
            <b>{signal.entry}</b>
          </span>
          <span>
            <em>Target</em>
            <b>{signal.target}</b>
          </span>
          <span>
            <em>Stop</em>
            <b>{signal.stop}</b>
          </span>
        </div>

        <span className="signal-sources">
          <Newspaper size={12} />
          {signal.sources} sources read
        </span>
      </div>
    </article>
  )
}
