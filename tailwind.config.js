/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pumpkin': '#E67E22',
        'squash': '#D35400',
        'leaf': '#8B9E3E',
        'acorn': '#8B5A2B',
        'cider': '#B86F2C',
      },
      fontFamily: {
        'sans': ['Poppins', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
