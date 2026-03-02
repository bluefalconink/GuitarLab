/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  safelist: [
    'bg-gsb-gold', 'bg-gsb-accent', 'text-gsb-gold', 'text-gsb-accent',
    'shadow-gsb-gold/25', 'shadow-gsb-accent/25',
  ],
  theme: {
    extend: {
      colors: {
        // GuitarLab brand palette
        'gsb-dark': '#1a1a2e',
        'gsb-darker': '#16213e',
        'gsb-accent': '#e94560',
        'gsb-gold': '#f5a623',
        'gsb-teal': '#0f3460',
        'gsb-surface': '#1e2a3a',
        'gsb-surface-light': '#2a3a4e',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
