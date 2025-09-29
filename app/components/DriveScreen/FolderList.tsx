import React, { memo, useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { StyledView, StyledText } from '../styled'
// Removed unused imports: Card, Button
import { FolderItem } from './FolderItem'
import { theme } from '../../theme'
import {
  parseDriveEntries,
  getFolders,
  type ParsedDriveEntry,
  type RawDriveEntry
} from '../../utils/dataParsingUtils'

type DriveEntry = RawDriveEntry

interface FolderListProps {
  dataList: DriveEntry[]
  onRefresh: () => void
  onOpenFolder: (folderName: string) => void
  onDeleteFolder: (folderName: string) => void
}

export const FolderList = memo<FolderListProps>(
  ({ dataList, onRefresh, onOpenFolder, onDeleteFolder }) => {
    // Parse the raw data to extract proper content
    const parsedEntries = useMemo(() => parseDriveEntries(dataList), [dataList])
    const folders = useMemo(() => getFolders(parsedEntries), [parsedEntries])

    const renderFolderItem = useMemo(() => {
      const RenderItem = ({ item }: { item: ParsedDriveEntry }) => (
        <FolderItem
          item={item}
          onOpenFolder={onOpenFolder}
          onDeleteFolder={onDeleteFolder}
        />
      )
      RenderItem.displayName = 'RenderFolderItem'
      return RenderItem
    }, [onOpenFolder, onDeleteFolder])

    if (folders.length === 0) {
      return null
    }

    return (
      <StyledView style={styles.container}>
        <StyledView style={styles.headerContainer}>
          <StyledText style={styles.headerTitle}>📁 Your Folders</StyledText>
        </StyledView>

        <FlashList
          data={folders}
          renderItem={renderFolderItem}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </StyledView>
    )
  }
)

FolderList.displayName = 'FolderList'

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background.primary,
    marginBottom: 20
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.accent.primary
  },
  listContainer: {
    paddingHorizontal: 20
  }
})
