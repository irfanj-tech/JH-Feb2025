/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      spacing: {
        "ad-width": "120px", // Define a custom spacing value for the ad width
      },
    },
  },
  plugins: [],
};
