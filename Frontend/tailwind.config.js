/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0E13',        // app background (near-black)
        paper: '#151A21',      // dark card surface
        surface: '#151A21',
        line: 'rgba(255,255,255,0.12)',
        pulse: '#FF3D71',      // magenta accent (primary)
        volt: '#B6FF3C',       // lime accent (secondary)
        slate: '#8A93A3',      // muted text
      },
      fontFamily: {
        display: ['"Archivo Black"', '"Arial Black"', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        card: '14px',
      },
    },
  },
  plugins: [],
};
