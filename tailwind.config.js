/** @type {import('tailwindcss').Config} */

const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                nestadarkblue: {
                    DEFAULT: '#0C304C',
                },
            },
            fontFamily: {
                sans: ['Roboto', ...defaultTheme.fontFamily.sans],
                serif: ['Playfair Display', ...defaultTheme.fontFamily.serif],
            },
        },
    },
    plugins: [],
};
