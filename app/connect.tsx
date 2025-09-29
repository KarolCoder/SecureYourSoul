import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useWorklet } from './stores'
import { Button, Card, Header, Input } from './components/UI'
import { BackgroundGradient } from './components/BackgroundGradient'
import { theme } from './theme'

export default function ConnectScreen() {
  const [driveKey, setDriveKey] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState('')
  const { startWorklet, connectedWithExistingDrive } = useWorklet()

  // useEffect(() => {
  //   // If worklet is already started, we're connected
  //   if (isWorkletStarted) {
  //     setIsConnecting(false)
  //   }
  // }, [isWorkletStarted])

  useEffect(() => {
    if (connectedWithExistingDrive) {
      // setIsConnecting(false)
      router.replace('/drive')
    }
  }, [connectedWithExistingDrive])

  const connectWithKey = useCallback(() => {
    if (!driveKey.trim()) {
      setError('Please enter an access key')
      return
    }

    setError('')
    setIsConnecting(true)
    startWorklet(driveKey)
  }, [driveKey, startWorklet])

  const goBack = useCallback(() => {
    router.back()
  }, [])

  const handleKeyChange = useCallback(
    (text: string) => {
      setDriveKey(text)
      if (error) {
        setError('')
      }
    },
    [error]
  )

  return (
    <BackgroundGradient>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps='handled'
          >
            <Header
              title='Join Secure Vault'
              subtitle='Enter the access key to join your secure vault'
              showBackButton={true}
              onBackPress={goBack}
              style={styles.header}
            />

            <Card style={styles.inputCard}>
              <View style={styles.inputContainer}>
                <Input
                  label='Access Key'
                  placeholder='Paste your secure vault access key here...'
                  value={driveKey}
                  onChangeText={handleKeyChange}
                  multiline
                  numberOfLines={4}
                  error={error}
                  style={styles.driveKeyInput}
                />

                <View style={styles.buttonContainer}>
                  <Button
                    title={isConnecting ? 'Connecting...' : 'Connect'}
                    onPress={connectWithKey}
                    variant='primary'
                    size='large'
                    fullWidth
                    loading={isConnecting}
                    disabled={isConnecting || !driveKey.trim()}
                    style={styles.connectButton}
                  />
                </View>
              </View>
            </Card>

            <Card style={styles.infoCard}>
              <View style={styles.infoContent}>
                <Text style={styles.infoIcon}>💡</Text>
                <View style={styles.infoTextContainer}>
                  <Text style={styles.infoTitle}>
                    How to get the access key?
                  </Text>
                  <Text style={styles.infoText}>
                    Ask the family member who created the secure vault to share
                    the access key with you. The key looks like a long string of
                    characters.
                  </Text>
                </View>
              </View>
            </Card>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </BackgroundGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  keyboardView: {
    flex: 1
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40
  },
  header: {
    marginTop: 20,
    marginBottom: 20
  },
  inputCard: {
    padding: 24,
    marginBottom: 20
  },
  inputContainer: {
    gap: 20
  },
  driveKeyInput: {
    minHeight: 120,
    fontFamily: 'monospace',
    fontSize: 14
  },
  buttonContainer: {
    marginTop: 10
  },
  connectButton: {
    marginTop: 8
  },
  infoCard: {
    padding: 20,
    marginBottom: 20,
    backgroundColor: theme.colors.background.secondary,
    borderColor: theme.colors.border.primary
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16
  },
  infoIcon: {
    fontSize: 24,
    marginTop: 4
  },
  infoTextContainer: {
    flex: 1
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.accent.primary,
    marginBottom: 8
  },
  infoText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20
  }
})
