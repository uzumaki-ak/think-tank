/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F2F2F2",
        "matte-black": "#050505",
        "industrial-gray": "#1A1A1A",
        bone: "#F2F2F2",
        dark: {
          light: "rgba(242, 242, 242, 0.65)",
          hard: "#050505",
          soft: "#0A0A0A",
        },
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        cormorant: ["Cormorant Garamond", "serif"],
        ibm: ["IBM Plex Mono", "monospace"],
        bricolage: ["Bricolage Grotesque", "sans-serif"],
        geist: ["Geist Mono", "monospace"],
        inter: ["Inter", "sans-serif"],
        ops: ["Inter", "sans-serif"],
        rob: ["Bricolage Grotesque", "sans-serif"],
      },
      borderWidth: {
        '0.5': '0.5px',
      },
    },
  },

  plugins: [require("@tailwindcss/typography"), require("daisyui")],

  daisyui: {
    themes: [], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    // darkTheme: "dark", // name of one of the included themes for dark mode
    base: false, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    // prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    // logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    // themeRoot: ":root", // The element that receives theme color CSS variables
    prefix: 'd-'
  },
};
