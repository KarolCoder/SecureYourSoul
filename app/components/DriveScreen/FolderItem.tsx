import React, { memo } from 'react'
import { StyleSheet } from 'react-native'
import { StyledView, StyledText } from '../styled'
import { Button } from '../UI'
import { type ParsedDriveEntry } from '../../utils/dataParsingUtils'

interface FolderItemProps {
  item: ParsedDriveEntry
  onOpenFolder: (folderName: string) => void
  onDeleteFolder: (folderName: string) => void
}

export const FolderItem = memo<FolderItemProps>(
  ({ item, onOpenFolder, onDeleteFolder }) => {
    // Extract folder name from path (remove leading slash)
    const getFolderDisplayName = (content: string) => {
      if (content.startsWith('/')) {
        return content.substring(1) // Remove leading slash
      }
      return content
    }

    const folderName =
      typeof item.content === 'string'
        ? item.content
        : item.filename || 'Unknown'
    const displayName = getFolderDisplayName(folderName)

    const handleDelete = () => {
      onDeleteFolder(folderName)
    }

    const handleOpen = () => {
      onOpenFolder(folderName)
    }

    return (
      <StyledView
        backgroundColor='rgba(15, 15, 15, 0.3)'
        borderRadius={8}
        padding={16}
        style={styles.itemContainer}
      >
        <StyledView style={styles.leftContent}>
          <StyledText fontSize='xl' style={styles.folderIcon}>
            📁
          </StyledText>
          <StyledText
            fontSize='md'
            color='#fff'
            fontWeight='medium'
            numberOfLines={1}
          >
            {displayName}
          </StyledText>
        </StyledView>

        <StyledView style={styles.buttonContainer}>
          <Button
            title='Open'
            onPress={handleOpen}
            variant='primary'
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
    )
  }
)

FolderItem.displayName = 'FolderItem'

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 60,
    marginBottom: 12
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  folderIcon: {
    marginRight: 12
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center'
  },
  actionButton: {
    height: 36
  },
  deleteButton: {
    height: 36
  }
})
