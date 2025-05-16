/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'grid-white': "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.04)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e\")",
        'grid-black': "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(0 0 0 / 0.04)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e\")",
      },      colors: {
        // Website Builder Colors
        'website-primary': '#0C0C0D',
        'website-secondary': '#6B6B6B',
        'website-background': '#F7F7F7',
        'website-muted': '#E5E5E5',
        
        // Custom colors (manteniamo quelli precedenti)
        'custom-dark-blue': '#03045E',
        'custom-medium-blue': '#0077B6',
        'custom-light-blue': '#00B4D8',
        'custom-very-light-blue': '#90E0EF',
        'custom-almost-white-blue': '#CAF0F8',
        
        // Theme color variables
        border: "rgb(var(--border))",
        input: "rgb(var(--border))",
        ring: "rgb(var(--primary))",
        
        // Component colors
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "rgb(var(--secondary-foreground, var(--foreground)))",
        },
        muted: {
          DEFAULT: "rgb(var(--muted))",
          foreground: "rgb(var(--muted-foreground))",
        },
        background: {
          DEFAULT: "rgb(var(--background))",
        },
        foreground: {
          DEFAULT: "rgb(var(--foreground))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary-rgb))",
          foreground: "rgb(var(--secondary-foreground-rgb))",
        },
        accent: {
          DEFAULT: "rgb(var(--accent-rgb))",
          foreground: "rgb(var(--accent-foreground-rgb))",
        },
        muted: {
          DEFAULT: "rgb(var(--muted-rgb))",
          foreground: "rgb(var(--muted-foreground-rgb))",
        },
        card: {
          DEFAULT: "rgb(var(--card-background-rgb))",
          foreground: "rgb(var(--card-foreground-rgb))",
        },
        destructive: {
          DEFAULT: "rgb(220, 38, 38)", // Using a standard red color
          foreground: "rgb(255, 255, 255)",
        },
        popover: {
          DEFAULT: "rgb(var(--card-background-rgb))",
          foreground: "rgb(var(--card-foreground-rgb))",
        },
      },
      borderRadius: {
        md: "var(--md-radius-medium)",
        lg: "var(--md-radius-large)",
        sm: "var(--md-radius-small)",
        full: "var(--md-radius-full)",
      },
      boxShadow: {
        'md-1': 'var(--md-elevation-level1)',
        'md-2': 'var(--md-elevation-level2)',
        'md-3': 'var(--md-elevation-level3)',
        'md-4': 'var(--md-elevation-level4)',
        'md-5': 'var(--md-elevation-level5)',
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
