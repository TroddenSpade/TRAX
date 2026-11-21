export type Category = 'commodities' | 'crypto' | 'forex' | 'indices' | 'equities'
export type Stance = 'bullish' | 'bearish' | 'neutral'

export type Asset = {
  id: string
  symbol: string
  name: string
  category: Category
  price: number
  change: number
  decimals: number
  prefix: string
  color: string
  stance: Stance
  series: number[]
}

export const CATEGORY_LABELS: Record<Category, string> = {
  commodities: 'Commodities',
  crypto: 'Crypto',
  forex: 'Forex',
  indices: 'Indices',
  equities: 'Stocks',
}

export const STANCE_LABELS: Record<Stance, string> = {
  bullish: 'Bullish',
  bearish: 'Bearish',
  neutral: 'Neutral',
}

function buildSeries(seed: number, drift: number, count = 28): number[] {
  let state = seed
  const random = () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }

  const points: number[] = []
  let value = 50 + (random() - 0.5) * 10

  for (let index = 0; index < count; index += 1) {
    value += drift + (random() - 0.5) * 14
    points.push(value)
  }

  return points
}

export const ASSETS: Asset[] = [
  {
    id: 'gold',
    symbol: 'XAU',
    name: 'Gold',
    category: 'commodities',
    price: 4186.2,
    change: 0.84,
    decimals: 2,
    prefix: '$',
    color: '#E8C15A',
    stance: 'bullish',
    series: buildSeries(11, 1.15),
  },
  {
    id: 'silver',
    symbol: 'XAG',
    name: 'Silver',
    category: 'commodities',
    price: 53.48,
    change: 1.62,
    decimals: 2,
    prefix: '$',
    color: '#C3CFDA',
    stance: 'bullish',
    series: buildSeries(23, 1.55),
  },
  {
    id: 'wti',
    symbol: 'WTI',
    name: 'Crude Oil',
    category: 'commodities',
    price: 61.72,
    change: -0.38,
    decimals: 2,
    prefix: '$',
    color: '#C08A5E',
    stance: 'bearish',
    series: buildSeries(37, -0.75),
  },
  {
    id: 'nat-gas',
    symbol: 'NG',
    name: 'Natural Gas',
    category: 'commodities',
    price: 3.42,
    change: 2.1,
    decimals: 2,
    prefix: '$',
    color: '#6FC7E8',
    stance: 'bullish',
    series: buildSeries(41, 1.9),
  },
  {
    id: 'copper',
    symbol: 'HG',
    name: 'Copper',
    category: 'commodities',
    price: 5.18,
    change: 0.47,
    decimals: 2,
    prefix: '$',
    color: '#D08A62',
    stance: 'neutral',
    series: buildSeries(53, 0.35),
  },
  {
    id: 'bitcoin',
    symbol: 'BTC',
    name: 'Bitcoin',
    category: 'crypto',
    price: 96480,
    change: 1.24,
    decimals: 0,
    prefix: '$',
    color: '#F7931A',
    stance: 'neutral',
    series: buildSeries(67, 0.95),
  },
  {
    id: 'ethereum',
    symbol: 'ETH',
    name: 'Ethereum',
    category: 'crypto',
    price: 3265.4,
    change: -0.72,
    decimals: 2,
    prefix: '$',
    color: '#8E9BFF',
    stance: 'neutral',
    series: buildSeries(71, -0.6),
  },
  {
    id: 'solana',
    symbol: 'SOL',
    name: 'Solana',
    category: 'crypto',
    price: 198.3,
    change: 3.42,
    decimals: 2,
    prefix: '$',
    color: '#2FE0A2',
    stance: 'bullish',
    series: buildSeries(83, 2.1),
  },
  {
    id: 'eur-usd',
    symbol: 'EUR',
    name: 'Euro / U.S. Dollar',
    category: 'forex',
    price: 1.1584,
    change: 0.18,
    decimals: 4,
    prefix: '',
    color: '#5B8DEF',
    stance: 'bullish',
    series: buildSeries(97, 0.5),
  },
  {
    id: 'gbp-usd',
    symbol: 'GBP',
    name: 'British Pound / U.S. Dollar',
    category: 'forex',
    price: 1.3216,
    change: -0.09,
    decimals: 4,
    prefix: '',
    color: '#E07AB4',
    stance: 'neutral',
    series: buildSeries(103, -0.15),
  },
  {
    id: 'usd-jpy',
    symbol: 'JPY',
    name: 'U.S. Dollar / Japanese Yen',
    category: 'forex',
    price: 151.28,
    change: -0.26,
    decimals: 2,
    prefix: '',
    color: '#F07A6C',
    stance: 'bearish',
    series: buildSeries(109, -0.5),
  },
  {
    id: 'spx',
    symbol: 'SPX',
    name: 'S&P 500',
    category: 'indices',
    price: 6812.4,
    change: 0.31,
    decimals: 0,
    prefix: '',
    color: '#7FD1A8',
    stance: 'bullish',
    series: buildSeries(127, 0.6),
  },
  {
    id: 'ndx',
    symbol: 'NDX',
    name: 'Nasdaq 100',
    category: 'indices',
    price: 25184.6,
    change: 0.58,
    decimals: 0,
    prefix: '',
    color: '#7AA7FF',
    stance: 'bullish',
    series: buildSeries(131, 0.85),
  },
  {
    id: 'nvda',
    symbol: 'NVDA',
    name: 'NVIDIA',
    category: 'equities',
    price: 182.4,
    change: 1.86,
    decimals: 2,
    prefix: '$',
    color: '#8CC63F',
    stance: 'bullish',
    series: buildSeries(137, 1.45),
  },
  {
    id: 'tsla',
    symbol: 'TSLA',
    name: 'Tesla',
    category: 'equities',
    price: 428.6,
    change: -1.12,
    decimals: 2,
    prefix: '$',
    color: '#E85D5D',
    stance: 'bearish',
    series: buildSeries(149, -1.05),
  },
]

export const CATEGORY_ORDER: Category[] = [
  'commodities',
  'crypto',
  'forex',
  'indices',
  'equities',
]

export function getAsset(id: string): Asset | undefined {
  return ASSETS.find((asset) => asset.id === id)
}

export function formatPrice(asset: Asset): string {
  return `${asset.prefix}${asset.price.toLocaleString('en-US', {
    minimumFractionDigits: asset.decimals,
    maximumFractionDigits: asset.decimals,
  })}`
}

export function formatChange(change: number): string {
  return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`
}
