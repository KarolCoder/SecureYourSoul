import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { RefreshControl, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, router } from 'expo-router'
import { useWorklet } from './stores'
import { StyledScrollView } from './components/styled'
import { Header } from './components/UI'
import { BackgroundGradient } from './components/BackgroundGradient'
import { UploadSection } from './components/FolderScreen/UploadSection'
import { FileList } from './components/FolderScreen/FileList'
import { ModalProvider, useModal } from './contexts/ModalContext'
import { SimpleImageModal } from './components/SimpleImageModal'
import { CustomAlert } from './components/CustomAlert'
import {
  parseDriveEntries,
  getItemsForRootFolder,
  type ParsedDriveEntry
} from './utils/dataParsingUtils'

type DriveEntry = ParsedDriveEntry

function FolderContent() {
  const { folderName } = useLocalSearchParams<{ folderName: string }>()
  const [refreshing, setRefreshing] = useState(false)
  const [folderFiles, setFolderFiles] = useState<DriveEntry[]>([])
  const { imageModal, hideImageModal, alert, hideAlert } = useModal()

  // Ensure folderName is a string and remove leading slash
  const actualFolderName = Array.isArray(folderName)
    ? folderName[0]?.replace(/^\//, '') // Remove leading slash
    : folderName?.replace(/^\//, '') // Remove leading slash

  const { dataList } = useWorklet()

  const goBack = useCallback(() => {
    router.back()
  }, [])

  // Memoize parsed entries to avoid re-parsing on every render
  const parsedEntries = useMemo(() => {
    return parseDriveEntries(dataList)
  }, [dataList])

  // Memoize folder items to avoid re-filtering on every render
  const folderItems = useMemo(() => {
    if (!actualFolderName || !parsedEntries.length) {
      return []
    }
    return getItemsForRootFolder(parsedEntries, actualFolderName)
  }, [actualFolderName, parsedEntries])

  // Filter files for this specific folder
  useEffect(() => {
    if (actualFolderName && dataList.length > 0) {
      setFolderFiles(folderItems)
    }
  }, [actualFolderName, dataList, parsedEntries, folderItems])

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    // Refresh logic would go here
    const timer = setTimeout(() => setRefreshing(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleOpenFolder = useCallback((folderName: string) => {
    // Navigate to the folder
    router.push(`/folder?folderName=${encodeURIComponent(folderName)}`)
  }, [])

  const handleDeleteFolder = useCallback((folderName: string) => {
    // Add delete logic here
  }, [])

  return (
    <>
      <BackgroundGradient>
        <SafeAreaView style={styles.container}>
          <StyledScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <Header
              title={`📁 ${actualFolderName || 'Unknown'}`}
              showBackButton={true}
              onBackPress={goBack}
              style={styles.header}
            />

            <UploadSection folderName={actualFolderName || ''} />

            <FileList
              folderFiles={folderFiles}
              folderName={actualFolderName || 'Unknown'}
              refreshing={refreshing}
              onRefresh={onRefresh}
              onOpenFolder={handleOpenFolder}
              onDeleteFolder={handleDeleteFolder}
            />
          </StyledScrollView>
        </SafeAreaView>
      </BackgroundGradient>

      {/* Screen-level modals */}
      <SimpleImageModal
        visible={imageModal.visible}
        onClose={hideImageModal}
        imageUri={imageModal.data?.imageUri || ''}
        filename={imageModal.data?.filename}
      />

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

export default function FolderScreen() {
  return (
    <ModalProvider>
      <FolderContent />
    </ModalProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    marginTop: 20,
    marginBottom: 20
  }
})
