import React, { Component, ReactNode } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { Button } from './UI'
import { logger } from '../utils/logger'
import { theme } from '../theme'

//I'VE ADDED IT, BECAUSE I DON'T WANT JUST TO CRASH THE APP FOR THE USERS
interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to our logging system
    logger.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>⚠️ Something went wrong</Text>
            <Text style={styles.message}>
              The app encountered an unexpected error. Please try again.
            </Text>
            {__DEV__ && this.state.error && (
              <Text style={styles.errorDetails}>
                {this.state.error.message}
              </Text>
            )}
            <Button
              title='Try Again'
              onPress={this.handleRetry}
              variant='primary'
              size='medium'
              style={styles.retryButton}
            />
          </View>
        </View>
      )
    }

    return this.props.children
  }
}

//IT SHOULD BE MOVED TO A STYLED COMPONENTS
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  content: {
    alignItems: 'center',
    maxWidth: 300
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.error,
    marginBottom: 16,
    textAlign: 'center'
  },
  message: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24
  },
  errorDetails: {
    fontSize: 12,
    color: theme.colors.text.muted,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'monospace'
  },
  retryButton: {
    minWidth: 120
  }
})
