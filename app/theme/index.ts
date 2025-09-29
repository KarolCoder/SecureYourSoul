//I'VE ADDED IT, SO IT IS EASIER TO CHANGE THE THEMES ACROSS THE APP

export const theme = {
  colors: {
    primary: '#8b5cf6',
    secondary: '#06b6d4',
    danger: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
    info: '#3b82f6',
    error: '#ef4444',

    background: {
      primary: '#0a0a0a',
      secondary: '#0f0f0f',
      tertiary: '#1a1a1a',
      card: 'rgba(15, 15, 15, 0.8)',
      overlay: 'rgba(0, 0, 0, 0.8)',
      gradient: {
        start: '#0a0a0a',
        middle: '#1a0a2e',
        end: '#16213e'
      }
    },

    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      tertiary: '#94a3b8',
      disabled: '#64748b',
      inverse: '#000000',
      muted: '#64748b'
    },

    accent: {
      primary: '#8b5cf6',
      secondary: '#06b6d4'
    },

    border: {
      primary: '#1e293b',
      secondary: '#334155',
      accent: '#8b5cf6',
      error: '#ef4444'
    }
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    xxxxl: 40
  },

  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999
  },

  typography: {
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 28,
      xxxxl: 32
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6
    }
  },

  shadows: {
    sm: {
      shadowColor: '#8b5cf6',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 2
    },
    md: {
      shadowColor: '#8b5cf6',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 3
    },
    lg: {
      shadowColor: '#8b5cf6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 5
    }
  },

  breakpoints: {
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200
  }
} as const

export type Theme = typeof theme
