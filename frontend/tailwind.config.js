/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      screens: {
        '1535': '1535px',
      },
      colors: {
        'patriot': {
          'dark': '#1a1a1a',
          'darker': '#0d0d0d',
          'gray': '#2a2a2a',
          'light-gray': '#3a3a3a',
          'neon-red': '#ff1744',
          'neon-blue': '#00b4ff',
          'neon-red-glow': '#ff4569',
          'neon-blue-glow': '#33c4ff',
        }
      },
      animation: {
        'glow-red': 'glow-red 2s ease-in-out infinite alternate',
        'glow-blue': 'glow-blue 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'glow-red': {
          'from': { 'box-shadow': '0 0 5px #ff1744, 0 0 10px #ff1744, 0 0 15px #ff1744' },
          'to': { 'box-shadow': '0 0 10px #ff1744, 0 0 20px #ff1744, 0 0 30px #ff1744' }
        },
        'glow-blue': {
          'from': { 'box-shadow': '0 0 5px #00b4ff, 0 0 10px #00b4ff, 0 0 15px #00b4ff' },
          'to': { 'box-shadow': '0 0 10px #00b4ff, 0 0 20px #00b4ff, 0 0 30px #00b4ff' }
        }
      },
      backgroundImage: {
        'gradient-patriot': 'linear-gradient(135deg, #ff1744 0%, #1a1a1a 50%, #00b4ff 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0d0d0d 0%, #2a2a2a 100%)',
      }
    }
  },
  plugins: [require('daisyui'), require('@tailwindcss/typography')],
  daisyui: {
    themes: ["dark"],
  }
}
