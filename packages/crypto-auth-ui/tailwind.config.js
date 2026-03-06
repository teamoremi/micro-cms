/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  prefix: 'mcms-',
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Prevent overriding host app base styles
  },
}
