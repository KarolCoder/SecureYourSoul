import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { Alert } from 'react-native'
import { documentDirectory } from 'expo-file-system'
import { Worklet } from 'react-native-bare-kit'
import bundle from '../app.bundle.mjs'
import RPC from 'bare-rpc'
import b4a from 'b4a'
import { logger } from '../utils/logger'
import { useConnectionStore } from './connectionStore'
import { useDataStore } from './dataStore'
import {
  RPC_RESET,
  RPC_MESSAGE,
  RPC_INVITE,
  RPC_CREATE_FOLDER,
  RPC_LIST_FOLDERS,
  RPC_GET_PEERS,
  RPC_GET_DRIVE_KEY,
  RPC_DELETE_FOLDER,
  RPC_UPLOAD_FILE,
  RPC_CLEAR_ALL,
  RPC_LOAD_ALL_DATA
} from '../../rpc-commands.mjs'

// Types for RPC and Worklet

type RPCInstance = {
  request: (command: number) => {
    send: (data: string) => void
  }
  close?: () => void
  destroy?: () => void
}

// Types
export type UploadFileData = {
  folderName: string
  fileName: string
  fileData: string // base64
  fileType: string
}

interface ActionsStore {
  // Actions
  startWorklet: (key?: string) => Promise<void>
  createFolder: (folderName: string) => Promise<void>
  listFolders: () => Promise<void>
  getPeers: () => Promise<void>
  getDriveKey: () => Promise<string | null>
  deleteFolder: (folderName: string) => Promise<void>
  uploadFile: (uploadData: UploadFileData) => Promise<void>
  clearAll: () => Promise<void>
}

export const useActionsStore = create<ActionsStore>()(
  subscribeWithSelector((set, get) => ({
    startWorklet: async (key?: string) => {
      const connectionStore = useConnectionStore.getState()

      try {
        connectionStore.setState('connecting')

        // Clean up existing RPC connection if running
        if (connectionStore.workletRPC) {
          try {
            const rpc = connectionStore.workletRPC as {
              close?: () => void
              destroy?: () => void
            }
            if (rpc.close && typeof rpc.close === 'function') {
              rpc.close()
            } else if (rpc.destroy && typeof rpc.destroy === 'function') {
              rpc.destroy()
            }
          } catch (error) {
            logger.error('Error cleaning up existing RPC:', error)
          }
          connectionStore.setWorkletRPC(null)
        }

        const worklet = new Worklet()
        worklet.start('/app.bundle', bundle, [
          String(documentDirectory),
          key || ''
        ])

        const { IPC } = worklet

        const rpc = new RPC(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          IPC as any, // RPC library expects specific Duplex type
          (req: { command: number; data: unknown }) => {
            const connectionStore = useConnectionStore.getState()
            const dataStore = useDataStore.getState()

            if (req.command === RPC_MESSAGE) {
              try {
                const data = b4a.toString(req.data as Buffer)
                const parsedData = JSON.parse(data)
                const entry = {
                  type: parsedData.type || 'unknown',
                  content: parsedData.content || parsedData,
                  filename: parsedData.filename
                }
                dataStore.addDataEntry(entry)
              } catch (error) {
                logger.error('Error processing RPC_MESSAGE:', error)
              }
            }

            if (req.command === RPC_RESET) {
              dataStore.clearData()
            }

            if (req.command === RPC_INVITE) {
              try {
                const inviteData = b4a.toString(req.data as Buffer)
                if (inviteData === 'connected') {
                  connectionStore.setGeneratedKey('')
                  connectionStore.setConnectedWithExistingDrive(true)
                } else {
                  connectionStore.setGeneratedKey(inviteData)
                }
              } catch (error) {
                logger.error('Error processing RPC_INVITE:', error)
              }
            }

            if (
              req.command === RPC_LIST_FOLDERS ||
              req.command === RPC_LOAD_ALL_DATA
            ) {
              try {
                const folderData = b4a.toString(req.data as Buffer)
                const response = JSON.parse(folderData)

                const allEntries = []

                // Add folders
                if (response.folders) {
                  const folderEntries = response.folders.map(
                    (folder: string) => ({
                      type: 'folder',
                      content: folder,
                      filename: folder
                    })
                  )
                  allEntries.push(...folderEntries)
                }

                // Add files
                if (response.files) {
                  allEntries.push(...response.files)
                }

                dataStore.setDataList(allEntries)
              } catch (error) {
                logger.error('Error processing folder list:', error)
              }
            }

            if (req.command === RPC_GET_DRIVE_KEY) {
              try {
                const driveKey = b4a.toString(req.data as Buffer)
                connectionStore.setGeneratedKey(driveKey)
              } catch (error) {
                logger.error('Error processing drive key:', error)
              }
            }

            if (req.command === RPC_UPLOAD_FILE) {
              try {
                const responseData = b4a.toString(req.data as Buffer)
                const response = JSON.parse(responseData)
                logger.log('📤 Upload file response:', response)

                if (response.success) {
                  logger.log(
                    '✅ File uploaded successfully:',
                    response.filePath
                  )

                  const fileName =
                    response.filePath.split('/').pop() || 'Unknown'
                  const fileExtension = fileName.split('.').pop()?.toLowerCase()
                  const imageExtensions = [
                    'jpg',
                    'jpeg',
                    'png',
                    'gif',
                    'webp',
                    'bmp',
                    'svg',
                    'ico',
                    'tiff',
                    'tif',
                    'heic',
                    'heif'
                  ]
                  const isImageFile = imageExtensions.includes(
                    fileExtension || ''
                  )
                  const isPdfFile = fileExtension === 'pdf'

                  const newEntry = {
                    type: isImageFile ? 'image' : isPdfFile ? 'pdf' : 'file',
                    content: '',
                    filename: response.filePath
                  }

                  dataStore.addDataEntry(newEntry)

                  Alert.alert(
                    'Success',
                    `File uploaded successfully to ${response.filePath}`
                  )
                } else {
                  logger.error('❌ File upload failed:', response.error)
                  Alert.alert(
                    'Upload Failed',
                    response.error || 'Failed to upload file'
                  )
                }
              } catch (error) {
                logger.error('Error processing upload response:', error)
                Alert.alert('Upload Error', 'Failed to process upload response')
              }
            }
          }
        )

        connectionStore.setWorkletRPC(rpc)
        connectionStore.setState('connected')
      } catch (error) {
        logger.error('Failed to start worklet:', error)
        connectionStore.setState('error')
        Alert.alert(
          'Connection Error',
          'Failed to start worklet. Please try again.'
        )
      }
    },

    createFolder: async (folderName: string) => {
      const connectionStore = useConnectionStore.getState()

      if (!connectionStore.workletRPC) {
        logger.error('Worklet RPC not available for folder creation')
        Alert.alert('Error', 'Connection not ready. Please try again.')
        return
      }

      if (!folderName.trim()) {
        Alert.alert('Error', 'Folder name cannot be empty')
        return
      }

      try {
        const rpc = connectionStore.workletRPC as RPCInstance
        const req = rpc.request(RPC_CREATE_FOLDER)
        req.send(folderName)
      } catch (error) {
        logger.error('Error creating folder:', error)
        Alert.alert('Error', 'Failed to create folder. Please try again.')
      }
    },

    listFolders: async () => {
      const connectionStore = useConnectionStore.getState()

      if (!connectionStore.workletRPC) {
        logger.error('Worklet RPC not available for listing folders')
        Alert.alert('Error', 'Connection not ready. Please try again.')
        return
      }

      try {
        const rpc = connectionStore.workletRPC as RPCInstance
        const req = rpc.request(RPC_LIST_FOLDERS)
        req.send('')
      } catch (error) {
        logger.error('Error listing folders:', error)
        Alert.alert('Error', 'Failed to list folders. Please try again.')
      }
    },

    getPeers: async () => {
      const connectionStore = useConnectionStore.getState()

      if (!connectionStore.workletRPC) {
        logger.error('Worklet RPC not available for getting peers')
        Alert.alert('Error', 'Connection not ready. Please try again.')
        return
      }

      try {
        const rpc = connectionStore.workletRPC as RPCInstance
        const req = rpc.request(RPC_GET_PEERS)
        req.send('')
      } catch (error) {
        logger.error('Error getting peers:', error)
        Alert.alert(
          'Error',
          'Failed to get peer information. Please try again.'
        )
      }
    },

    getDriveKey: async () => {
      const connectionStore = useConnectionStore.getState()

      if (!connectionStore.workletRPC) {
        logger.error('Worklet RPC not available')
        return null
      }

      try {
        const rpc = connectionStore.workletRPC as RPCInstance
        const req = rpc.request(RPC_GET_DRIVE_KEY)
        req.send('')
        return connectionStore.generatedKey
      } catch (error) {
        logger.error('Error getting drive key:', error)
        return null
      }
    },

    deleteFolder: async (folderName: string) => {
      const connectionStore = useConnectionStore.getState()

      if (!connectionStore.workletRPC) {
        logger.error('RPC not available for folder deletion')
        Alert.alert('Error', 'Connection not ready. Please try again.')
        return
      }

      try {
        const rpc = connectionStore.workletRPC as RPCInstance
        const req = rpc.request(RPC_DELETE_FOLDER)
        req.send(folderName)
      } catch (error) {
        logger.error('Error deleting folder:', error)
        Alert.alert('Error', 'Failed to delete folder. Please try again.')
      }
    },

    uploadFile: async (uploadData: UploadFileData) => {
      const connectionStore = useConnectionStore.getState()

      if (!connectionStore.workletRPC) {
        logger.error('RPC not available for file upload')
        Alert.alert('Error', 'Connection not ready. Please try again.')
        return
      }

      try {
        const rpc = connectionStore.workletRPC as RPCInstance
        const req = rpc.request(RPC_UPLOAD_FILE)
        req.send(JSON.stringify(uploadData))
      } catch (error) {
        logger.error('Error uploading file:', error)
        Alert.alert('Error', 'Failed to upload file. Please try again.')
      }
    },

    clearAll: async () => {
      const connectionStore = useConnectionStore.getState()

      if (!connectionStore.workletRPC) {
        logger.error('RPC not available for clearing data')
        Alert.alert('Error', 'Connection not ready. Please try again.')
        return
      }

      try {
        const rpc = connectionStore.workletRPC as RPCInstance
        const req = rpc.request(RPC_CLEAR_ALL)
        req.send('')
      } catch (error) {
        logger.error('Error clearing all data:', error)
        Alert.alert('Error', 'Failed to clear data. Please try again.')
      }
    }
  }))
)
