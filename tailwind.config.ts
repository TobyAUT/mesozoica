import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0b0c0e',
          800: '#121417',
          700: '#1b1e22',
          600: '#262a30',
        },
        bone: '#f4efe6',
        muted: '#a9a29a',
        // Era accents (muted, per the design spec)
        triassic: '#d4794a',
        jurassic: '#cbab55',
        // Brightened from #5a9a97 — the muted teal read as a hard-to-see "green" on the
        // photographic backdrops; this lifts contrast while staying on-theme.
        cretaceous: '#74c0ba',
        extinction: '#d97b48',
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['"Fraunces Variable"', 'Fraunces', 'Georgia', 'serif'],
        // Distinct geometric sans for eyebrows / UI labels, for typographic variety.
        grotesk: ['"Space Grotesk Variable"', '"Space Grotesk"', 'system-ui', 'sans-serif'],
      },
      backdropBlur: { xs: '2px' },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: { 'fade-up': 'fade-up 0.6s cubic-bezier(0.16,1,0.3,1) both' },
    },
  },
  plugins: [],
} satisfies Config;
