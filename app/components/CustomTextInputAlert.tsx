import React, { useState } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  TextInput
} from 'react-native'
import { StyledView, StyledText } from './styled'
import { theme } from '../theme'

// I'VE ADDED IT, BECAUSE THERE WAS ISSUES WITH ALERTS ON ANDROID, SO I DID IT AS A TEMPORARY SOLUTION

const { width: screenWidth } = Dimensions.get('window')

interface CustomTextInputAlertProps {
  visible: boolean
  title: string
  message: string
  placeholder?: string
  defaultValue?: string
  onConfirm: (text: string) => void
  onCancel: () => void
  onBackdropPress?: () => void
}

export const CustomTextInputAlert: React.FC<CustomTextInputAlertProps> = ({
  visible,
  title,
  message,
  placeholder = '',
  defaultValue = '',
  onConfirm,
  onCancel,
  onBackdropPress
}) => {
  const [inputValue, setInputValue] = useState(defaultValue)

  const handleBackdropPress = () => {
    if (onBackdropPress) {
      onBackdropPress()
    } else {
      onCancel()
    }
  }

  const handleConfirm = () => {
    const trimmedValue = inputValue.trim()
    if (trimmedValue) {
      onConfirm(trimmedValue)
    }
    setInputValue('')
  }

  const handleCancel = () => {
    onCancel()
    setInputValue('')
  }

  if (!visible) {
    return null
  }

  return (
    <StyledView style={styles.overlay}>
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <StyledView style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <StyledView style={styles.alertContainer}>
        <StyledView style={styles.alertContent}>
          <StyledText style={styles.title}>{title}</StyledText>
          <StyledText style={styles.message}>{message}</StyledText>

          <TextInput
            style={styles.textInput}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.text.tertiary}
            autoFocus={true}
            selectTextOnFocus={true}
            returnKeyType='done'
            onSubmitEditing={handleConfirm}
          />

          <StyledView style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <StyledText style={[styles.buttonText, styles.cancelButtonText]}>
                Cancel
              </StyledText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <StyledText style={styles.buttonText}>Create</StyledText>
            </TouchableOpacity>
          </StyledView>
        </StyledView>
      </StyledView>
    </StyledView>
  )
}

//IT SHOULD BE MOVED TO A STYLED COMPONENTS
const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: screenWidth,
    height: '100%',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center'
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.background.overlay
  },
  alertContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40
  },
  alertContent: {
    backgroundColor: theme.colors.background.card,
    borderRadius: 16,
    padding: 28,
    minWidth: 320,
    maxWidth: screenWidth - 60,
    shadowColor: theme.colors.text.primary,
    shadowOffset: {
      width: 0,
      height: 6
    },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 12
  },
  message: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24
  },
  textInput: {
    backgroundColor: theme.colors.background.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    color: theme.colors.text.primary,
    marginBottom: 24,
    minHeight: 52
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    minHeight: 48
  },
  confirmButton: {
    backgroundColor: theme.colors.primary
  },
  cancelButton: {
    backgroundColor: theme.colors.background.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text.primary
  },
  cancelButtonText: {
    color: theme.colors.text.secondary,
    fontWeight: '600'
  }
})
