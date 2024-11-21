/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/views/**/*.{html,js,ejs}"],
  theme: {
    fontFamily: {
      barlow: ["Barlow", "Inter", "sans-serif"],
      inter: ["Inter", "sans-serif"],
    },
    fontSize: {
      xs: "0.64rem",
      sm: "0.8rem",
      base: "1rem",
      lg: "1.25rem",
      xl: "1.563rem",
      "2xl": "1.953rem",
      "3xl": "2.441rem",
      "4xl": "3.052rem",
      "5xl": "3.815rem",
    },
    fontWeight: {
      thin: "200",
      normal: "500",
      bold: "800",
    },
    spacing: {
      sm: "8px",
      md: "12px",
      lg: "16px",
      xl: "24px",
      0.5: "4px",
      1: "8px",
      2: "12px",
      3: "16px",
      4: "24px",
      5: "32px",
      6: "40px",
      7: "48px",
      8: "56px",
    },
    colors: {
      gray: {
        200: "#f7f7f7",
        400: "#8f8f8f",
        600: "#606060",
        800: "#292929",
        900: "#212121",
      },
      blue: {
        300: "#03dac5",
        500: "#667eea",
        700: "#172554",
      },
      red: {
        500: "",
      },
    },
    extend: {},
  },
  plugins: [],
};
