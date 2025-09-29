import React from 'react'
import { StyleSheet } from 'react-native'
import { StyledView, StyledText } from '../styled'
import { Button } from '../UI'
import { type ParsedDriveEntry } from '../../utils/dataParsingUtils'

interface FolderItemProps {
  item: ParsedDriveEntry
  onOpenFolder: (folderName: string) => void
  onDeleteFolder: (folderName: string) => void
}

const getFolderDisplayName = (content: string) => {
  if (content.startsWith('/')) {
    return content.substring(1) // Remove leading slash
  }
  return content
}

//EVERY COMPONENT SHOULD BE MEMOIZED IN THAT WAY SO IT IS NOT NECESSARY TO ADD DISPLAY NAME, BUT I DIDN'T HAVE TIME TO DO IT
export const FolderItem = ({
  item,
  onOpenFolder,
  onDeleteFolder
}: FolderItemProps) => {
  const folderName =
    typeof item.content === 'string' ? item.content : item.filename || 'Unknown'
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

//IT SHOULD BE MOVED TO A STYLED COMPONENTS
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
