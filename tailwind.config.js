import colors from "tailwindcss/colors";
import tailwindPseudoElements from "tailwindcss-pseudo-elements";

export default {
  content: ["./public/index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    colors: {
      primary: {
        light: colors.blue["300"],
        DEFAULT: "#4C71F4",
        dark: colors.blue["900"],
      },
      secondary: {
        light: colors.green["200"],
        DEFAULT: colors.green["500"],
        dark: colors.green["900"],
      },
      gray: colors.gray,
      white: colors.white,
      cyan: colors.cyan,
      transparent: "transparent",
      current: "currentColor",
      success: {
        light: colors.green["400"],
        DEFAULT: colors.green["500"],
        dark: colors.green["600"],
      },
      warning: {
        light: colors.orange["100"],
        DEFAULT: colors.yellow["500"],
        dark: colors.yellow["600"],
      },
      danger: {
        light: colors.red["200"],
        DEFAULT: colors.red["500"],
        dark: colors.red["600"],
      },
      green: colors.green,
      red: colors.red,
      blue: colors.blue,
    },
    extend: {
      minHeight: {
        extension: "600px",
      },
      minWidth: {
        extension: "700px",
      },
      maxWidth: {
        imagesUrl: "200px",
      },
      padding: {
        heading1: "0",
        heading2: ".75rem",
        heading3: "1.5rem",
        heading4: "2.25rem",
        heading5: "4rem",
        heading6: "4.75rem",
      },
      keyframes: {
        appearDisappearOpacity: {
          "0%, 100%": {
            opacity: 1,
          },
          "50%": {
            opacity: 0,
          },
        },
      },
      animation: {
        notificationDot: "appearDisappearOpacity 1.4s infinite linear",
      },
    },
  },
  variants: {
    extend: {
      visibility: ["group-hover"],
      overflow: ["hover"],
    },
  },
  plugins: [tailwindPseudoElements],
};
