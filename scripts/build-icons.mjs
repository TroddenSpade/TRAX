import { readFileSync } from 'node:fs'
import sharp from 'sharp'

const logoSvg = readFileSync('public/logo.svg', 'utf8')
const squareSvg = logoSvg.replaceAll('rx="112"', 'rx="0"')
const maskableSvg = squareSvg
  .replace(
    /(<rect width="512" height="512" rx="0" fill="url\(#glow\)"\/>)/,
    '$1\n  <g transform="translate(256 256) scale(0.78) translate(-256 -256)">',
  )
  .replace('</svg>', '</g>\n</svg>')

const jobs = [
  ['public/logo.png', logoSvg, 1024],
  ['public/pwa-192x192.png', squareSvg, 192],
  ['public/pwa-512x512.png', squareSvg, 512],
  ['public/maskable-icon-512x512.png', maskableSvg, 512],
  ['public/apple-touch-icon.png', squareSvg, 180],
  ['public/favicon.png', squareSvg, 64],
]

for (const [out, svg, size] of jobs) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(out)
  console.log(`wrote ${out} (${size}x${size})`)
}
