import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'RedlineOS — Road to $1,000,000'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#080810',
          padding: '60px',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background grid lines */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(239,68,68,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.06) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          display: 'flex',
        }} />

        {/* Red radial glow top right */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Red radial glow bottom left */}
        <div style={{
          position: 'absolute',
          bottom: '-150px',
          left: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)',
          display: 'flex',
        }} />

        {/* Top row: logo + domain */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              color: '#EF4444',
            }}>⚡</div>
            <span style={{ color: '#F1F5F9', fontSize: '22px', fontWeight: 700, letterSpacing: '-0.5px' }}>RedlineOS</span>
          </div>
          <span style={{ color: '#475569', fontSize: '14px', letterSpacing: '0.1em' }}>redlineos.space</span>
        </div>

        {/* Center: main headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '8px',
          }}>
            <div style={{
              backgroundColor: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '100px',
              padding: '4px 14px',
              color: '#EF4444',
              fontSize: '12px',
              letterSpacing: '0.15em',
              display: 'flex',
            }}>OPERATOR COMMAND CENTER</div>
          </div>
          <div style={{ color: '#F1F5F9', fontSize: '64px', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-2px', display: 'flex', flexDirection: 'column' }}>
            <span>Road to</span>
            <span style={{ color: '#EF4444' }}>$1,000,000</span>
          </div>
          <div style={{ color: '#64748B', fontSize: '20px', marginTop: '8px', display: 'flex' }}>
            Track every dollar. Every mile. Every step of the journey.
          </div>
        </div>

        {/* Bottom row: three feature pills */}
        <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
          {['⚡ Live Profit Tracking', '🚛 Fleet Command', '🔒 Private Vault'].map((feature) => (
            <div key={feature} style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '8px',
              padding: '10px 18px',
              color: '#94A3B8',
              fontSize: '14px',
              display: 'flex',
            }}>{feature}</div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  )
}
