export type SignalAction = 'buy' | 'sell' | 'hold'

export type Signal = {
  id: string
  assetId: string
  action: SignalAction
  confidence: number
  timeframe: string
  age: string
  title: string
  thesis: string
  entry: string
  target: string
  stop: string
  sources: number
}

export const ACTION_LABELS: Record<SignalAction, string> = {
  buy: 'Buy',
  sell: 'Sell',
  hold: 'Hold',
}

export const SIGNALS: Signal[] = [
  {
    id: 'sig-gold-01',
    assetId: 'gold',
    action: 'buy',
    confidence: 74,
    timeframe: '4H',
    age: '12m ago',
    title: 'Central-bank demand meets a coiled breakout',
    thesis:
      'Physical demand is running hot while price compresses under resistance. The desk wants a clean close above the range before sizing up.',
    entry: '$4,168',
    target: '$4,245',
    stop: '$4,120',
    sources: 9,
  },
  {
    id: 'sig-btc-01',
    assetId: 'bitcoin',
    action: 'hold',
    confidence: 61,
    timeframe: '1D',
    age: '1h ago',
    title: 'ETF inflows cool, but the trend is intact',
    thesis:
      'Spot flows have flattened while the higher-timeframe structure holds. There is no edge in chasing here — the desk wants the retest.',
    entry: '—',
    target: '$101,200',
    stop: '$91,400',
    sources: 12,
  },
  {
    id: 'sig-wti-01',
    assetId: 'wti',
    action: 'sell',
    confidence: 69,
    timeframe: '1D',
    age: '2h ago',
    title: 'Supply chatter is winning the tape',
    thesis:
      'OPEC+ headlines are capping rallies while inventories build. The desk is fading strength, not chasing breakdowns.',
    entry: '$62.40',
    target: '$58.10',
    stop: '$64.20',
    sources: 7,
  },
  {
    id: 'sig-eur-01',
    assetId: 'eur-usd',
    action: 'buy',
    confidence: 66,
    timeframe: '12H',
    age: '4h ago',
    title: 'The dollar softens into the next CPI print',
    thesis:
      'Rate-differential momentum has turned. A softer inflation print would give the pair room to retest the recent high.',
    entry: '1.1540',
    target: '1.1690',
    stop: '1.1470',
    sources: 8,
  },
  {
    id: 'sig-silver-01',
    assetId: 'silver',
    action: 'buy',
    confidence: 71,
    timeframe: '1D',
    age: '6h ago',
    title: 'Industrial demand is tightening the float',
    thesis:
      'Solar and electronics demand keep the deficit narrative alive. Silver is lagging gold, and the desk likes the catch-up trade.',
    entry: '$52.80',
    target: '$56.40',
    stop: '$51.10',
    sources: 6,
  },
]
