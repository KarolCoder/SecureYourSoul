import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { StyleSheet } from 'react-native'
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
  const [folderFiles, setFolderFiles] = useState<DriveEntry[]>([])
  const { imageModal, hideImageModal, alert, hideAlert } = useModal()

  const actualFolderName = Array.isArray(folderName)
    ? folderName[0]?.replace(/^\//, '')
    : folderName?.replace(/^\//, '')

  const { dataList } = useWorklet()

  const goBack = useCallback(() => {
    router.back()
  }, [])

  const parsedEntries = useMemo(() => {
    return parseDriveEntries(dataList)
  }, [dataList])

  const folderItems = useMemo(() => {
    if (!actualFolderName || !parsedEntries.length) {
      return []
    }
    return getItemsForRootFolder(parsedEntries, actualFolderName)
  }, [actualFolderName, parsedEntries])

  useEffect(() => {
    if (actualFolderName && dataList.length > 0) {
      setFolderFiles(folderItems)
    }
  }, [actualFolderName, dataList, parsedEntries, folderItems])

  const handleOpenFolder = useCallback((folderName: string) => {
    router.push(`/folder?folderName=${encodeURIComponent(folderName)}`)
  }, [])

  return (
    <>
      <BackgroundGradient>
        <SafeAreaView style={styles.container}>
          <StyledScrollView>
            <Header
              title={`📁 ${actualFolderName || 'Unknown'}`}
              showBackButton={true}
              onBackPress={goBack}
              style={styles.header}
            />
            <UploadSection folderName={actualFolderName || ''} />
            <FileList
              folderFiles={folderFiles}
              onOpenFolder={handleOpenFolder}
            />
          </StyledScrollView>
        </SafeAreaView>
      </BackgroundGradient>
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
