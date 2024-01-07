/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        primary: "#0D714D",
      },
      colors: {
        primary: "#0D714D",
        lightGray: "#6A6A6A",
        darkGray: "#616161",
      },
    },
  },
  plugins: [],
};
