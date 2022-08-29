module.exports = {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        success: {
          100: "#d4edda",
          200: "#c3e6cb",
          300: "#a5d6a7",
          400: "#4BB543",
        },
        error: {
          100: "#f8d7da",
          200: "#f5b7b1",
          300: "#f2989d",
          400: "#ff3333",
        },
      },
    },
  },
  plugins: [],
};
