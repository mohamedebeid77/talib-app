/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: {
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
          surfaceHover: 'var(--color-surface-hover)',
          border: 'var(--color-border)',
          accent: 'var(--color-accent)',
          accentHover: 'var(--color-accent-hover)',
          accentMuted: 'var(--color-accent-muted)',
          accentGold: 'var(--color-accent-gold)',
          text: 'var(--color-text)',
          muted: 'var(--color-muted)',
          success: 'var(--color-success)',
        }
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        amiri: ['Amiri', 'serif'],
        ibm: ['"IBM Plex Sans Arabic"', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
        'glow-gold': '0 0 25px -5px rgba(212, 175, 55, 0.25)',
        'glow-emerald': '0 0 25px -5px rgba(45, 212, 191, 0.25)',
      }
    },
  },
  plugins: [],
}
