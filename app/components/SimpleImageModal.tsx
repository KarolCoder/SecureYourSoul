import React, { useState } from 'react'
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  StatusBar
} from 'react-native'
import * as FileSystem from 'expo-file-system'
import * as MediaLibrary from 'expo-media-library'
import { StyledView, StyledText } from './styled'
import { useModal } from '../contexts/ModalContext'
import { theme } from '../theme'
import { logger } from '../utils/logger'

//I'VE ADDED IT, BECAUSE THERE WAS ISSUES WITH MODALS ON ANDROID, SO I DID IT AS A TEMPORARY SOLUTION

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

interface SimpleImageModalProps {
  visible: boolean
  onClose: () => void
  imageUri: string
  filename?: string
}

export const SimpleImageModal: React.FC<SimpleImageModalProps> = ({
  visible,
  onClose,
  imageUri,
  filename
}) => {
  const [isDownloading, setIsDownloading] = useState(false)
  const { showAlert } = useModal()

  const handleDownload = async () => {
    if (!imageUri) {
      return
    }

    try {
      setIsDownloading(true)

      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync()
      if (status !== 'granted') {
        showAlert({
          title: 'Permission Denied',
          message:
            'Permission to access media library is required to save images.'
        })
        return
      }

      // Create filename (extract just the filename, not the full path)
      const fileName = filename
        ? filename.split('/').pop() || `image_${Date.now()}.jpg`
        : `image_${Date.now()}.jpg`

      // Create a temporary file in cache directory
      const tempUri = `${FileSystem.cacheDirectory}${fileName}`

      // Write base64 data to temporary file
      await FileSystem.writeAsStringAsync(tempUri, imageUri.split(',')[1], {
        encoding: FileSystem.EncodingType.Base64
      })

      // Save to media library (photos)
      await MediaLibrary.saveToLibraryAsync(tempUri)

      // Clean up temporary file
      await FileSystem.deleteAsync(tempUri, { idempotent: true })

      showAlert({
        title: 'Success',
        message: 'Image saved to your photo library!'
      })
    } catch (error) {
      logger.error('Download error:', error)
      showAlert({
        title: 'Error',
        message: 'Failed to save image. Please try again.'
      })
    } finally {
      setIsDownloading(false)
    }
  }

  if (!visible) {
    return null
  }

  if (!imageUri) {
    return (
      <StyledView style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <StyledView style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <StyledView style={styles.errorContainer}>
          <StyledText style={styles.errorText}>No image to display</StyledText>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <StyledText style={styles.closeText}>Close</StyledText>
          </TouchableOpacity>
        </StyledView>
      </StyledView>
    )
  }

  return (
    <>
      <StatusBar barStyle='light-content' backgroundColor='rgba(0,0,0,0.95)' />
      <StyledView style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <StyledView style={styles.backdrop} />
        </TouchableWithoutFeedback>
        <StyledView style={styles.header}>
          <TouchableOpacity style={styles.headerButton} onPress={onClose}>
            <StyledText style={styles.headerButtonText}>✕ Close</StyledText>
          </TouchableOpacity>

          {filename && (
            <StyledText style={styles.filename} numberOfLines={1}>
              {filename}
            </StyledText>
          )}

          <TouchableOpacity
            style={[styles.headerButton, styles.downloadButton]}
            onPress={handleDownload}
            disabled={isDownloading}
          >
            <StyledText style={styles.headerButtonText}>
              {isDownloading ? 'Saving...' : '💾 Save'}
            </StyledText>
          </TouchableOpacity>
        </StyledView>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          maximumZoomScale={5}
          minimumZoomScale={1}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          centerContent={true}
          pinchGestureEnabled={true}
          scrollEnabled={true}
        >
          <TouchableWithoutFeedback onPress={onClose}>
            <StyledView style={styles.imageContainer}>
              <Image
                source={{ uri: imageUri }}
                style={styles.image}
                resizeMode='contain'
              />
            </StyledView>
          </TouchableWithoutFeedback>
        </ScrollView>
      </StyledView>
    </>
  )
}

//IT SHOULD BE MOVED TO A STYLED COMPONENTS
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: screenWidth,
    height: screenHeight,
    zIndex: 9998,
    backgroundColor: theme.colors.background.overlay
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.background.card + '80',
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.primary + '20'
  },
  headerButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: theme.colors.background.tertiary + '40'
  },
  downloadButton: {
    backgroundColor: theme.colors.primary + '20',
    borderWidth: 1,
    borderColor: theme.colors.primary
  },
  headerButtonText: {
    fontSize: 14,
    color: theme.colors.text.primary,
    fontWeight: '600'
  },
  filename: {
    fontSize: 14,
    color: theme.colors.text.primary,
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
    opacity: 0.9
  },
  scrollContainer: {
    flex: 1,
    paddingTop: 100 // Account for header height
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: screenHeight - 100
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: screenWidth,
    minHeight: screenHeight - 100
  },
  image: {
    width: screenWidth - 32,
    height: screenHeight - 140,
    maxWidth: screenWidth - 32,
    maxHeight: screenHeight - 140
  },
  errorContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -140 }, { translateY: -60 }],
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.card,
    borderRadius: 12,
    padding: 32,
    minWidth: 280
  },
  errorText: {
    fontSize: 18,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 24
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: theme.colors.primary,
    borderRadius: 8
  },
  closeText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontWeight: '600'
  }
})
