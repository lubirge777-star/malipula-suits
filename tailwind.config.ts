import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
        extend: {
                colors: {
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))'
                        },
                        popover: {
                                DEFAULT: 'hsl(var(--popover))',
                                foreground: 'hsl(var(--popover-foreground))'
                        },
                        primary: {
                                DEFAULT: 'hsl(var(--primary))',
                                foreground: 'hsl(var(--primary-foreground))'
                        },
                        secondary: {
                                DEFAULT: 'hsl(var(--secondary))',
                                foreground: 'hsl(var(--secondary-foreground))'
                        },
                        muted: {
                                DEFAULT: 'hsl(var(--muted))',
                                foreground: 'hsl(var(--muted-foreground))'
                        },
                        accent: {
                                DEFAULT: 'hsl(var(--accent))',
                                foreground: 'hsl(var(--accent-foreground))'
                        },
                        destructive: {
                                DEFAULT: 'hsl(var(--destructive))',
                                foreground: 'hsl(var(--destructive-foreground))'
                        },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        },
                        // Malipula Brand Colors
                        gold: {
                                DEFAULT: 'var(--gold)',
                                light: 'var(--gold-light)',
                                dark: 'var(--gold-dark)',
                        },
                        navy: {
                                DEFAULT: 'var(--navy)',
                                light: 'var(--navy-light)',
                        },
                        ivory: 'var(--ivory)',
                        charcoal: 'var(--charcoal)',
                },
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)'
                },
                animation: {
                        'shimmer': 'shimmer 3s infinite linear',
                        'float': 'float 3s ease-in-out infinite',
                        'glow': 'glow 2s ease-in-out infinite',
                        'gradient': 'gradient-shift 8s ease infinite',
                        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
                        'scale-in': 'scale-in 0.5s ease-out forwards',
                        'slide-in-right': 'slide-in-right 0.6s ease-out forwards',
                        'slide-in-left': 'slide-in-left 0.6s ease-out forwards',
                        'rotate-slow': 'rotate-slow 20s linear infinite',
                        'pulse-gold': 'pulse-gold 2s ease-in-out infinite',
                },
                keyframes: {
                        shimmer: {
                                '0%': { backgroundPosition: '-200% 0' },
                                '100%': { backgroundPosition: '200% 0' },
                        },
                        float: {
                                '0%, 100%': { transform: 'translateY(0px)' },
                                '50%': { transform: 'translateY(-10px)' },
                        },
                        glow: {
                                '0%, 100%': { boxShadow: '0 0 20px rgba(201, 169, 98, 0.3)' },
                                '50%': { boxShadow: '0 0 40px rgba(201, 169, 98, 0.6)' },
                        },
                        'gradient-shift': {
                                '0%': { backgroundPosition: '0% 50%' },
                                '50%': { backgroundPosition: '100% 50%' },
                                '100%': { backgroundPosition: '0% 50%' },
                        },
                        'fade-in-up': {
                                'from': { opacity: '0', transform: 'translateY(30px)' },
                                'to': { opacity: '1', transform: 'translateY(0)' },
                        },
                        'scale-in': {
                                'from': { opacity: '0', transform: 'scale(0.9)' },
                                'to': { opacity: '1', transform: 'scale(1)' },
                        },
                        'slide-in-right': {
                                'from': { opacity: '0', transform: 'translateX(30px)' },
                                'to': { opacity: '1', transform: 'translateX(0)' },
                        },
                        'slide-in-left': {
                                'from': { opacity: '0', transform: 'translateX(-30px)' },
                                'to': { opacity: '1', transform: 'translateX(0)' },
                        },
                        'rotate-slow': {
                                'from': { transform: 'rotate(0deg)' },
                                'to': { transform: 'rotate(360deg)' },
                        },
                        'pulse-gold': {
                                '0%, 100%': { boxShadow: '0 0 0 0 rgba(201, 169, 98, 0.4)' },
                                '50%': { boxShadow: '0 0 0 20px rgba(201, 169, 98, 0)' },
                        },
                },
        }
  },
  plugins: [tailwindcssAnimate],
};
export default config;
