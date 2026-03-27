const { createCanvas } = require('canvas')
const fs = require('fs')
const path = require('path')

const width = 1200
const height = 630
const canvas = createCanvas(width, height)
const ctx = canvas.getContext('2d')

// Background
ctx.fillStyle = '#080810'
ctx.fillRect(0, 0, width, height)

// Grid lines
ctx.strokeStyle = 'rgba(239,68,68,0.07)'
ctx.lineWidth = 1
for (let x = 0; x < width; x += 60) {
  ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke()
}
for (let y = 0; y < height; y += 60) {
  ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke()
}

// Red glow top right
const glowTR = ctx.createRadialGradient(1100, 0, 0, 1100, 0, 500)
glowTR.addColorStop(0, 'rgba(239,68,68,0.18)')
glowTR.addColorStop(1, 'rgba(239,68,68,0)')
ctx.fillStyle = glowTR
ctx.fillRect(0, 0, width, height)

// Red glow bottom left
const glowBL = ctx.createRadialGradient(0, 630, 0, 0, 630, 400)
glowBL.addColorStop(0, 'rgba(239,68,68,0.1)')
glowBL.addColorStop(1, 'rgba(239,68,68,0)')
ctx.fillStyle = glowBL
ctx.fillRect(0, 0, width, height)

// Top left logo text
ctx.fillStyle = '#EF4444'
ctx.font = 'bold 22px sans-serif'
ctx.fillText('⚡ RedlineOS', 60, 80)

// Top right domain
ctx.fillStyle = '#475569'
ctx.font = '14px sans-serif'
ctx.textAlign = 'right'
ctx.fillText('redlineos.space', width - 60, 80)
ctx.textAlign = 'left'

// Pill badge
ctx.fillStyle = 'rgba(239,68,68,0.15)'
ctx.beginPath()
ctx.roundRect(60, 200, 280, 32, 16)
ctx.fill()
ctx.strokeStyle = 'rgba(239,68,68,0.3)'
ctx.lineWidth = 1
ctx.beginPath()
ctx.roundRect(60, 200, 280, 32, 16)
ctx.stroke()
ctx.fillStyle = '#EF4444'
ctx.font = '12px sans-serif'
ctx.letterSpacing = '0.15em'
ctx.fillText('OPERATOR COMMAND CENTER', 80, 221)

// Main headline line 1
ctx.fillStyle = '#F1F5F9'
ctx.font = 'bold 80px sans-serif'
ctx.fillText('Road to', 60, 330)

// Main headline line 2 — red
ctx.fillStyle = '#EF4444'
ctx.font = 'bold 80px sans-serif'
ctx.fillText('$1,000,000', 60, 420)

// Subtitle
ctx.fillStyle = '#64748B'
ctx.font = '20px sans-serif'
ctx.fillText('Track every dollar. Every mile. Every step of the journey.', 60, 470)

// Bottom pills
const pills = ['⚡ Live Profit Tracking', '🚛 Fleet Command', '🔒 Private Vault']
let pillX = 60
pills.forEach(pill => {
  const pillWidth = ctx.measureText(pill).width + 36
  ctx.fillStyle = 'rgba(255,255,255,0.04)'
  ctx.beginPath()
  ctx.roundRect(pillX, 530, pillWidth, 40, 8)
  ctx.fill()
  ctx.strokeStyle = 'rgba(255,255,255,0.08)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.roundRect(pillX, 530, pillWidth, 40, 8)
  ctx.stroke()
  ctx.fillStyle = '#94A3B8'
  ctx.font = '14px sans-serif'
  ctx.fillText(pill, pillX + 18, 555)
  pillX += pillWidth + 12
})

// Horizontal red accent line
ctx.strokeStyle = 'rgba(239,68,68,0.4)'
ctx.lineWidth = 1
ctx.beginPath()
ctx.moveTo(60, 490)
ctx.lineTo(500, 490)
ctx.stroke()

const buffer = canvas.toBuffer('image/png')
fs.writeFileSync(path.join(__dirname, '../public/og-image.png'), buffer)
console.log('OG image generated at public/og-image.png')
