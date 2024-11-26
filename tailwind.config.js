import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  plugins: [tailwindcssAnimate],
  theme: {
    fontFamily: {
      sans: ['var(--font-sans)', 'sans'],
      serif: ['var(--font-serif)', 'sans-serif'],
      mono: ['var(--font-mono)', 'monospace'],
    },
    screens: {
      xl: { max: '1200px' },
      lg: { max: '1074px' },
      md: { max: '768px' },
      sm: { max: '640px' },
    },
    colors: {
      transparent: 'transparent',
      gray: {
        50: 'var(--gray-50)',
        75: 'var(--gray-75)',
        100: 'var(--gray-100)',
        200: 'var(--gray-200)',
        300: 'var(--gray-300)',
        400: 'var(--gray-400)',
        500: 'var(--gray-500)',
        600: 'var(--gray-600)',
        700: 'var(--gray-700)',
        800: 'var(--gray-800)',
        900: 'var(--gray-900)',
      },
      selection: 'var(--selection)',
      border: 'var(--border)',
    },
    extend: {
      textColor: {
        heading: 'var(--heading)',
        body: 'var(--text-body)',
        second: 'var(--text-second)',
        disabled: 'var(--text-disabled)',
      },
      backgroundColor: {
        page: 'var(--page-background)',
      },
      maxWidth: {
        page: 'var(--page-width)',
        content: 'var(--content-width)',
      },
      width: {
        page: 'var(--page-width)',
        content: 'var(--content-width)',
      },
      spacing: {
        page: 'var(--page-top)',
        'half-page': 'var(--page-half-top)',
      },
    },
  },
};
