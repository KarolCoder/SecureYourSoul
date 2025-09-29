import React, { useCallback, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useWorklet } from './stores'
import { logger } from './utils/logger'
import { StyledScrollView, StyledView, StyledText } from './components/styled'
import { Header } from './components/UI'
import { BackgroundGradient } from './components/BackgroundGradient'
import { OptionCard } from './components/HomeScreen/OptionCard'
import { FeatureGrid } from './components/HomeScreen/FeatureGrid'
import { InfoCard } from './components/HomeScreen/InfoCard'

const features = [
  { icon: '📷', text: 'Secure Photos' },
  { icon: '🔒', text: 'Private & Safe' }
]

export default function HomeScreen() {
  const { startWorklet, isWorkletStarted } = useWorklet()

  useEffect(() => {
    if (isWorkletStarted) {
      router.replace('/drive')
    }
  }, [isWorkletStarted])

  const navigateToConnect = useCallback(() => {
    router.push('/connect')
  }, [])

  const navigateToCreate = useCallback(() => {
    try {
      startWorklet() // Start new vault without key
    } catch (_error) {
      logger.error('Error starting worklet:', _error)
    }
  }, [startWorklet])

  return (
    <BackgroundGradient>
      <SafeAreaView style={styles.container}>
        <StyledScrollView contentContainerStyle={styles.scrollContent}>
          <Header
            title='Secure Your Soul 🔐'
            subtitle='Secure photo sharing for your memories'
            style={styles.header}
          />

          <StyledView style={styles.optionsContainer}>
            <OptionCard
              icon='📸'
              title='Create Secure Vault'
              description='Start sharing photos securely with your family'
              buttonTitle='Create'
              onPress={navigateToCreate}
              variant='primary'
            />

            <OptionCard
              icon='🔑'
              title='Join Secure Vault'
              description='Connect to existing secure vault with access key'
              buttonTitle='Join'
              onPress={navigateToConnect}
              variant='secondary'
            />
          </StyledView>

          <StyledView style={styles.featuresContainer}>
            <StyledText
              fontSize='md'
              fontWeight='bold'
              color='#b0d943'
              textAlign='center'
              marginBottom={10}
            >
              What you can share
            </StyledText>
            <FeatureGrid features={features} />
          </StyledView>

          <InfoCard
            icon='💡'
            title='How it works'
            text='One family member creates a secure vault and shares the access key. Everyone else joins using that key to access shared photos securely.'
          />
        </StyledScrollView>
      </SafeAreaView>
    </BackgroundGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 20
  },
  header: {
    marginTop: 12,
    marginBottom: 16
  },
  optionsContainer: {
    gap: 10,
    marginBottom: 16
  },
  featuresContainer: {
    marginBottom: 12
  }
})
