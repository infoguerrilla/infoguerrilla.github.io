/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--color-canvas)',
        surface: 'var(--color-surface)',
        ink: 'var(--color-ink)',
        'ink-muted': 'var(--color-muted)',
        'manifesto-red': 'var(--color-red)',
        'manifesto-red-deep': 'var(--color-red-deep)',
        'border-brutal': 'var(--color-border)',
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'constructivist-sm': '3px 3px 0 var(--color-border)',
        'constructivist-md': '5px 5px 0 var(--color-border)',
        'constructivist-red': '5px 5px 0 var(--color-red)',
        'constructivist-double': '4px 4px 0 var(--color-border), 8px 8px 0 var(--color-red)',
      },
    },
  },
  plugins: [],
};
