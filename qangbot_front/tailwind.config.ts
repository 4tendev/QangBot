import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes : [
      "synthwave",
      "cupcake",
      "dark",
      "light",
      "bumblebee",
      "retro",
      "cyberpunk",
      "garden",
      "forest",
      "lofi",
      "fantasy",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "nord",
    ], 
    darkTheme: "dark", 
    base: true, 
    styled: true, 
    utils: true, 
    prefix: "", 
    logs: true,
    themeRoot: ":root",
  },
};
export default config;

export type Theme = "dark"|"light"|"cupcake"|"bumblebee"|"emerald"|"corporate"|"synthwave"|"retro"|"cyberpunk"|"valentine"|"halloween"|"garden"|"forest"|"aqua"|"lofi"|"pastel"|"fantasy"|"wireframe"|"black"|"luxury"|"dracula"|"cmyk"|"autumn"|"business"|"acid"|"lemonade"|"night"|"coffee"|"winter"|"dim"|"nord"|"sunset"

