import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";
import lineClamp from "@tailwindcss/line-clamp";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#006C67",
        secondary: "#B2BB1C",
        "bg-base": "#EDEDED",
      },
    },
  },
  plugins: [
    typography,
    lineClamp,
  ],
};

export default config;