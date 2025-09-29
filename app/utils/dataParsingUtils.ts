// Utility functions for parsing nested data structures

export type ParsedDriveEntry = {
  type: string
  content: string
  filename?: string
  isFolder?: boolean
}

export type RawDriveEntry = {
  type: string
  content: string | object
  filename?: string
}

/**
 * Parses nested drive entries to extract proper content
 * Handles cases where content is nested: {content: {content: "", type: "text"}}
 */
export const parseDriveEntries = (
  rawEntries: RawDriveEntry[]
): ParsedDriveEntry[] => {
  return rawEntries.map((entry) => {
    let parsedContent = ''
    let parsedType = entry.type
    let isFolder = false

    // Handle nested content structure
    if (entry.content && typeof entry.content === 'object') {
      // If content has nested content and type
      const contentObj = entry.content as { content?: string; type?: string }
      if (contentObj.content !== undefined && contentObj.type) {
        parsedContent = contentObj.content || ''
        parsedType = contentObj.type || entry.type
      } else {
        // If content is an object but doesn't have nested structure
        parsedContent = JSON.stringify(entry.content)
      }
    } else if (typeof entry.content === 'string') {
      parsedContent = entry.content
    } else {
      parsedContent = String(entry.content || '')
    }

    // Determine if it's a folder based on type or content
    // Only check for '/' in content if it's not a file type
    const isImageFile =
      parsedType === 'image' ||
      parsedType === 'heic' ||
      parsedContent.match(
        /\.(jpg|jpeg|png|gif|webp|bmp|svg|ico|tiff|tif|heic|heif)$/i
      )

    isFolder =
      parsedType === 'folder' ||
      parsedType === 'directory' ||
      (parsedContent.includes('/') && !isImageFile)

    return {
      type: parsedType,
      content: parsedContent,
      filename: entry.filename,
      isFolder
    }
  })
}

export const getFolders = (
  parsedEntries: ParsedDriveEntry[]
): ParsedDriveEntry[] => {
  return parsedEntries.filter((entry) => entry.isFolder)
}

export const getFiles = (
  parsedEntries: ParsedDriveEntry[]
): ParsedDriveEntry[] => {
  return parsedEntries.filter((entry) => !entry.isFolder)
}

export const getItemsForRootFolder = (
  parsedEntries: ParsedDriveEntry[],
  folderName: string
): ParsedDriveEntry[] => {
  return parsedEntries.filter((entry) => {
    if (entry.isFolder) {
      return entry.filename && entry.filename.startsWith(`/${folderName}/`)
    }

    return (
      entry.filename &&
      entry.filename.startsWith(`/${folderName}/`) &&
      !entry.filename.endsWith('.gitkeep')
    )
  })
}
