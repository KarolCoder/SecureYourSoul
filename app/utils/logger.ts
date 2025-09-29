// Development-only logging utility
// This ensures logs are completely removed in production builds
/* eslint-disable no-console */

const isDev = __DEV__

export const logger = {
  log: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.log(message, ...args)
    }
  },

  error: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.error(message, ...args)
    }
  },

  warn: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.warn(message, ...args)
    }
  },

  info: (message: string, ...args: unknown[]) => {
    if (isDev) {
      console.info(message, ...args)
    }
  }
}
