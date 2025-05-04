/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#f5f5f5',
            100: '#e6e6e6',
            200: '#cccccc',
            300: '#b3b3b3',
            400: '#999999',
            500: '#808080',
            600: '#666666',
            700: '#4d4d4d',
            800: '#333333',
            900: '#1a1a1a',
            950: '#0d0d0d',
          },
          accent: {
            50: '#fff1f1',
            100: '#ffe1e1',
            200: '#ffc7c7',
            300: '#ffa0a0',
            400: '#ff7a7a',
            500: '#ff5252',
            600: '#ff3939',
            700: '#ff1f1f',
            800: '#ff0808',
            900: '#e50000',
            950: '#c70000',
          },
          gold: {
            50: '#fefae0',
            100: '#fdf7c3',
            200: '#fcef85',
            300: '#fae147',
            400: '#f7cf1b',
            500: '#e2ba0d',
            600: '#c49509',
            700: '#9c700a',
            800: '#825a10',
            900: '#704b13',
          }
        },
        fontFamily: {
          sans: ['Montserrat', 'system-ui', 'sans-serif'],
          serif: ['Playfair Display', 'Georgia', 'serif'],
        },
        animation: {
          float: 'float 6s ease-in-out infinite',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-20px)' },
          }
        }
      },
    },
    plugins: [],
  };