/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FF3B30", // Red color for primary actions
          dark: "#D42E25",
        },
        secondary: {
          DEFAULT: "#181818", // Dark color for backgrounds
          light: "#2D2D2D",
        },
      },
    },
  },
  plugins: [],
};
