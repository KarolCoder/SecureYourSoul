import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { logger } from '../utils/logger'

// Types
export type DriveEntry = {
  type: string
  content: string | object
  filename?: string
}

interface DataStore {
  // State
  dataList: DriveEntry[]
  isLoading: boolean
  error: string | null

  // Actions
  setDataList: (data: DriveEntry[]) => void
  addDataEntry: (entry: DriveEntry) => void
  updateDataEntry: (index: number, entry: DriveEntry) => void
  removeDataEntry: (index: number) => void
  clearData: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Computed
  getFolders: () => DriveEntry[]
  getFiles: () => DriveEntry[]
  getDataByType: (type: string) => DriveEntry[]
}

export const useDataStore = create<DataStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    dataList: [],
    isLoading: false,
    error: null,

    // Actions
    setDataList: (dataList: DriveEntry[]) => {
      logger.log('Data list updated:', dataList.length, 'entries')
      set({ dataList, error: null })
    },

    addDataEntry: (entry: DriveEntry) => {
      const currentList = get().dataList
      set({ dataList: [...currentList, entry] })
      logger.log('Data entry added:', entry.type, entry.filename)
    },

    updateDataEntry: (index: number, entry: DriveEntry) => {
      const currentList = get().dataList
      if (index >= 0 && index < currentList.length) {
        const newList = [...currentList]
        newList[index] = entry
        set({ dataList: newList })
        logger.log('Data entry updated:', index, entry.type)
      }
    },

    removeDataEntry: (index: number) => {
      const currentList = get().dataList
      if (index >= 0 && index < currentList.length) {
        const newList = currentList.filter((_, i) => i !== index)
        set({ dataList: newList })
        logger.log('Data entry removed:', index)
      }
    },

    clearData: () => {
      logger.log('Data cleared')
      set({ dataList: [], error: null })
    },

    setLoading: (isLoading: boolean) => {
      set({ isLoading })
    },

    setError: (error: string | null) => {
      logger.error('Data store error:', error)
      set({ error })
    },

    // Computed
    getFolders: () => {
      return get().dataList.filter(
        (entry) =>
          entry.type === 'folder' ||
          (typeof entry.content === 'string' && entry.content.includes('/'))
      )
    },

    getFiles: () => {
      return get().dataList.filter(
        (entry) =>
          entry.type !== 'folder' &&
          !(typeof entry.content === 'string' && entry.content.includes('/'))
      )
    },

    getDataByType: (type: string) => {
      return get().dataList.filter((entry) => entry.type === type)
    }
  }))
)

// Selectors for better performance
export const useDataList = () => useDataStore((state) => state.dataList)
export const useIsDataLoading = () => useDataStore((state) => state.isLoading)
export const useDataError = () => useDataStore((state) => state.error)
export const useFolders = () => useDataStore((state) => state.getFolders())
export const useFiles = () => useDataStore((state) => state.getFiles())
