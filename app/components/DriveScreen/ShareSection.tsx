import React, { memo } from 'react'
import { StyleSheet } from 'react-native'
import { StyledView, StyledText } from '../styled'
import { Card, Button } from '../UI'
import { copyToClipboard } from '../../utils/clipboardUtils'

interface ShareSectionProps {
  generatedKey: string
  isWorkletStarted: boolean
}

export const ShareSection = memo<ShareSectionProps>(
  ({ generatedKey, isWorkletStarted }) => {
    const handleCopyKey = () => {
      copyToClipboard(generatedKey, 'Access key copied to clipboard')
    }

    if (!isWorkletStarted || !generatedKey) {
      return null
    }

    return (
      <Card
        padding={24}
        marginBottom={20}
        backgroundColor='rgba(15, 15, 15, 0.4)'
        borderColor='#2a2a4a'
        borderWidth={2}
      >
        <StyledView style={styles.headerContainer}>
          <StyledText fontSize='xxxl' style={styles.icon}>
            🔑
          </StyledText>
          <StyledView style={styles.flex}>
            <StyledText
              fontSize='xl'
              fontWeight='bold'
              color='#b0d943'
              marginBottom={4}
            >
              Share Your Secure Vault
            </StyledText>
            <StyledText fontSize='sm' color='#ccc' style={styles.subtitle}>
              Invite family members by sharing this access key
            </StyledText>
          </StyledView>
        </StyledView>

        <StyledView style={styles.buttonRow}>
          <Button
            title='📋 Copy Access Key'
            onPress={handleCopyKey}
            variant='primary'
            size='large'
            style={styles.flex}
          />
          <Button
            title='💬 Share via Message'
            onPress={handleCopyKey}
            variant='secondary'
            size='large'
            style={styles.flex}
          />
        </StyledView>

        <StyledView
          backgroundColor='rgba(15, 15, 15, 0.3)'
          padding={16}
          borderRadius={8}
          borderWidth={1}
          borderColor='#444'
        >
          <StyledText
            fontSize='xs'
            color='#b0d943'
            fontWeight='semibold'
            marginBottom={8}
          >
            Access Key:
          </StyledText>
          <StyledText
            fontSize='xs'
            color='#fff'
            style={styles.keyText}
            numberOfLines={2}
          >
            {generatedKey}
          </StyledText>
        </StyledView>
      </Card>
    )
  }
)

ShareSection.displayName = 'ShareSection'

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  icon: {
    marginRight: 16
  },
  subtitle: {
    lineHeight: 20
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20
  },
  keyText: {
    fontFamily: 'monospace',
    lineHeight: 16
  },
  flex: {
    flex: 1
  }
})
