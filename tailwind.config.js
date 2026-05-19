/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0052CC',
        avatar: '#6554C0',
        'status-done': '#E3FCEF',
        'status-done-text': '#006644',
        'status-needed': '#DEEBFF',
        'status-needed-text': '#0052CC',
        'status-review': '#EAE6FF',
        'status-review-text': '#403294',
        'priority-medium': '#FF991F',
        border: '#DFE1E6',
        bg: '#FFFFFF',
        'bg-sidebar': '#F7F8F9',
        'row-hover': '#F4F5F7',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
