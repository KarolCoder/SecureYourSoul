// Import only the hooks we actually use in this file
import {
  useConnectionStore,
  useWorkletRPC,
  useGeneratedKey,
  useIsConnected
} from './connectionStore'
import { useDataStore, useDataList } from './dataStore'
import { useActionsStore } from './actionsStore'

// Re-export everything for external use
export {
  useConnectionStore,
  useConnectionState,
  useWorkletRPC,
  useGeneratedKey,
  useIsConnected,
  useIsConnecting
} from './connectionStore'
export {
  useDataStore,
  useDataList,
  useIsDataLoading,
  useDataError,
  useFolders,
  useFiles,
  type DriveEntry
} from './dataStore'
export { useActionsStore, type UploadFileData } from './actionsStore'

// Combined hook for backward compatibility during migration
export const useWorklet = () => {
  const workletRPC = useWorkletRPC()
  const generatedKey = useGeneratedKey()
  const dataList = useDataList()
  const isConnected = useIsConnected()
  const actions = useActionsStore()

  return {
    // Connection state
    workletRPC,
    isWorkletStarted: isConnected,
    generatedKey,
    connectedWithExistingDrive:
      useConnectionStore.getState().connectedWithExistingDrive,

    // Data
    dataList,

    // Actions
    startWorklet: actions.startWorklet,
    createFolder: actions.createFolder,
    listFolders: actions.listFolders,
    getPeers: actions.getPeers,
    getDriveKey: actions.getDriveKey,
    deleteFolder: actions.deleteFolder,
    uploadFile: actions.uploadFile,
    clearAll: actions.clearAll,
    resetData: () => useDataStore.getState().clearData()
  }
}
