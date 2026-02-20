import forms from "@tailwindcss/forms";
import daisyui from "daisyui";
import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */

export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/**/*.blade.php",
        "./resources/**/*.{html,js,ts,jsx,tsx}",
        "./resources/**/*.vue",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Nunito", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: {
                    DEFAULT: "#2f4858",
                },
                base: {
                    DEFAULT: "#2F4858",
                    dark: "#2F4858",
                    light: "rgb(240 247 255)",
                },
                brandGreen: {
                    50: "#E0F2F0", // Ultra-light tint for backgrounds
                    100: "#B3DFD8", // Soft highlight
                    200: "#80C9BD", // Muted secondary
                    300: "#4DB3A2", // Vibrant secondary
                    400: "#269A84", // Strong UI element
                    500: "#008166", // Base Color
                    600: "#00735B", // Hover states
                    700: "#00614D", // Active/Focus states
                    800: "#004F3F", // Deep contrast
                    900: "#003A2E", // Near-black forest green
                },
                customGray: {
                    100: "#F5F7F5",
                    200: "#E1E5E1",
                    300: "#C1CCC4",
                    400: "#9FAAA2",
                    500: "#7B857D",
                    600: "#5A5F5B",
                    700: "#424242",
                    800: "#2D2D2D",
                    900: "#1A1A1A",
                },
            },
        },
        container: {
            center: true,
        },
    },

    plugins: [forms, daisyui],

    // DaisyUI configuration
    daisyui: {
        themes: ["light", "dark"],
        darkTheme: "dark",
        base: true,
        styled: true,
        utils: true,
        prefix: "",
        logs: true,
        themeRoot: ":root",
    },
};
