import React, { memo } from 'react'
import { Image, StyleSheet, TouchableOpacity } from 'react-native'
import { StyledView, StyledText } from '../styled'
import { Button } from '../UI'
import { useModal } from '../../contexts/ModalContext'
// Removed unused import: copyItemToClipboard
import { logger } from '../../utils/logger'
import {
  getFileIcon,
  getFileTypeDisplayName,
  isImageFile
} from '../../utils/fileUtils'

type DriveEntry = {
  type: string
  content: string
  filename?: string
}

interface FileItemProps {
  item: DriveEntry
}

export const FileItem = memo<FileItemProps>(({ item }) => {
  const { showImageModal, showAlert } = useModal()

  const handleView = () => {
    if (isImageFile(item.filename || '') && item.content) {
      const imageUri = `data:image/${item.type === 'heic' || item.type === 'heif' ? 'heic' : 'jpeg'};base64,${item.content}`

      showImageModal({
        imageUri,
        filename: item.filename
      })
    }
  }

  const handleDelete = () => {
    showAlert({
      title: 'Delete File',
      message: 'Delete file functionality coming soon!'
    })
  }

  return (
    <StyledView flex={1} padding={4}>
      <StyledView
        backgroundColor='rgba(15, 15, 15, 0.3)'
        borderRadius={8}
        padding={12}
        style={styles.itemContainer}
      >
        <StyledView flex={1} style={styles.contentContainer}>
          {(isImageFile(item.filename || '') ||
            item.type === 'image' ||
            item.type === 'heic' ||
            item.type === 'heif') &&
          item.content ? (
            <TouchableOpacity
              onPress={handleView}
              activeOpacity={0.8}
              style={styles.imageContainer}
            >
              <Image
                source={{
                  uri: `data:image/${item.type === 'heic' || item.type === 'heif' ? 'heic' : 'jpeg'};base64,${item.content}`
                }}
                style={styles.imageStyle}
                resizeMode='cover'
                onError={(error) => {
                  logger.error('Image load error:', error)
                }}
              />
            </TouchableOpacity>
          ) : (
            <StyledView style={styles.fileIconContainer}>
              <StyledText fontSize='xxxl' marginBottom={8}>
                {getFileIcon(item.filename || '')}
              </StyledText>
              <StyledText
                fontSize='sm'
                color='#fff'
                fontWeight='medium'
                textAlign='center'
                marginBottom={4}
                numberOfLines={1}
              >
                {item.filename?.split('/').pop() || 'Unknown'}
              </StyledText>
              <StyledText fontSize='xs' color='#b0d943' textAlign='center'>
                {getFileTypeDisplayName(item.type)}
              </StyledText>
            </StyledView>
          )}
        </StyledView>

        <StyledView style={styles.buttonContainer}>
          <Button
            title='👁️ View'
            onPress={handleView}
            variant='secondary'
            size='small'
            style={styles.actionButton}
          />
          <Button
            title='🗑️'
            onPress={handleDelete}
            variant='danger'
            size='small'
            style={styles.deleteButton}
          />
        </StyledView>
      </StyledView>
    </StyledView>
  )
})

FileItem.displayName = 'FileItem'

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: 200,
    marginBottom: 8
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    flex: 1
  },
  imageContainer: {
    width: '100%',
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden'
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    minHeight: 140
  },
  fileIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 4
  },
  actionButton: {
    flex: 1
  },
  deleteButton: {
    minWidth: 50
  }
})
