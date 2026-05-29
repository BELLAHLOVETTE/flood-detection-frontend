import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // Flood-Watch brand colours
                risk: {
                    low: "#22c55e",
                    medium: "#eab308",
                    high: "#f97316",
                    critical: "#ef4444",
                },
                brand: {
                    blue: "#2E75B6",
                    dark: "#1F3864",
                }
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [],
};

export default config;