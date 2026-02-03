/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: 'mcms-',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable preflight to avoid resetting host app styles
  }
}
