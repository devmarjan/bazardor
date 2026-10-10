module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: { extend: { colors: { brand: "#0a8a43", surface: "#f1f5f0" } } },
  plugins: [require("daisyui")],
  daisyui: { themes: ["light"] },
};
