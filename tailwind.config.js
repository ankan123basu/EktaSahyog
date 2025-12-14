/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                unity: {
                    indigo: '#4338ca', // indigo-700
                    emerald: '#059669', // emerald-600
                    saffron: '#f59e0b', // amber-500
                    coral: '#f43f5e', // rose-500
                    dark: '#0f172a', // slate-900
                    light: '#f8fafc', // slate-50
                    'indigo-dim': '#312e81',
                    'emerald-dim': '#064e3b',
                }
            },
            fontFamily: {
                display: ['"Outfit"', 'sans-serif'],
                body: ['"Outfit"', 'sans-serif'],
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
