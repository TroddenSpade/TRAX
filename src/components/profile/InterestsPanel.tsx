import type { CSSProperties } from 'react'
import { Check, Crosshair } from 'lucide-react'
import {
  ASSETS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type Category,
} from '../../data/assets'
import PanelHead from './PanelHead'

export default function InterestsPanel({
  interests,
  onToggle,
  onToggleCategory,
}: {
  interests: string[]
  onToggle: (id: string) => void
  onToggleCategory: (category: Category) => void
}) {
  return (
    <section className="panel" id="interests">
      <PanelHead
        icon={<Crosshair size={16} />}
        title="Interests"
        description="The assets your desk crawls, scores, and writes about."
        aside={<span className="count-chip">{interests.length} selected</span>}
      />

      <div className="interest-groups">
        {CATEGORY_ORDER.map((category) => {
          const items = ASSETS.filter((asset) => asset.category === category)
          const selectedCount = items.filter((asset) =>
            interests.includes(asset.id),
          ).length
          const allSelected = selectedCount === items.length

          return (
            <div key={category} className="interest-group">
              <div className="interest-group-head">
                <h3>{CATEGORY_LABELS[category]}</h3>
                <div className="interest-group-actions">
                  <span>
                    {selectedCount}/{items.length}
                  </span>
                  <button
                    type="button"
                    className="text-btn"
                    onClick={() => onToggleCategory(category)}
                  >
                    {allSelected ? 'Clear' : 'All'}
                  </button>
                </div>
              </div>

              <div className="interest-chips">
                {items.map((asset) => {
                  const active = interests.includes(asset.id)
                  return (
                    <button
                      key={asset.id}
                      type="button"
                      className={`interest-chip${active ? ' is-selected' : ''}`}
                      aria-pressed={active}
                      onClick={() => onToggle(asset.id)}
                      style={{ '--asset-color': asset.color } as CSSProperties}
                    >
                      <span className="asset-badge">{asset.symbol}</span>
                      <span>{asset.name}</span>
                      {active && <Check className="interest-check" size={12} />}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {interests.length === 0 ? (
        <p className="field-error">
          Pick at least one asset to keep the desk running.
        </p>
      ) : (
        <p className="field-hint">
          At least one interest is required. Your watchlist and signals update
          after you save.
        </p>
      )}
    </section>
  )
}
