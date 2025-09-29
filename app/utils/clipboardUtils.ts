import { Alert } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'

export const copyToClipboard = (
  content: string,
  message = 'Content copied to clipboard'
): void => {
  Clipboard.setString(content)
  Alert.alert('Copied!', message)
}

export const copyItemToClipboard = (item: unknown): void => {
  const content = typeof item === 'string' ? item : JSON.stringify(item)
  copyToClipboard(content)
}
