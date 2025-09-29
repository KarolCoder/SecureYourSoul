export const theme = {
  colors: {
    primary: '#8b5cf6', // Mystic purple
    secondary: '#06b6d4', // Cyan
    danger: '#ef4444', // Red
    success: '#10b981', // Emerald
    warning: '#f59e0b', // Amber
    info: '#3b82f6', // Blue
    error: '#ef4444', // Red

    // Background colors - mystical with gradients
    background: {
      primary: '#0a0a0a', // Very dark base
      secondary: '#0f0f0f', // Very dark gray
      tertiary: '#1a1a1a', // Dark gray
      card: 'rgba(15, 15, 15, 0.8)', // Semi-transparent dark
      overlay: 'rgba(0, 0, 0, 0.8)', // Darker overlay
      gradient: {
        start: '#0a0a0a', // Very dark
        middle: '#1a0a2e', // Dark purple
        end: '#16213e' // Dark blue-purple
      }
    },

    // Text colors - more mystical
    text: {
      primary: '#f8fafc', // Almost white
      secondary: '#cbd5e1', // Light gray
      tertiary: '#94a3b8', // Medium gray
      disabled: '#64748b', // Dark gray
      inverse: '#000000', // Black
      muted: '#64748b' // Dark gray
    },

    // Accent colors - mystical purple and cyan
    accent: {
      primary: '#8b5cf6', // Mystic purple
      secondary: '#06b6d4' // Cyan
    },

    // Border colors - subtle, mystical
    border: {
      primary: '#1e293b', // Dark slate
      secondary: '#334155', // Slate
      accent: '#8b5cf6', // Mystic purple
      error: '#ef4444' // Red
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
      shadowColor: '#8b5cf6', // Mystic purple glow
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 2
    },
    md: {
      shadowColor: '#8b5cf6', // Mystic purple glow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 3
    },
    lg: {
      shadowColor: '#8b5cf6', // Mystic purple glow
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
