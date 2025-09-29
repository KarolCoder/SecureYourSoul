import React, { memo } from 'react'
import { StyleSheet } from 'react-native'
import { StyledView } from '../styled'
import { Button } from '../UI'
import { useModal } from '../../contexts/ModalContext'
import { theme } from '../../theme'

interface FolderSectionProps {
  isWorkletStarted: boolean
  onCreateFolder: (folderName: string) => void
  isCreating?: boolean
  onClearAll?: () => void
}

export const FolderSection = memo<FolderSectionProps>(
  ({ isWorkletStarted, onCreateFolder, isCreating = false, onClearAll }) => {
    const { showTextInputAlert, hideTextInputAlert } = useModal()

    const handleCreateFolder = () => {
      showTextInputAlert({
        title: 'Create New Folder',
        message: 'Enter folder name:',
        placeholder: 'Folder name',
        onConfirm: (name) => {
          if (name && name.trim()) {
            onCreateFolder(name.trim())
          }
          hideTextInputAlert()
        },
        onCancel: () => {
          hideTextInputAlert()
        }
      })
    }

    if (!isWorkletStarted) {
      return null
    }

    return (
      <StyledView style={styles.container}>
        <StyledView style={styles.buttonContainer}>
          <Button
            title='Create Folder'
            onPress={handleCreateFolder}
            variant='primary'
            size='small'
            style={styles.button}
            disabled={isCreating}
          />
        </StyledView>

        {!!onClearAll && (
          <StyledView style={styles.dangerSection}>
            <Button
              title='Clear All Data'
              onPress={onClearAll}
              variant='danger'
              size='small'
              style={styles.dangerButton}
            />
          </StyledView>
        )}
      </StyledView>
    )
  }
)

FolderSection.displayName = 'FolderSection'

//IT SHOULD BE MOVED TO A STYLED COMPONENTS
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20
  },
  buttonContainer: {
    alignItems: 'center'
  },
  button: {
    minWidth: 120
  },
  dangerSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.primary,
    alignItems: 'center'
  },
  dangerButton: {
    minWidth: 150
  }
})
