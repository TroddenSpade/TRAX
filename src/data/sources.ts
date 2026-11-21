export type SourceStatus = 'live' | 'scheduled'

export type Source = {
  name: string
  kind: string
  cadence: string
  status: SourceStatus
}

export const SOURCES: Source[] = [
  {
    name: 'Reuters Commodities',
    kind: 'Wire',
    cadence: '15m',
    status: 'live',
  },
  {
    name: 'CoinDesk + The Block',
    kind: 'Crypto',
    cadence: '15m',
    status: 'live',
  },
  {
    name: 'Forex Factory calendar',
    kind: 'Macro',
    cadence: '30m',
    status: 'live',
  },
  {
    name: 'Central bank releases',
    kind: 'Policy',
    cadence: '1h',
    status: 'live',
  },
  {
    name: 'EIA inventory data',
    kind: 'Energy',
    cadence: 'Weekly',
    status: 'scheduled',
  },
  {
    name: 'Social pulse',
    kind: 'Sentiment',
    cadence: '30m',
    status: 'live',
  },
]

export type TimelineItem = {
  when: string
  title: string
  detail: string
  active?: boolean
}

export const CRAWL_TIMELINE: TimelineItem[] = [
  {
    when: 'Now',
    title: 'Deep scan · metals & macro',
    detail: '9 sources read · synthesis running',
    active: true,
  },
  {
    when: '+12m',
    title: 'Crypto flows sweep',
    detail: 'On-chain + ETF headlines',
  },
  {
    when: '+1h',
    title: 'Full desk sweep',
    detail: '14 sources · model synthesis',
  },
  {
    when: '+4h',
    title: 'Open-call review',
    detail: 'Re-score every live thesis',
  },
]
