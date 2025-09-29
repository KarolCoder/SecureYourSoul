import React, { createContext, useContext, useState, ReactNode } from 'react'

//THERE SHOULD BE A SEPARATE CONTEXT FOR MODALS AND ALERTS, I'VE ADDED IT SO IT IS EASIER TO PASS A PROPS ACROSS COMPONENTS

interface ImageModalData {
  imageUri: string
  filename?: string
}

interface AlertData {
  title: string
  message: string
  buttons?: {
    text: string
    onPress: () => void
    style?: 'default' | 'cancel' | 'destructive'
  }[]
}

interface TextInputAlertData {
  title: string
  message: string
  placeholder?: string
  defaultValue?: string
  onConfirm: (text: string) => void
  onCancel: () => void
}

interface ModalContextType {
  // Image Modal
  imageModal: {
    visible: boolean
    data: ImageModalData | null
  }
  showImageModal: (data: ImageModalData) => void
  hideImageModal: () => void

  // Alert Modal
  alert: {
    visible: boolean
    data: AlertData | null
  }
  showAlert: (data: AlertData) => void
  hideAlert: () => void

  // Text Input Alert Modal
  textInputAlert: {
    visible: boolean
    data: TextInputAlertData | null
  }
  showTextInputAlert: (data: TextInputAlertData) => void
  hideTextInputAlert: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

interface ModalProviderProps {
  children: ReactNode
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [imageModal, setImageModal] = useState<{
    visible: boolean
    data: ImageModalData | null
  }>({
    visible: false,
    data: null
  })

  const [alert, setAlert] = useState<{
    visible: boolean
    data: AlertData | null
  }>({
    visible: false,
    data: null
  })

  const [textInputAlert, setTextInputAlert] = useState<{
    visible: boolean
    data: TextInputAlertData | null
  }>({
    visible: false,
    data: null
  })

  const showImageModal = (data: ImageModalData) => {
    setImageModal({ visible: true, data })
  }

  const hideImageModal = () => {
    setImageModal({ visible: false, data: null })
  }

  const showAlert = (data: AlertData) => {
    setAlert({ visible: true, data })
  }

  const hideAlert = () => {
    setAlert({ visible: false, data: null })
  }

  const showTextInputAlert = (data: TextInputAlertData) => {
    setTextInputAlert({ visible: true, data })
  }

  const hideTextInputAlert = () => {
    setTextInputAlert({ visible: false, data: null })
  }

  const value: ModalContextType = {
    imageModal,
    showImageModal,
    hideImageModal,
    alert,
    showAlert,
    hideAlert,
    textInputAlert,
    showTextInputAlert,
    hideTextInputAlert
  }

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
}

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}
