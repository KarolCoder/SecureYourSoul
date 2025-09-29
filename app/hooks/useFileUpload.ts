import { useCallback } from 'react'
import { Alert } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { useWorklet } from '../stores'
import { logger } from '../utils/logger'

// File size limits (in bytes)
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB for images

export const useFileUpload = (folderName: string) => {
  const { uploadFile: uploadFileAction } = useWorklet()

  const validateFileSize = (base64Data: string, fileName: string): boolean => {
    // Calculate size from base64 (base64 is ~33% larger than binary)
    const sizeInBytes = (base64Data.length * 3) / 4
    const isImage =
      /\.(jpg|jpeg|png|gif|webp|bmp|svg|ico|tiff|tif|heic|heif)$/i.test(
        fileName
      )
    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_FILE_SIZE

    if (sizeInBytes > maxSize) {
      Alert.alert(
        'File Too Large',
        `File size (${Math.round(sizeInBytes / 1024 / 1024)}MB) exceeds the limit of ${Math.round(maxSize / 1024 / 1024)}MB`
      )
      return false
    }
    return true
  }

  const pickImage = useCallback(
    async (quality: number = 0.6) => {
      try {
        // Request permissions first
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Please grant photo library access to upload images.'
          )
          return
        }

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          quality: quality,
          base64: true,
          exif: false
        })

        if (!result.canceled) {
          for (const asset of result.assets) {
            if (asset.base64) {
              // Wykryj typ pliku na podstawie rozszerzenia
              const fileName = asset.fileName || `image_${Date.now()}.jpg`
              const fileExtension = fileName.split('.').pop()?.toLowerCase()
              const isHeicFile =
                fileExtension === 'heic' || fileExtension === 'heif'

              // Validate file size before upload
              if (!validateFileSize(asset.base64, fileName)) {
                continue
              }

              const uploadData = {
                folderName: folderName || '',
                fileName: fileName,
                fileData: asset.base64,
                fileType: isHeicFile ? 'heic' : 'image'
              }
              uploadFileAction(uploadData)
            } else {
              logger.error('No base64 data for asset:', asset.fileName)

              // Try to read the file as base64 manually
              try {
                const response = await fetch(asset.uri)
                const blob = await response.blob()
                const reader = new FileReader()

                reader.onload = () => {
                  try {
                    const base64 = reader.result as string
                    const fileName = asset.fileName || `image_${Date.now()}.jpg`
                    const fileExtension = fileName
                      .split('.')
                      .pop()
                      ?.toLowerCase()
                    const isHeicFile =
                      fileExtension === 'heic' || fileExtension === 'heif'

                    const uploadData = {
                      folderName: folderName || '',
                      fileName: fileName,
                      fileData: base64.split(',')[1], // Remove data:type;base64, prefix
                      fileType: isHeicFile ? 'heic' : 'image'
                    }
                    uploadFileAction(uploadData)
                  } catch (uploadError) {
                    logger.error(
                      'Error processing manual file read:',
                      uploadError
                    )
                    Alert.alert(
                      'Error',
                      `Failed to process file: ${asset.fileName}`
                    )
                  }
                }

                reader.onerror = () => {
                  logger.error('FileReader error for asset:', asset.fileName)
                  Alert.alert('Error', `Failed to read file: ${asset.fileName}`)
                }

                reader.readAsDataURL(blob)
              } catch (error) {
                logger.error('Failed to read file manually:', error)
                Alert.alert(
                  'Error',
                  `Failed to process file: ${asset.fileName}`
                )
              }
            }
          }

          Alert.alert(
            'Success',
            `${result.assets.length} images uploaded to ${folderName}`
          )
        }
      } catch (error) {
        logger.error('Error picking images:', error)
        Alert.alert('Error', 'Failed to pick images')
      }
    },
    [folderName, uploadFileAction]
  )

  // Funkcje z różnymi poziomami jakości
  const pickImageHighQuality = useCallback(() => pickImage(0.8), [pickImage])
  const pickImageMediumQuality = useCallback(() => pickImage(0.6), [pickImage])
  const pickImageLowQuality = useCallback(() => pickImage(0.4), [pickImage])

  return {
    pickImage,
    pickImageHighQuality,
    pickImageMediumQuality,
    pickImageLowQuality
  }
}
