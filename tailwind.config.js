// tailwind.config.js
module.exports = {
  darkMode: 'class', // <-- esto habilita modo oscuro basado en clase "dark"
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@shadcn/ui/dist/**/*.js',
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease forwards',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
