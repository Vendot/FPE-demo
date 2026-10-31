/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#17324D',
          deep: '#10263A',
          light: '#244566',
        },
        teal: {
          DEFAULT: '#0F8B8D',
          hover: '#0c7375',
          light: '#E6F4F4',
        },
        surface: '#FFFFFF',
        background: '#F5F7FA',
        border: '#E3E8EF',
        text: {
          primary: '#172B3A',
          secondary: '#64748B',
          muted: '#94A3B8',
        },
        status: {
          success: '#16845B',
          'success-bg': '#E8F5EE',
          warning: '#C98216',
          'warning-bg': '#FEF6E9',
          danger: '#C44949',
          'danger-bg': '#FDF0F0',
          info: '#3478B8',
          'info-bg': '#EDF4FB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      maxWidth: {
        'content': '1440px',
      }
    },
  },
  plugins: [],
}
