import React, { useState, useEffect, useCallback } from 'react'
import { RefreshControl, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useWorklet } from './stores'
import { StyledScrollView, StyledView, StyledText } from './components/styled'
import { Button } from './components/UI'
import { BackgroundGradient } from './components/BackgroundGradient'
import { FolderSection } from './components/DriveScreen/FolderSection'
import { FolderList } from './components/DriveScreen/FolderList'
import { LoadingScreen } from './components/DriveScreen/LoadingScreen'
import { ModalProvider, useModal } from './contexts/ModalContext'
import { CustomAlert } from './components/CustomAlert'
import { CustomTextInputAlert } from './components/CustomTextInputAlert'
import { logger } from './utils/logger'
import { theme } from './theme'

function DriveContent() {
  const [isCreating, setIsCreating] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const { showAlert, alert, hideAlert, textInputAlert, hideTextInputAlert } =
    useModal()

  const {
    isWorkletStarted,
    dataList,
    startWorklet,
    createFolder: createFolderAction,
    listFolders,
    deleteFolder: deleteFolderAction
  } = useWorklet()

  const createNewHyperdrive = useCallback(() => {
    setIsCreating(true)
    startWorklet()
  }, [startWorklet])

  useEffect(() => {
    if (!isWorkletStarted) {
      createNewHyperdrive()
    }
  }, [isWorkletStarted, createNewHyperdrive])

  const handleListFolders = useCallback(() => {
    try {
      listFolders()
    } catch {
      showAlert({
        title: 'Error',
        message: 'Hyperdrive not ready'
      })
    }
  }, [listFolders, showAlert])

  // Auto-load folders on start
  useEffect(() => {
    if (isWorkletStarted) {
      const timer = setTimeout(() => {
        handleListFolders()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isWorkletStarted, handleListFolders])

  const handleDeleteFolder = useCallback(
    (folderName: string) => {
      showAlert({
        title: 'Delete Folder',
        message: `Are you sure you want to delete "${folderName}"?`,
        buttons: [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: hideAlert
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              try {
                deleteFolderAction(folderName)
                // Use a Promise-based delay instead of setTimeout for better control
                await new Promise((resolve) => setTimeout(resolve, 1000))
                handleListFolders()
              } catch (deleteError) {
                logger.error('Failed to delete folder:', deleteError)
                showAlert({
                  title: 'Error',
                  message: 'Failed to delete folder'
                })
              }
            }
          }
        ]
      })
    },
    [deleteFolderAction, handleListFolders, showAlert, hideAlert]
  )

  const openFolder = useCallback((folderName: string) => {
    router.push({
      pathname: '/folder',
      params: { folderName }
    })
  }, [])

  const createFolder = useCallback(
    async (newFolderName: string) => {
      setIsCreating(true)
      try {
        await createFolderAction(newFolderName)
        showAlert({
          title: 'Success',
          message: `Folder "${newFolderName}" created successfully`
        })
        // Use a Promise-based delay instead of setTimeout for better control
        await new Promise((resolve) => setTimeout(resolve, 1000))
        handleListFolders()
      } catch (createError) {
        logger.error('Failed to create folder:', createError)
        showAlert({
          title: 'Error',
          message: 'Failed to create folder'
        })
      } finally {
        setIsCreating(false)
      }
    },
    [createFolderAction, handleListFolders, showAlert]
  )

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    try {
      handleListFolders()
      // Use a Promise-based delay instead of setTimeout for better control
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch {
      // Refresh failed silently
    } finally {
      setRefreshing(false)
    }
  }, [handleListFolders])

  if (isCreating && !isWorkletStarted) {
    return <LoadingScreen />
  }

  return (
    <>
      <BackgroundGradient>
        <SafeAreaView style={styles.container}>
          <StyledScrollView
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor='#b0d943'
              />
            }
          >
            <StyledView style={styles.headerContainer}>
              <StyledView style={styles.headerContent}>
                <StyledView style={styles.titleContainer}>
                  <StyledText style={styles.title}>Secure Your Soul</StyledText>
                  <StyledText style={styles.subtitle}>
                    Share photos securely with your family
                  </StyledText>
                </StyledView>
                <Button
                  title='⚙️'
                  onPress={() => router.push('/settings')}
                  variant='ghostNoBorder'
                  size='small'
                  style={styles.settingsButton}
                />
              </StyledView>
            </StyledView>

            <FolderSection
              isWorkletStarted={isWorkletStarted}
              onCreateFolder={createFolder}
              isCreating={isCreating}
            />
            <FolderList
              dataList={dataList}
              onRefresh={onRefresh}
              onOpenFolder={openFolder}
              onDeleteFolder={handleDeleteFolder}
            />
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

      <CustomTextInputAlert
        visible={textInputAlert.visible}
        title={textInputAlert.data?.title || ''}
        message={textInputAlert.data?.message || ''}
        placeholder={textInputAlert.data?.placeholder}
        defaultValue={textInputAlert.data?.defaultValue}
        onConfirm={textInputAlert.data?.onConfirm || hideTextInputAlert}
        onCancel={textInputAlert.data?.onCancel || hideTextInputAlert}
        onBackdropPress={hideTextInputAlert}
      />
    </>
  )
}

export default function DriveScreen() {
  return (
    <ModalProvider>
      <DriveContent />
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
  headerContainer: {
    marginBottom: 20,
    paddingTop: 8
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 2,
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    opacity: 0.8,
    textAlign: 'center'
  },
  settingsButton: {
    minWidth: 40,
    height: 32
  }
})
