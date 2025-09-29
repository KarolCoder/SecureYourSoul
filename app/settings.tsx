import React, { useCallback } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useWorklet } from './stores'
import { StyledScrollView, StyledView } from './components/styled'
import { Button, Header } from './components/UI'
import { BackgroundGradient } from './components/BackgroundGradient'
import { ShareSection } from './components/DriveScreen/ShareSection'
import { ModalProvider, useModal } from './contexts/ModalContext'
import { CustomAlert } from './components/CustomAlert'
import { logger } from './utils/logger'

function SettingsContent() {
  const { isWorkletStarted, generatedKey, getDriveKey, clearAll } = useWorklet()
  const { showAlert, alert, hideAlert } = useModal()

  const handleClearAll = useCallback(() => {
    showAlert({
      title: 'Clear All Data',
      message:
        'Are you sure you want to delete ALL data from this drive? This action cannot be undone!',
      buttons: [
        { text: 'Cancel', style: 'cancel', onPress: hideAlert },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            hideAlert()
            try {
              await clearAll()
              showAlert({
                title: 'Success',
                message: 'All data cleared successfully'
              })
            } catch (error) {
              logger.error('Failed to clear data:', error)
              showAlert({
                title: 'Error',
                message: 'Failed to clear data'
              })
            }
          }
        }
      ]
    })
  }, [clearAll, showAlert, hideAlert])

  const goBack = useCallback(() => {
    router.back()
  }, [])

  const handleGetDriveKey = useCallback(() => {
    if (generatedKey) {
      showAlert({
        title: 'Key Available',
        message:
          'Drive key is already available. Check the Share section above.'
      })
    } else {
      getDriveKey()
      showAlert({
        title: '⏳ Loading...',
        message: 'Requesting drive key from backend...'
      })
    }
  }, [generatedKey, getDriveKey, showAlert])

  return (
    <>
      <BackgroundGradient>
        <SafeAreaView style={styles.container}>
          <StyledScrollView contentContainerStyle={styles.scrollContent}>
            <Header
              title='Secure Settings'
              subtitle='Manage your secure vault access and data'
              showBackButton={true}
              onBackPress={goBack}
              style={styles.header}
            />

            <ShareSection
              generatedKey={generatedKey}
              isWorkletStarted={isWorkletStarted}
            />

            {!generatedKey && (
              <StyledView style={styles.keySection}>
                <Button
                  title='🔑 Get Drive Key'
                  onPress={handleGetDriveKey}
                  variant='primary'
                  size='medium'
                  style={styles.keyButton}
                />
              </StyledView>
            )}

            <StyledView style={styles.advancedSection}>
              <Header
                title='⚙️ Advanced Options'
                subtitle='Manage your vault data and connection'
              />

              <StyledView style={styles.actionButtons}>
                <Button
                  title='🗑️ Clear All Data'
                  onPress={handleClearAll}
                  variant='danger'
                  size='medium'
                  style={styles.actionButton}
                />
              </StyledView>
            </StyledView>
          </StyledScrollView>
        </SafeAreaView>
      </BackgroundGradient>

      {/* Screen-level modals */}
      <CustomAlert
        visible={alert.visible}
        title={alert.data?.title || ''}
        message={alert.data?.message || ''}
        buttons={alert.data?.buttons || [{ text: 'OK', onPress: hideAlert }]}
        onBackdropPress={hideAlert}
      />
    </>
  )
}

export default function SettingsScreen() {
  return (
    <ModalProvider>
      <SettingsContent />
    </ModalProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24
  },
  header: {
    marginBottom: 20
  },
  keySection: {
    marginBottom: 20,
    alignItems: 'center'
  },
  keyButton: {
    width: '100%'
  },
  advancedSection: {
    marginTop: 24,
    padding: 16
  },
  actionButtons: {
    marginTop: 16,
    gap: 10
  },
  actionButton: {
    width: '100%'
  }
})
