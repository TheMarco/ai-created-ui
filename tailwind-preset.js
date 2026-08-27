/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    borderRadius: {
      none: '0',
      sm: 'var(--radius-sm)',
      DEFAULT: 'var(--radius-md)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
      full: '9999px',
    },
    extend: {
      fontFamily: {
        display: ['Instrument Serif', 'Georgia', 'serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Space Grotesk', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'SF Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      letterSpacing: {
        tightest: '-0.03em',
        tighter: '-0.02em',
        tight: '-0.01em',
        normal: '0em',
        wide: '0.01em',
        wider: '0.05em',
        widest: '0.15em',
      },
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        surface2: 'var(--color-surface2)',
        border: 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',
        text: 'var(--color-text)',
        text2: 'var(--color-text2)',
        text3: 'var(--color-text3)',
        accent: {
          DEFAULT: 'var(--color-accent)',
          muted: 'var(--color-accent-muted)',
          hover: 'var(--color-accent-hover)',
          border: 'var(--color-accent-border)',
        },
        'action-primary': {
          DEFAULT: 'var(--color-action-primary)',
          hover: 'var(--color-action-primary-hover)',
        },
        red: {
          DEFAULT: 'var(--color-red)',
          500: 'var(--color-red)',
          hover: 'var(--color-red-hover)',
        },
        'red-solid': {
          DEFAULT: 'var(--color-red-solid)',
          hover: 'var(--color-red-solid-hover)',
        },
        red2: 'var(--color-red2)',
        'red-border': 'var(--color-red-border)',
        overlay: 'var(--color-overlay)',
        highlight: 'var(--color-highlight)',
        focus: 'var(--color-focus)',
        success: {
          DEFAULT: 'var(--color-success)',
          surface: 'var(--color-success-surface)',
          border: 'var(--color-success-border)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          surface: 'var(--color-warning-surface)',
          border: 'var(--color-warning-border)',
        },
        info: {
          DEFAULT: 'var(--color-info)',
          surface: 'var(--color-info-surface)',
          border: 'var(--color-info-border)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          surface: 'var(--color-error-surface)',
          border: 'var(--color-error-border)',
        },
      },
      maxWidth: {
        '8xl': 'var(--layout-container-max)',
        '9xl': '1600px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
