// Utility functions for file operations

// File extension to icon mapping - only images and PDFs
const FILE_EXTENSION_TO_ICON: Record<string, string> = {
  // Images
  jpg: '🖼️',
  jpeg: '🖼️',
  png: '🖼️',
  gif: '🖼️',
  webp: '🖼️',
  bmp: '🖼️',
  svg: '🖼️',
  ico: '🖼️',
  tiff: '🖼️',
  tif: '🖼️',
  heic: '🖼️',
  heif: '🖼️',

  // PDF Documents
  pdf: '📄',

  // Default
  default: '📁'
}

// File type categories - only images and PDFs
export const FILE_TYPE_CATEGORIES = {
  IMAGE: 'image',
  PDF: 'pdf',
  OTHER: 'other'
} as const

// File extension to category mapping - only images and PDFs
const FILE_EXTENSION_TO_CATEGORY: Record<string, string> = {
  // Images
  jpg: FILE_TYPE_CATEGORIES.IMAGE,
  jpeg: FILE_TYPE_CATEGORIES.IMAGE,
  png: FILE_TYPE_CATEGORIES.IMAGE,
  gif: FILE_TYPE_CATEGORIES.IMAGE,
  webp: FILE_TYPE_CATEGORIES.IMAGE,
  bmp: FILE_TYPE_CATEGORIES.IMAGE,
  svg: FILE_TYPE_CATEGORIES.IMAGE,
  ico: FILE_TYPE_CATEGORIES.IMAGE,
  tiff: FILE_TYPE_CATEGORIES.IMAGE,
  tif: FILE_TYPE_CATEGORIES.IMAGE,
  heic: FILE_TYPE_CATEGORIES.IMAGE,
  heif: FILE_TYPE_CATEGORIES.IMAGE,

  // PDF Documents
  pdf: FILE_TYPE_CATEGORIES.PDF
}

export const getFileIcon = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase()
  return FILE_EXTENSION_TO_ICON[ext || ''] || FILE_EXTENSION_TO_ICON.default
}

const getFileCategory = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase()
  return FILE_EXTENSION_TO_CATEGORY[ext || ''] || FILE_TYPE_CATEGORIES.OTHER
}

export const isImageFile = (filename: string): boolean => {
  return getFileCategory(filename) === FILE_TYPE_CATEGORIES.IMAGE
}

// Utility function to get file type display name - only images and PDFs
export const getFileTypeDisplayName = (fileType: string | unknown): string => {
  const TYPE_DISPLAY_NAMES: Record<string, string> = {
    image: 'Image',
    heic: 'HEIC Image',
    heif: 'HEIF Image',
    pdf: 'PDF',
    other: 'File'
  }

  if (typeof fileType === 'string') {
    return TYPE_DISPLAY_NAMES[fileType] || fileType
  }

  return 'file'
}
