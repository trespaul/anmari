module.exports = {
  content: ['layouts/**/*.html'],
  theme: {
    fontFamily: {
      serif: ['EB Garamond', 'serif'],
    },
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
