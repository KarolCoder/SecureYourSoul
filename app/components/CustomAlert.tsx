import React from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native'
import { StyledView, StyledText } from './styled'
import { theme } from '../theme'

// I'VE ADDED IT, BECAUSE THERE WAS ISSUES WITH ALERTS ON ANDROID, SO I DID IT AS A TEMPORARY SOLUTION

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

interface CustomAlertProps {
  visible: boolean
  title: string
  message: string
  buttons?: {
    text: string
    onPress: () => void
    style?: 'default' | 'cancel' | 'destructive'
  }[]
  onBackdropPress?: () => void
}

export const CustomAlert: React.FC<CustomAlertProps> = ({
  visible,
  title,
  message,
  buttons = [{ text: 'OK', onPress: () => {} }],
  onBackdropPress
}) => {
  if (!visible) {
    return null
  }

  const handleBackdropPress = () => {
    if (onBackdropPress) {
      onBackdropPress()
    }
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

          <StyledView style={styles.buttonContainer}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  button.style === 'cancel' && styles.cancelButton,
                  button.style === 'destructive' && styles.destructiveButton,
                  buttons.length === 1 && styles.singleButton
                ]}
                onPress={button.onPress}
              >
                <StyledText
                  style={[
                    styles.buttonText,
                    button.style === 'cancel' && styles.cancelButtonText,
                    button.style === 'destructive' &&
                      styles.destructiveButtonText
                  ]}
                >
                  {button.text}
                </StyledText>
              </TouchableOpacity>
            ))}
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
    height: screenHeight,
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
    borderRadius: 12,
    padding: 24,
    minWidth: 280,
    maxWidth: screenWidth - 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 12
  },
  message: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    alignItems: 'center'
  },
  singleButton: {
    flex: 0,
    minWidth: 100
  },
  cancelButton: {
    backgroundColor: theme.colors.background.tertiary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary
  },
  destructiveButton: {
    backgroundColor: theme.colors.error || '#FF3B30'
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary
  },
  cancelButtonText: {
    color: theme.colors.text.secondary
  },
  destructiveButtonText: {
    color: '#FFFFFF'
  }
})
