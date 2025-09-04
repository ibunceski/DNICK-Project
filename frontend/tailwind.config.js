/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#14B8A6', // Teal for buttons and accents
                secondary: '#6B7280', // Gray for secondary text
            },
        },
    },
    plugins: [],
}