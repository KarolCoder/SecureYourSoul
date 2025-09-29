import React, { memo } from 'react'
import { StyleSheet } from 'react-native'
import { StyledView, StyledText } from '../styled'
import { Card, Button } from '../UI'

interface OptionCardProps {
  icon: string
  title: string
  description: string
  buttonTitle: string
  onPress: () => void
  variant?: 'primary' | 'secondary'
}

export const OptionCard = memo<OptionCardProps>(
  ({ icon, title, description, buttonTitle, onPress, variant = 'primary' }) => {
    return (
      <Card
        padding={12}
        backgroundColor='rgba(15, 15, 15, 0.4)'
        borderColor='rgba(139, 92, 246, 0.3)'
      >
        <StyledView style={styles.container}>
          <StyledText fontSize='xl' textAlign='center'>
            {icon}
          </StyledText>
          <StyledView style={styles.textContainer}>
            <StyledText
              fontSize='md'
              fontWeight='bold'
              color='#fff'
              textAlign='center'
            >
              {title}
            </StyledText>
            <StyledText
              fontSize='xs'
              color='#ccc'
              textAlign='center'
              style={styles.description}
            >
              {description}
            </StyledText>
          </StyledView>
          <Button
            title={buttonTitle}
            onPress={onPress}
            variant={variant}
            size='small'
            fullWidth
          />
        </StyledView>
      </Card>
    )
  }
)

OptionCard.displayName = 'OptionCard'

//IT SHOULD BE MOVED TO A STYLED COMPONENTS
const styles = StyleSheet.create({
  container: {
    gap: 10
  },
  textContainer: {
    alignItems: 'center',
    gap: 4
  },
  description: {
    lineHeight: 16
  }
})
