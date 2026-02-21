/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#edf9ff',
          100: '#d8f0ff',
          500: '#00a6c7',
          700: '#00748a',
          900: '#123f4b'
        },
        slate: {
          950: '#0b1017'
        }
      },
      fontFamily: {
        sans: ['"Sora"', 'ui-sans-serif', 'system-ui'],
        display: ['"Chakra Petch"', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        card: '0 8px 30px rgba(10, 20, 35, 0.08)'
      }
    }
  },
  plugins: []
};
