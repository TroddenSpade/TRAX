import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Cpu,
  Crosshair,
  Gauge,
  Loader2,
  Radar,
  ScanLine,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Timer,
  Wifi,
} from 'lucide-react'
import {
  ASSETS,
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  getAsset,
  type Category,
} from '../data/assets'
import { SIGNALS } from '../data/signals'
import { CRAWL_TIMELINE, SOURCES } from '../data/sources'
import { useDesk } from '../context/DeskContext'
import {
  CADENCE_LABELS,
  formatCountdown,
  useNextScanCountdown,
} from '../hooks/useNextScan'
import AssetCard from '../components/AssetCard'
import SignalRow from '../components/SignalRow'
import { LogoMark } from '../components/Logo'
import { Toast, useToast } from '../components/Toast'

const RADAR_POSITIONS = [
  { top: '18%', left: '67%' },
  { top: '63%', left: '80%' },
  { top: '77%', left: '27%' },
  { top: '34%', left: '16%' },
]

function greetingFor(date: Date): string {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

function formatToday(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
    .format(date)
    .toUpperCase()
}

function endpointLabel(baseUrl: string): string {
  try {
    return new URL(baseUrl).host
  } catch {
    return 'Not set'
  }
}

export default function Home() {
  const { settings } = useDesk()
  const [filter, setFilter] = useState<Category | 'all'>('all')
  const [scanning, setScanning] = useState(false)
  const [lastScan, setLastScan] = useState('18m ago')
  const { toast, showToast, dismiss } = useToast()
  const scanTimer = useRef<number | null>(null)
  const nextSeconds = useNextScanCountdown(settings.cadence)

  const selected = new Set(settings.interests)
  const watched = ASSETS.filter((asset) => selected.has(asset.id))
  const visible = filter === 'all' ? watched : watched.filter((asset) => asset.category === filter)
  const signals = SIGNALS.filter((signal) => selected.has(signal.assetId))
  const buyCount = signals.filter((signal) => signal.action === 'buy').length
  const sellCount = signals.filter((signal) => signal.action === 'sell').length
  const avgConfidence = signals.length
    ? Math.round(signals.reduce((total, signal) => total + signal.confidence, 0) / signals.length)
    : 0
  const availableCategories = CATEGORY_ORDER.filter((category) =>
    watched.some((asset) => asset.category === category),
  )
  const radarAssets = watched.slice(0, 4)
  const modelName = settings.llm.model.trim() || 'No model yet'
  const modelReady = settings.llm.apiKey.trim().length > 0
  const displayName = settings.name.trim() || 'trader'
  const now = new Date()
  const timezoneCity = settings.timezone.split(' · ')[1] ?? 'Your desk'
  const callSummary = signals.length
    ? `${signals.length} call${signals.length === 1 ? '' : 's'} ${signals.length === 1 ? 'needs' : 'need'} a look.`
    : 'The desk is watching your lanes.'

  useEffect(() => {
    if (filter === 'all') return
    const stillTracked = settings.interests.some(
      (id) => getAsset(id)?.category === filter,
    )
    if (!stillTracked) setFilter('all')
  }, [filter, settings.interests])

  useEffect(
    () => () => {
      if (scanTimer.current) window.clearTimeout(scanTimer.current)
    },
    [],
  )

  function runScan() {
    if (scanning) return
    setScanning(true)
    scanTimer.current = window.setTimeout(() => {
      setScanning(false)
      setLastScan('just now')
      const callText = signals.length
        ? ` · ${signals.length} calls refreshed`
        : ''
      showToast(`Sweep complete · ${settings.maxSources} sources read${callText}.`)
    }, 2_600)
  }

  return (
    <div className="page home-page">
      <div className="greeting">
        <div>
          <span className="eyebrow eyebrow--muted">
            {formatToday(now)} · {timezoneCity}
          </span>
          <h1>
            {greetingFor(now)}, {displayName}.
          </h1>
          <p>
            Your desk scanned {settings.maxSources} sources while you were away.{' '}
            {callSummary}
          </p>
        </div>
        <div className="greeting-actions">
          <Link to="/profile#interests" className="btn btn--ghost">
            <SlidersHorizontal size={15} />
            Edit interests
          </Link>
          <button
            type="button"
            className="btn btn--primary"
            onClick={runScan}
            disabled={scanning}
          >
            {scanning ? (
              <Loader2 className="spin" size={15} />
            ) : (
              <Radar size={15} />
            )}
            {scanning ? 'Scanning sources…' : 'Run scan'}
          </button>
        </div>
      </div>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <span className="pulse-dot" />
            AI DESK · LIVE
          </span>
          <h2>
            Hunt the signal,
            <br />
            <span>not the noise.</span>
          </h2>
          <p className="hero-sub">
            TRAX crawls the sources that move your assets, scores every headline
            against your book, and writes the call in plain English — with the
            receipts.
          </p>
          <div className="hero-meta">
            <span className="meta-chip">
              <Cpu size={13} />
              {modelName}
            </span>
            <span className="meta-chip">
              <Clock3 size={13} />
              {CADENCE_LABELS[settings.cadence]}
            </span>
            <span className="meta-chip">
              <ScanLine size={13} />
              Last scan {lastScan}
            </span>
          </div>
        </div>

        <div className={`radar-card${scanning ? ' is-scanning' : ''}`}>
          <div className="radar-head">
            <span className="radar-live">
              <i />
              {scanning ? 'SCANNING' : 'LIVE SWEEP'}
            </span>
            <span>{settings.maxSources} SOURCES</span>
          </div>

          <div className="radar" aria-hidden="true">
            <span className="radar-ring radar-ring--1" />
            <span className="radar-ring radar-ring--2" />
            <span className="radar-ring radar-ring--3" />
            <span className="radar-cross radar-cross--h" />
            <span className="radar-cross radar-cross--v" />
            <span className="radar-sweep" />
            {radarAssets.map((asset, index) => (
              <span
                key={asset.id}
                className="radar-blip"
                style={
                  {
                    top: RADAR_POSITIONS[index].top,
                    left: RADAR_POSITIONS[index].left,
                    '--delay': `${index * 0.55}s`,
                  } as CSSProperties
                }
              >
                <i />
                {asset.symbol}
              </span>
            ))}
            <span className="radar-center">
              <LogoMark size={44} />
            </span>
          </div>

          <div className="radar-foot">
            <div>
              <span>Next sweep</span>
              <strong>{formatCountdown(nextSeconds)}</strong>
            </div>
            <div>
              <span>Source health</span>
              <strong>
                {settings.maxSources}/{settings.maxSources}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="stat-grid" aria-label="Desk overview">
        <div className="stat">
          <div className="stat-top">
            <span>Tracked assets</span>
            <Crosshair size={15} />
          </div>
          <strong className="stat-value">{settings.interests.length}</strong>
          <span className="stat-sub">of {ASSETS.length} on the desk</span>
        </div>
        <div className="stat">
          <div className="stat-top">
            <span>Open calls</span>
            <Activity size={15} />
          </div>
          <strong className="stat-value">{signals.length}</strong>
          <span className="stat-sub">
            {buyCount} buy · {sellCount} sell
          </span>
        </div>
        <div className="stat">
          <div className="stat-top">
            <span>Avg. conviction</span>
            <Gauge size={15} />
          </div>
          <strong className="stat-value">
            {signals.length ? `${avgConfidence}%` : '—'}
          </strong>
          <span className="stat-sub">Across your live calls</span>
        </div>
        <div className="stat">
          <div className="stat-top">
            <span>Next sweep</span>
            <Timer size={15} />
          </div>
          <strong className="stat-value">{formatCountdown(nextSeconds)}</strong>
          <span className="stat-sub">{CADENCE_LABELS[settings.cadence]}</span>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>Your watchlist</h2>
            <p>Only the assets you asked TRAX to hunt.</p>
          </div>
          <Link to="/profile#interests" className="section-link">
            Manage interests
            <ArrowUpRight size={13} />
          </Link>
        </div>

        {watched.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">
              <Crosshair size={20} />
            </span>
            <div>
              <h3>Your desk is empty.</h3>
              <p>Pick the assets you want TRAX to track and the crawl starts with them.</p>
            </div>
            <Link to="/profile#interests" className="btn btn--primary">
              Choose interests
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <>
            <div className="watch-toolbar">
              <div className="tabs" role="group" aria-label="Filter watchlist">
                <button
                  type="button"
                  className={`tab${filter === 'all' ? ' is-active' : ''}`}
                  aria-pressed={filter === 'all'}
                  onClick={() => setFilter('all')}
                >
                  All <span>{watched.length}</span>
                </button>
                {availableCategories.map((category) => {
                  const count = watched.filter(
                    (asset) => asset.category === category,
                  ).length
                  return (
                    <button
                      key={category}
                      type="button"
                      className={`tab${filter === category ? ' is-active' : ''}`}
                      aria-pressed={filter === category}
                      onClick={() => setFilter(category)}
                    >
                      {CATEGORY_LABELS[category]} <span>{count}</span>
                    </button>
                  )
                })}
              </div>
              <span className="watch-count">{visible.length} assets</span>
            </div>

            <div className="asset-grid">
              {visible.map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          </>
        )}
      </section>

      <div className="desk-grid">
        <section className="section section--flush">
          <div className="section-head">
            <div>
              <h2>Latest AI calls</h2>
              <p>Every call links back to the sources it came from.</p>
            </div>
            <span className="live-note">
              <span className="pulse-dot" />
              {signals.length} live
            </span>
          </div>

          {signals.length > 0 ? (
            <div className="signal-list">
              {signals.map((signal) => (
                <SignalRow key={signal.id} signal={signal} />
              ))}
            </div>
          ) : (
            <div className="empty-state empty-state--compact">
              <span className="empty-icon">
                <Sparkles size={20} />
              </span>
              <div>
                <h3>No calls in your lanes yet.</h3>
                <p>
                  Your desk only speaks when it has something sourced to say. Add
                  interests or wait for the next sweep.
                </p>
              </div>
            </div>
          )}
        </section>

        <aside className="aside-stack">
          <section className="aside-card">
            <div className="aside-title">
              <h3>Crawl schedule</h3>
              <span>{formatCountdown(nextSeconds)}</span>
            </div>

            <div className="timeline">
              {CRAWL_TIMELINE.map((item) => (
                <div
                  key={item.title}
                  className={`timeline-item${item.active ? ' is-active' : ''}`}
                >
                  <span className="timeline-marker" />
                  <div className="timeline-content">
                    <strong>{item.title}</strong>
                    <span>{item.detail}</span>
                  </div>
                  <span className="timeline-when">{item.when}</span>
                </div>
              ))}
            </div>

            <div className="source-mini-list">
              {SOURCES.slice(0, 4).map((source) => (
                <div key={source.name} className="source-mini">
                  <span className={`source-dot source-dot--${source.status}`} />
                  <span>{source.name}</span>
                  <em>{source.cadence}</em>
                </div>
              ))}
            </div>

            <div className="aside-foot">
              <Wifi size={13} />
              {settings.maxSources} sources online · 0 errors
            </div>
          </section>

          <section className="aside-card">
            <div className="aside-title">
              <h3>Your engine</h3>
              <span className={`mini-status${modelReady ? ' ok' : ''}`}>
                {modelReady ? 'READY' : 'KEY NEEDED'}
              </span>
            </div>

            <div className="engine-row">
              <span>Model</span>
              <b>{modelName}</b>
            </div>
            <div className="engine-row">
              <span>Endpoint</span>
              <b>{endpointLabel(settings.llm.baseUrl)}</b>
            </div>
            <div className="engine-row">
              <span>Cadence</span>
              <b>{CADENCE_LABELS[settings.cadence]}</b>
            </div>
            <div className="engine-row">
              <span>API key</span>
              <b>{modelReady ? 'Stored locally' : 'Not set'}</b>
            </div>

            <Link to="/profile#ai-engine" className="aside-link">
              Configure engine
              <ArrowUpRight size={13} />
            </Link>
          </section>

          <section className="aside-card aside-card--note">
            <ShieldCheck size={17} />
            <div>
              <strong>Research, not advice.</strong>
              <span>
                TRAX surfaces setups and the sources behind them. Position sizing
                and risk stay with you.
              </span>
            </div>
          </section>
        </aside>
      </div>

      <Toast toast={toast} onDismiss={dismiss} />
    </div>
  )
}
