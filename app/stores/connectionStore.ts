import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { logger } from '../utils/logger'

type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'error'

type RPCInstance = {
  request: (command: number) => {
    send: (data: string) => void
  }
  close?: () => void
  destroy?: () => void
}

interface ConnectionStore {
  state: ConnectionState
  workletRPC: RPCInstance | null
  generatedKey: string
  connectedWithExistingDrive: boolean

  setState: (state: ConnectionState) => void
  setWorkletRPC: (rpc: RPCInstance | null) => void
  setGeneratedKey: (key: string) => void
  setConnectedWithExistingDrive: (connected: boolean) => void
  isConnected: () => boolean
  isConnecting: () => boolean
}

export const useConnectionStore = create<ConnectionStore>()(
  subscribeWithSelector((set, get) => ({
    state: 'disconnected',
    workletRPC: null,
    generatedKey: '',
    connectedWithExistingDrive: false,

    // Actions
    setState: (state: ConnectionState) => {
      logger.log('Connection state changed:', state)
      set({ state })
    },

    setWorkletRPC: (workletRPC: RPCInstance | null) => {
      set({ workletRPC })
    },

    setGeneratedKey: (generatedKey: string) => {
      logger.log(
        'Generated key updated:',
        generatedKey ? 'Key received' : 'Key cleared'
      )
      set({ generatedKey })
    },

    setConnectedWithExistingDrive: (connectedWithExistingDrive: boolean) => {
      logger.log('Connected with existing drive:', connectedWithExistingDrive)
      set({ connectedWithExistingDrive })
    },

    isConnected: () => get().state === 'connected',
    isConnecting: () => get().state === 'connecting'
  }))
)

// Selectors for better performance
export const useConnectionState = () =>
  useConnectionStore((state) => state.state)
export const useWorkletRPC = () =>
  useConnectionStore((state) => state.workletRPC)
export const useGeneratedKey = () =>
  useConnectionStore((state) => state.generatedKey)
export const useIsConnected = () =>
  useConnectionStore((state) => state.isConnected())
export const useIsConnecting = () =>
  useConnectionStore((state) => state.isConnecting())
