/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
		'./pages/**/*.{html,js,jsx,ts,tsx}',
    './components/**/*.{html,js,jsx,ts,tsx}',
		'./src/**/*.{vue,js,jsx,ts,tsx}'
	],
  theme: {
  extend: {
      colors: {
        orange: '#F16523',
      },
    },
  },
  plugins: [],
}

