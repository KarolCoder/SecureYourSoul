import React, { memo, useMemo } from 'react'
import { StyleSheet, ActivityIndicator } from 'react-native'
import { FlashList } from '@shopify/flash-list'
import { StyledView, StyledText } from '../styled'
// Removed unused imports: Card, Button
import { FileItem } from './FileItem'
import { FolderItem } from '../DriveScreen/FolderItem'
import { theme } from '../../theme'
import { type ParsedDriveEntry } from '../../utils/dataParsingUtils'

type DriveEntry = ParsedDriveEntry

interface FileListProps {
  folderFiles: DriveEntry[]
  folderName: string
  refreshing: boolean
  onRefresh: () => void
  onOpenFolder?: (folderName: string) => void
  onDeleteFolder?: (folderName: string) => void
}

export const FileList = memo<FileListProps>(
  ({
    folderFiles,
    folderName,
    refreshing,
    onRefresh,
    onOpenFolder,
    onDeleteFolder
  }) => {
    const renderItem = useMemo(() => {
      const RenderItem = ({ item }: { item: DriveEntry }) => {
        if (item.isFolder) {
          return (
            <FolderItem
              item={item}
              onOpenFolder={
                onOpenFolder ||
                (() => {
                  // Default empty handler
                })
              }
              onDeleteFolder={
                onDeleteFolder ||
                (() => {
                  // Default empty handler
                })
              }
            />
          )
        }
        return <FileItem item={item} />
      }
      RenderItem.displayName = 'RenderFileItem'
      return RenderItem
    }, [onOpenFolder, onDeleteFolder])

    if (folderFiles.length === 0) {
      return (
        <StyledView style={styles.emptyContainer}>
          <StyledText style={styles.emptyTitle}>
            No photos in this folder yet
          </StyledText>
          <StyledText style={styles.emptySubtitle}>
            Add photos to get started
          </StyledText>
        </StyledView>
      )
    }

    return (
      <StyledView style={styles.container}>
        {refreshing && (
          <StyledView style={styles.loadingContainer}>
            <ActivityIndicator size='small' color='#b0d943' />
            <StyledText style={styles.loadingText}>
              Loading photos...
            </StyledText>
          </StyledView>
        )}

        <FlashList
          data={folderFiles}
          renderItem={renderItem}
          numColumns={2}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </StyledView>
    )
  }
)

FileList.displayName = 'FileList'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 20
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20
  },
  emptyTitle: {
    fontSize: 18,
    color: theme.colors.text.primary,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center'
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.text.tertiary,
    textAlign: 'center'
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    paddingVertical: 8
  },
  loadingText: {
    fontSize: 14,
    color: theme.colors.accent.primary,
    marginLeft: 8,
    fontWeight: '500'
  },
  listContainer: {
    padding: 8
  }
})
