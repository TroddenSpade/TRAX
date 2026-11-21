import type { CSSProperties } from 'react'
import { Sparkles } from 'lucide-react'
import {
  CATEGORY_LABELS,
  STANCE_LABELS,
  formatChange,
  formatPrice,
  type Asset,
} from '../data/assets'
import Sparkline from './Sparkline'

export default function AssetCard({ asset }: { asset: Asset }) {
  const positive = asset.change >= 0

  return (
    <article className="asset-card">
      <div className="asset-card-top">
        <span
          className="asset-badge"
          style={{ '--asset-color': asset.color } as CSSProperties}
        >
          {asset.symbol}
        </span>
        <span className="asset-cat">{CATEGORY_LABELS[asset.category]}</span>
      </div>

      <p className="asset-name">{asset.name}</p>

      <div className="asset-price-row">
        <span className="asset-price">{formatPrice(asset)}</span>
        <span className={`change ${positive ? 'up' : 'down'}`}>
          {formatChange(asset.change)}
        </span>
      </div>

      <Sparkline data={asset.series} positive={positive} id={asset.id} />

      <div className="asset-foot">
        <span>24h</span>
        <span className={`asset-ai stance-text--${asset.stance}`}>
          <Sparkles size={11} />
          AI {STANCE_LABELS[asset.stance].toLowerCase()}
        </span>
      </div>
    </article>
  )
}
