import React, { memo } from 'react'
import { StyleSheet } from 'react-native'
import { StyledView } from '../styled'
import { Button } from '../UI'
import { theme } from '../../theme'
import { useFileUpload } from '../../hooks/useFileUpload'

interface UploadSectionProps {
  folderName: string
}

export const UploadSection = memo<UploadSectionProps>(({ folderName }) => {
  const { pickImageMediumQuality } = useFileUpload(folderName)

  return (
    <StyledView style={styles.container}>
      <StyledView style={styles.buttonContainer}>
        <Button
          title='📸 Add Photo'
          onPress={pickImageMediumQuality}
          variant='primary'
          size='large'
          style={styles.addButton}
        />
      </StyledView>
    </StyledView>
  )
})

UploadSection.displayName = 'UploadSection'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 20,
    marginTop: 30
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.accent.primary,
    marginBottom: 16
  },
  buttonContainer: {
    alignItems: 'center'
  },
  addButton: {
    minWidth: 150,
    paddingVertical: 12
  }
})
