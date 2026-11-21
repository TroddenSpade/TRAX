import type { CSSProperties } from 'react'
import { Clock3 } from 'lucide-react'
import type { Cadence } from '../../context/DeskContext'
import {
  CADENCE_LABELS,
  CADENCE_SHORT,
  nextScanClock,
} from '../../hooks/useNextScan'
import Toggle from '../Toggle'
import PanelHead from './PanelHead'

const CADENCE_OPTIONS: Cadence[] = ['15m', '1h', '4h', '1d']

export default function CadencePanel({
  cadence,
  marketHoursOnly,
  maxSources,
  onCadence,
  onMarketHours,
  onMaxSources,
}: {
  cadence: Cadence
  marketHoursOnly: boolean
  maxSources: number
  onCadence: (cadence: Cadence) => void
  onMarketHours: (value: boolean) => void
  onMaxSources: (value: number) => void
}) {
  const rangePercent = ((maxSources - 6) / 14) * 100

  return (
    <section className="panel" id="cadence">
      <PanelHead
        icon={<Clock3 size={16} />}
        title="Crawl cadence"
        description="How often TRAX sweeps the web."
        aside={
          <span className="mini-status">{CADENCE_SHORT[cadence].toUpperCase()}</span>
        }
      />

      <div className="segmented" role="group" aria-label="Analysis cadence">
        {CADENCE_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            className={cadence === option ? 'is-active' : ''}
            aria-pressed={cadence === option}
            onClick={() => onCadence(option)}
          >
            {CADENCE_SHORT[option]}
          </button>
        ))}
      </div>

      <p className="field-hint cadence-hint">
        Next sweep at {nextScanClock(cadence)} · {CADENCE_LABELS[cadence].toLowerCase()}
      </p>

      <div className="toggle-list">
        <div className="toggle-row">
          <div className="toggle-copy">
            <strong>Market hours only</strong>
            <span>Pause the crawl when your markets are closed.</span>
          </div>
          <Toggle
            checked={marketHoursOnly}
            onChange={onMarketHours}
            label="Market hours only"
          />
        </div>
      </div>

      <div className="range-block">
        <div className="range-head">
          <label htmlFor="max-sources">Max sources per sweep</label>
          <strong>{maxSources}</strong>
        </div>
        <div className="range-row">
          <span>6</span>
          <input
            id="max-sources"
            type="range"
            min={6}
            max={20}
            step={1}
            value={maxSources}
            onChange={(event) => onMaxSources(Number(event.target.value))}
            style={{ '--pct': `${rangePercent}%` } as CSSProperties}
          />
          <span>20</span>
        </div>
        <span className="field-hint">
          More sources means broader context and a slower sweep.
        </span>
      </div>
    </section>
  )
}
