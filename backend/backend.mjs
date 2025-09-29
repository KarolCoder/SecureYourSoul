// /* global Bare, BareKit */

import RPC from 'bare-rpc'
import fs from 'bare-fs'
import URL from 'bare-url'
import { join } from 'bare-path'
import {
  RPC_RESET,
  RPC_MESSAGE,
  RPC_INVITE,
  RPC_CREATE_FOLDER,
  RPC_LIST_FOLDERS,
  RPC_GET_DRIVE_KEY,
  RPC_DELETE_FOLDER,
  RPC_UPLOAD_FILE,
  RPC_CLEAR_ALL,
  RPC_LOAD_ALL_DATA
} from '../rpc-commands.mjs'

import Hyperdrive from 'hyperdrive'
import Corestore from 'corestore'
import Hyperswarm from 'hyperswarm'
import b4a from 'b4a'
const { IPC } = BareKit

//BACKEND LOOKS LIKE SHIT, IT SHOULD BE REWRITTEN, AND MOVED TO A MANY FOLDERS TO MAKE IT MORE READABLE AND MAINTAINABLE

const path = join(URL.fileURLToPath(Bare.argv[0]), 'hyperdrive-example')

console.log('🚀 Starting Hyperdrive backend...')
console.log('📁 Base path:', path)
console.log('🔧 Bare.argv:', Bare.argv)

let driveInstance = null // Will be set after drive is ready
let swarm = null
let store = null

const rpc = new RPC(IPC, async (req, error) => {
  console.log('📡 RPC request received:', req.command, 'Error:', error)
  if (error) {
    console.error('❌ RPC error:', error)
    return
  }

  // Handle RPC requests
  if (req.command === RPC_CREATE_FOLDER) {
    const folderPath = b4a.toString(req.data)
    console.log('📁 Creating folder:', folderPath)
    if (!driveInstance) {
      console.error('❌ Drive not ready yet')
      return
    }
    try {
      // Create a folder by putting an empty file with a trailing slash
      const folderPathWithSlash = folderPath.endsWith('/')
        ? folderPath
        : folderPath + '/'
      await driveInstance.put(folderPathWithSlash + '.gitkeep', Buffer.from(''))
      console.log('✅ Folder created successfully:', folderPathWithSlash)

      // Send success response to UI
      const req = rpc.request(RPC_CREATE_FOLDER)
      req.send(
        JSON.stringify({
          success: true,
          folderPath: folderPathWithSlash,
          message: 'Folder created successfully'
        })
      )
    } catch (error) {
      console.error('❌ Error creating folder:', error.message)

      // Send error response to UI
      const req = rpc.request(RPC_CREATE_FOLDER)
      req.send(
        JSON.stringify({
          success: false,
          error: error.message,
          message: 'Failed to create folder'
        })
      )
    }
  }

  if (req.command === RPC_LIST_FOLDERS) {
    console.log('📂 Listing folders - using loadAllData...')
    await loadAllData()
  }

  if (req.command === RPC_GET_DRIVE_KEY) {
    console.log('🔑 Getting drive key...')
    if (!driveInstance) {
      console.error('❌ Drive not ready yet')
      return
    }
    try {
      const driveKey = driveInstance.key.toString('hex')
      console.log('🔑 Drive key:', driveKey.substring(0, 10) + '...')

      // Send drive key to UI
      const req = rpc.request(RPC_GET_DRIVE_KEY)
      req.send(driveKey)
      console.log('✅ Drive key sent to UI')
    } catch (error) {
      console.error('❌ Error getting drive key:', error.message)
    }
  }

  if (req.command === RPC_DELETE_FOLDER) {
    const folderPath = b4a.toString(req.data)
    console.log('🗑️ Deleting folder:', folderPath)
    if (!driveInstance) {
      console.error('❌ Drive not ready yet')
      return
    }
    try {
      // Delete folder by removing the .gitkeep file
      const folderPathWithSlash = folderPath.endsWith('/')
        ? folderPath
        : folderPath + '/'
      await driveInstance.del(folderPathWithSlash + '.gitkeep')
      console.log('✅ Folder deleted successfully:', folderPathWithSlash)

      // Send success response to UI
      const req = rpc.request(RPC_DELETE_FOLDER)
      req.send(
        JSON.stringify({
          success: true,
          folderPath: folderPathWithSlash,
          message: 'Folder deleted successfully'
        })
      )
    } catch (error) {
      console.error('❌ Error deleting folder:', error.message)

      // Send error response to UI
      const req = rpc.request(RPC_DELETE_FOLDER)
      req.send(
        JSON.stringify({
          success: false,
          error: error.message,
          message: 'Failed to delete folder'
        })
      )
    }
  }

  //THIS FUNCTION IS VERY BAD, IT IS NOT OPTIMIZED FOR PERFORMANCE
  if (req.command === RPC_UPLOAD_FILE) {
    try {
      const uploadData = JSON.parse(b4a.toString(req.data))
      const { folderName, fileName, fileData, fileType } = uploadData

      console.log('📤 Uploading file:', fileName, 'to folder:', folderName)
      console.log('📤 File type:', fileType)
      console.log('📤 File data length:', fileData?.length || 0)
      console.log('📤 Folder name:', folderName)

      // Sprawdź czy to jest HEIC/HEIF
      const isHeicFile =
        fileName?.toLowerCase().endsWith('.heic') ||
        fileName?.toLowerCase().endsWith('.heif') ||
        fileType === 'heic' ||
        fileType === 'heif'

      if (isHeicFile) {
        console.log('📤 Detected HEIC/HEIF file - using binary mode')
      }

      if (!driveInstance) {
        console.error('❌ Drive not ready yet')
        return
      }

      // Create file path in the folder
      // Ensure folderName starts with / but doesn't have double slashes
      const normalizedFolderName = folderName.startsWith('/')
        ? folderName
        : `/${folderName}`
      const filePath = `${normalizedFolderName}/${fileName}`
      console.log('📤 File path:', filePath)

      // Convert base64 data to buffer
      const fileBuffer = Buffer.from(fileData, 'base64')
      console.log('📤 Buffer size:', fileBuffer.length)

      // Upload file to hyperdrive
      await driveInstance.put(filePath, fileBuffer)
      console.log('✅ File uploaded successfully:', filePath)

      // Send the file data back to UI so it can be displayed immediately
      try {
        const data = await driveInstance.get(filePath)
        if (data) {
          // Detect file type based on extension
          const fileExtension = fileName.split('.').pop()?.toLowerCase()
          const isImageFile = [
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
          ].includes(fileExtension)
          const isPdfFile = fileExtension === 'pdf'
          const isBinaryFile = isImageFile || isPdfFile

          console.log(
            `🔍 File type detection: ${fileName} -> ${fileExtension} (binary: ${isBinaryFile})`
          )

          let parsedData
          if (isBinaryFile) {
            // For binary files, send as base64
            const base64Content = data.toString('base64')
            parsedData = {
              type: isImageFile ? 'image' : 'pdf',
              content: base64Content,
              filename: filePath,
              isBinary: true
            }
            console.log(
              `📷 Binary file (${isImageFile ? 'image' : 'pdf'}): ${fileName}, base64 length: ${base64Content.length}`
            )
          } else {
            // For text files, process as before
            const content = data.toString()
            parsedData = { type: 'text', content: content, filename: filePath }
            console.log(
              `📖 Text file content length: ${content.length} characters`
            )
          }

          const fileReq = rpc.request(RPC_MESSAGE)
          fileReq.send(JSON.stringify(parsedData))
          console.log('📤 Sent uploaded file data to UI')
        }
      } catch (error) {
        console.error('❌ Error reading uploaded file:', error)
      }

      // Send success response to UI
      const successReq = rpc.request(RPC_UPLOAD_FILE)
      successReq.send(
        JSON.stringify({
          success: true,
          filePath: filePath,
          message: 'File uploaded successfully'
        })
      )
    } catch (error) {
      console.error('❌ Error uploading file:', error.message)

      // Send error response to UI
      const errorReq = rpc.request(RPC_UPLOAD_FILE)
      errorReq.send(
        JSON.stringify({
          success: false,
          error: error.message,
          message: 'Failed to upload file'
        })
      )
    }
  }

  if (req.command === RPC_CLEAR_ALL) {
    try {
      console.log('🗑️ Clearing all data from drive...')

      if (!driveInstance) {
        console.error('❌ Drive not ready yet')
        return
      }

      // Always use manual deletion since clearAll() might not work properly
      console.log('Using manual deletion to ensure all files are removed...')

      // Get all files and delete them manually
      const files = []
      await new Promise((resolve, reject) => {
        const stream = driveInstance.list()
        stream.on('data', (data) => {
          if (data.key) {
            files.push(data.key)
            console.log('Found file to delete:', data.key)
          }
        })
        stream.on('end', resolve)
        stream.on('error', reject)
      })

      console.log(`Found ${files.length} files to delete manually`)

      if (files.length === 0) {
        console.log('No files found to delete')
      } else {
        // Delete all files in parallel for better performance
        const deletePromises = files.map(async (fileKey) => {
          try {
            await driveInstance.del(fileKey)
            console.log('Successfully deleted:', fileKey)
          } catch (deleteError) {
            console.error('Error deleting file:', fileKey, deleteError)
          }
        })

        await Promise.all(deletePromises)
        console.log('All files deleted manually')
      }

      // Verify deletion by listing files again
      const remainingFiles = []
      await new Promise((resolve, reject) => {
        const stream = driveInstance.list()
        stream.on('data', (data) => {
          if (data.key) remainingFiles.push(data.key)
        })
        stream.on('end', resolve)
        stream.on('error', reject)
      })

      console.log(`Remaining files after deletion: ${remainingFiles.length}`)
      if (remainingFiles.length > 0) {
        console.log('Remaining files:', remainingFiles)
      }

      // Send success response to UI
      const successReq = rpc.request(RPC_CLEAR_ALL)
      successReq.send(
        JSON.stringify({
          success: true,
          message: `All data cleared. Deleted ${files.length} files, ${remainingFiles.length} remaining.`,
          deletedCount: files.length,
          remainingCount: remainingFiles.length
        })
      )
    } catch (error) {
      console.error('❌ Error clearing all data:', error.message)

      // Send error response to UI
      const errorReq = rpc.request(RPC_CLEAR_ALL)
      errorReq.send(
        JSON.stringify({
          success: false,
          error: error.message,
          message: 'Failed to clear all data'
        })
      )
    }
  }
})

// Use persistent storage path
const persistentPath = join(path, 'persistent')
const keyFilePath = join(persistentPath, 'hyperdrive-key.txt')
console.log('📂 Persistent path:', persistentPath)

// Create persistent directory if it doesn't exist
if (!fs.existsSync(persistentPath)) {
  console.log('📁 Creating persistent directory...')
  fs.mkdirSync(persistentPath, { recursive: true })
} else {
  console.log('📁 Using existing persistent directory')
}

// Function to save drive key
function saveDriveKey(key) {
  try {
    fs.writeFileSync(keyFilePath, key)
    console.log('💾 Drive key saved:', key.substring(0, 10) + '...')
  } catch (error) {
    console.error('❌ Error saving drive key:', error.message)
  }
}

// Function to load drive key
function loadDriveKey() {
  try {
    if (fs.existsSync(keyFilePath)) {
      const key = fs.readFileSync(keyFilePath, 'utf8').trim()
      console.log('📖 Loaded drive key:', key.substring(0, 10) + '...')
      return key
    }
  } catch (error) {
    console.error('❌ Error loading drive key:', error.message)
  }
  return null
}

const driveKeyFromArgs = Bare.argv[1] // This will be the drive key for connecting
const savedDriveKey = loadDriveKey()

// Use key from args if provided, otherwise use saved key
const driveKey =
  driveKeyFromArgs && driveKeyFromArgs.trim() !== ''
    ? driveKeyFromArgs
    : savedDriveKey

console.log(
  '🔑 Drive key from args:',
  driveKeyFromArgs ? `${driveKeyFromArgs.substring(0, 10)}...` : 'none'
)
console.log(
  '🔑 Saved drive key:',
  savedDriveKey ? `${savedDriveKey.substring(0, 10)}...` : 'none'
)
console.log(
  '🔑 Using drive key:',
  driveKey ? `${driveKey.substring(0, 10)}...` : 'none (creating new)'
)

console.log('💾 Creating Corestore...')
store = new Corestore(persistentPath)

console.log('🌐 Creating Hyperswarm...')
swarm = new Hyperswarm()

let drive

if (driveKey && driveKey.trim() !== '') {
  // Connect to existing hyperdrive using the key
  console.log('🔗 Connecting to existing Hyperdrive...')
  drive = new Hyperdrive(store, driveKey)
} else {
  // Create new hyperdrive
  console.log('🆕 Creating new Hyperdrive...')
  drive = new Hyperdrive(store)
}

Bare.on('teardown', () => {
  console.log('🛑 Teardown initiated...')
  if (swarm) {
    swarm.destroy()
    console.log('🌐 Hyperswarm destroyed')
  }
  if (drive) {
    drive.close()
    console.log('💾 Drive closed')
  }
  if (store) {
    store.close()
    console.log('🗄️ Store closed')
  }
  // Don't clean up persistent directory - keep data
  console.log('✅ Teardown completed')
})

console.log('⏳ Waiting for drive to be ready...')
await drive.ready()
console.log('✅ Drive is ready!')
console.log('🔑 Drive key:', drive.key.toString('hex'))
console.log('🆔 Drive ID:', drive.id)

// Set drive instance for RPC handling
driveInstance = drive

// Configure Hyperswarm for P2P networking
console.log('🌐 Setting up Hyperswarm...')
const done = drive.findingPeers()
swarm.on('connection', (socket) => {
  console.log('🔗 New peer connection established')
  drive.replicate(socket)
})
swarm.join(drive.discoveryKey)
await swarm.flush()
done()
console.log('✅ Hyperswarm configured and peers found')

// Helper function to load all data (folders and files)
async function loadAllData() {
  console.log('📂 Loading all data (folders and files)...')
  if (!driveInstance) {
    console.error('❌ Drive not ready yet')
    return
  }

  try {
    const folders = new Set()
    const allItems = []
    let fileCount = 0

    // List all entries and extract folder paths + load all files
    for await (const entry of driveInstance.list('/')) {
      console.log('🔍 Entry:', entry.key)

      // Extract folder path if it's a file
      if (entry.key.includes('/')) {
        const pathParts = entry.key.split('/')
        if (pathParts.length > 1) {
          const folderPath = pathParts.slice(0, -1).join('/')
          if (folderPath) {
            folders.add(folderPath)
          }
        }
      }

      // Load file data if it's not a symlink
      if (entry.value && !entry.value.linkname) {
        fileCount++
        console.log(`📄 Processing file ${fileCount}: ${entry.key}`)
        try {
          const data = await driveInstance.get(entry.key)
          if (data) {
            // Use helper function to parse file data
            const parsedData = parseFileData(entry.key, data)
            allItems.push(parsedData)
          } else {
            console.log('⚠️ No data found for file:', entry.key)
          }
        } catch (error) {
          console.error('❌ Error reading file:', entry.key, error.message)
        }
      }
    }

    const folderList = Array.from(folders).sort()
    const driveKey = driveInstance.key.toString('hex')
    console.log('📂 Found folders:', folderList)
    console.log('🔑 Drive key:', driveKey.substring(0, 10) + '...')
    console.log(`✅ Processed ${fileCount} files`)

    // Send everything together - folders and files
    const req = rpc.request(RPC_LOAD_ALL_DATA)
    req.send(
      JSON.stringify({
        folders: folderList,
        files: allItems,
        driveKey: driveKey
      })
    )
  } catch (error) {
    console.error('❌ Error loading all data:', error.message)
  }
}

// Helper function to parse file data
function parseFileData(fileName, data) {
  const fileExtension = fileName.split('.').pop()?.toLowerCase()
  const isImageFile = [
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
  ].includes(fileExtension)
  const isPdfFile = fileExtension === 'pdf'
  const isBinaryFile = isImageFile || isPdfFile

  console.log(
    `🔍 File type detection: ${fileName} -> ${fileExtension} (binary: ${isBinaryFile})`
  )

  let parsedData
  if (isBinaryFile) {
    // For binary files, send as base64
    const base64Content = data.toString('base64')

    // Set specific type for HEIC/HEIF files
    let fileType = isImageFile ? 'image' : 'pdf'
    if (fileExtension === 'heic') {
      fileType = 'heic'
    } else if (fileExtension === 'heif') {
      fileType = 'heif'
    }

    parsedData = {
      type: fileType,
      content: base64Content,
      filename: fileName,
      isBinary: true
    }
    console.log(
      `📷 Binary file (${fileType}): ${fileName}, base64 length: ${base64Content.length}`
    )
  } else {
    // For text files, process as before
    const content = data.toString()
    console.log(`📖 Text file content length: ${content.length} characters`)

    // Try to parse as JSON, if it fails, treat as plain text
    try {
      parsedData = JSON.parse(content)
      console.log('✅ Parsed as JSON')
    } catch {
      parsedData = {
        type: 'text',
        content: content,
        filename: fileName
      }
      console.log('📝 Treated as plain text')
    }
  }

  return parsedData
}

// Function to load drive data
async function loadDriveData() {
  console.log('📋 Loading drive data...')
  console.log('🔍 Drive version:', drive.version)
  console.log('🔍 Drive writable:', drive.writable)
  console.log('🔍 Drive readable:', drive.readable)

  const req = rpc.request(RPC_RESET)
  req.send('data')
  console.log('🔄 Sent reset signal to UI')

  // Use loadAllData to send everything at once
  await loadAllData()
}

// Send the drive key back to UI so others can connect (only for new drives)
if (!driveKey || driveKey.trim() === '') {
  console.log('📤 Sending drive key to UI...')
  const driveKeyHex = drive.key.toString('hex')
  saveDriveKey(driveKeyHex) // Save the new key
  const req = rpc.request(RPC_INVITE)
  req.send(driveKeyHex)
  console.log('✅ Drive key sent to UI and saved')
} else {
  // For existing drives, load initial data
  console.log('📋 Loading initial data from existing drive...')
  await loadDriveData()

  // Send connection success signal to UI
  console.log('📤 Sending connection success signal...')
  const req = rpc.request(RPC_INVITE)
  req.send('connected')
  console.log('✅ Connection success signal sent')
}

// Watch for changes in the drive
// IT IS ALSO A SHIT RIGHT NOW, IT CLEAR UI AND THEN LOAD ALL DATA AGAIN, IT IS NOT OPTIMIZED FOR PERFORMANCE
console.log('👀 Starting to watch drive for changes...')
const watcher = drive.watch('/')
for await (const [current, previous] of watcher) {
  console.log('📝 Drive updated!')
  console.log('📊 Current version:', current.version)
  console.log('📊 Previous version:', previous.version)

  const req = rpc.request(RPC_RESET)
  req.send('data')
  console.log('🔄 Sent reset signal to UI')

  // Use loadAllData to send everything at once
  await loadAllData()
}
