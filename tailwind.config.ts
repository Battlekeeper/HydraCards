/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: "class",
  content: [
		'./pages/**/*.{html,js,jsx,ts,tsx}',
    './components/**/*.{html,js,jsx,ts,tsx}',
		'./src/**/*.{vue,js,jsx,ts,tsx}'
	],
  theme: {
  extend: {
      colors: {
        HCOrange: '#F16523',
				DarkGrey: '#2A3342',
				LightGrey: '#404F65',
				HCDarkOrange: '#CF551B',
				HCLightOrange: '#EEA684',
				Green: '#22C55E',
				XLightGrey: '#D9D9D9'
      },
    },
  },
  plugins: [],
}

