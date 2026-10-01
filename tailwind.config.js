/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Design tokens — change these two lines to re-theme the entire site.
        brand: {
          50: '#eef4ff', 100: '#dbe6fe', 200: '#bed0fe', 300: '#93b0fd',
          400: '#6086fa', 500: '#3b63f5', 600: '#2745ea', 700: '#2035d6',
          800: '#212eac', 900: '#212c87'
        },
        ink: {
          50: '#f7f8fa', 100: '#eef0f3', 200: '#d9dde3', 300: '#b7bfc9',
          400: '#8f9aa8', 500: '#6b7686', 600: '#525c6c', 700: '#414957',
          800: '#2b313c', 900: '#181c22', 950: '#0e1116'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace']
      }
    }
  },
  plugins: []
}
