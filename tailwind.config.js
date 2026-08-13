/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'surface': '#FAF9F5',
        'surface-low': '#F4F4F0',
        'container': '#EFEEEA',
        'text-ink': '#1B1C1A',
        'text-muted': '#5D4038',
        'brand-primary': '#AD2C00',
        'brand-yellow': '#FCD400',
        'brand-border': '#1B1C1A',
      },
      fontFamily: {
        headline: ['Anton', 'sans-serif'],
        body: ['Archivo Narrow', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0px',
        'none': '0px',
        'sm': '0px',
        'md': '0px',
        'lg': '0px',
        'xl': '0px',
        '2xl': '0px',
        '3xl': '0px',
        'full': '0px',
      }
    },
  },
  plugins: [],
};
