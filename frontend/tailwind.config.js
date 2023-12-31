/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    fontFamily: {
      'mono': ['inconsolata'],
      'fredoka' : ['Fredoka']
    }
  },
  daisyui: {
    themes: ["light"],
  },
  plugins: [require('@tailwindcss/line-clamp'),require("daisyui")],
  important: true,
}