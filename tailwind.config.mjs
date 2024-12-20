/** @type {import('tailwindcss').Config} */

import defaultTheme from 'tailwindcss/defaultTheme';
import colors from 'tailwindcss/colors';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['EB Garamond', ...defaultTheme.fontFamily.serif],
      },
      colors: {
        text:       colors.stone[950],  // #0c0a09
        bg:         colors.orange[100], // #ffedd5
        accent:     colors.orange[400], // #fb923c
        darktext:   colors.orange[100], // #ffedd5
        darkbg:     colors.stone[900],  // #1c1917
        darkaccent: colors.orange[400], // #fb923c
      },
    },
  },
  plugins: [],
}
