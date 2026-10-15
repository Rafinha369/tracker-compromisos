/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    // Escala tipográfica fija: 14, 16, 20, 28, 40, 64
    fontSize: {
      sm: ["14px", { lineHeight: "20px" }],
      base: ["16px", { lineHeight: "24px" }],
      lg: ["20px", { lineHeight: "28px" }],
      xl: ["28px", { lineHeight: "34px" }],
      "2xl": ["40px", { lineHeight: "44px" }],
      "3xl": ["64px", { lineHeight: "64px" }],
    },
    extend: {
      colors: {
        paper: "#E8ECEF", // Papel frío: fondo
        sheet: "#FFFFFF", // Hoja: superficies
        ink: "#17212B", // Tinta: texto
        "ink-muted": "#4F5C68", // Tinta suave: texto secundario (AA sobre papel y hoja)
        accent: { DEFAULT: "#24497A", hover: "#1B3A63" }, // Azul tinta: acciones
        marker: { DEFAULT: "#F6DE55", soft: "#FBEFA8" }, // Resaltador: solo evidencia
        line: "#C7CFD6", // Grafito claro: bordes
        ok: "#2E7A52",
        warn: "#8A5A0E",
        bad: "#A3352E",
      },
      // Único movimiento orquestado: el resaltador pasa sobre las frases al cargar el login
      keyframes: {
        sweep: { "0%": { backgroundSize: "0% 70%" }, "100%": { backgroundSize: "100% 70%" } },
      },
      animation: { sweep: "sweep 700ms ease-out both" },
      fontFamily: {
        display: ['"Schibsted Grotesk"', "Georgia", "serif"],
        body: ['"Public Sans"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
