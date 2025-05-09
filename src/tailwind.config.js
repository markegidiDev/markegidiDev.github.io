module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4f46e5',
          light: '#818cf8',
          dark: '#3730a3',
        },
        secondary: {
          DEFAULT: '#10b981',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'float': 'float 30s ease-in-out infinite alternate',
        'float2': 'float2 30s ease-in-out infinite alternate',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center',
          },
        },
        'gradient-y': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'top center',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'bottom center',
          },
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': '0% 0%',
          },
          '25%': {
            'background-size': '200% 200%',
            'background-position': '100% 0%',
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': '100% 100%',
          },
          '75%': {
            'background-size': '200% 200%',
            'background-position': '0% 100%',
          },
        },
        'shimmer': {
          '0%': {
            transform: 'translate(-100%, -100%) rotate(25deg)',
          },
          '100%': {
            transform: 'translate(100%, 100%) rotate(25deg)',
          },
        },
        'float': {
          '0%': {
            transform: 'translate(0, 0)',
          },
          '100%': {
            transform: 'translate(10%, 10%)',
          },
        },
        'float2': {
          '0%': {
            transform: 'translate(0, 0)',
          },
          '100%': {
            transform: 'translate(-10%, -10%)',
          },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(79, 70, 229, 0.5)',
        'glow-lg': '0 0 30px rgba(79, 70, 229, 0.4)',
      },
    },
  },
  plugins: [],
}