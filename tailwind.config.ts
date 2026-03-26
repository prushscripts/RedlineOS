import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-base': '#0A0A0F',
        'bg-surface': '#111118',
        'bg-elevated': '#1A1A24',
        'border-subtle': '#1E1E2E',
        'accent': '#EF4444',
        'accent-glow': 'rgba(239, 68, 68, 0.15)',
        'success': '#10B981',
        'warning': '#F59E0B',
        'danger': '#EF4444',
        'text-primary': '#F1F5F9',
        'text-muted': '#64748B',
        'text-faint': '#334155',
      },
      fontFamily: {
        'display': ['Syne', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
        'sans': ['DM Sans', 'sans-serif'],
      },
      fontVariantNumeric: {
        'tabular': 'tabular-nums',
      },
    },
  },
  plugins: [],
}
export default config
