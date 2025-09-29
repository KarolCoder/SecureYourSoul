import React from 'react'
import { StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { theme } from '../theme'

interface BackgroundGradientProps {
  children: React.ReactNode
  style?: object
}

export const BackgroundGradient: React.FC<BackgroundGradientProps> = ({
  children,
  style
}) => {
  return (
    <LinearGradient
      colors={[
        theme.colors.background.gradient.start,
        theme.colors.background.gradient.middle,
        theme.colors.background.gradient.end
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
