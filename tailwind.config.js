/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  corePlugins: {
    // preflight: false,‰
  },
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'blob1': 'blob1 20s infinite ease-in-out',
        'blob2': 'blob2 25s infinite ease-in-out',
        'blob3': 'blob3 30s infinite ease-in-out',
        'blob4': 'blob4 35s infinite ease-in-out',
      },
      keyframes: {
        blob1: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        blob2: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-30px, 50px) scale(1.1)' },
          '66%': { transform: 'translate(20px, -20px) scale(0.9)' },
        },
        blob3: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, 30px) scale(1.1)' },
          '66%': { transform: 'translate(-30px, -30px) scale(0.9)' },
        },
        blob4: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-20px, -30px) scale(1.1)' },
          '66%': { transform: 'translate(30px, 30px) scale(0.9)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
