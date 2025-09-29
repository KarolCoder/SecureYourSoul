import React, { memo } from 'react'
import { StyleSheet } from 'react-native'
import { StyledView, StyledText } from '../styled'
import { Card } from '../UI'

interface InfoCardProps {
  icon: string
  title: string
  text: string
}

export const InfoCard = memo<InfoCardProps>(({ icon, title, text }) => {
  return (
    <Card
      padding={10}
      backgroundColor='rgba(15, 15, 15, 0.4)'
      borderColor='rgba(139, 92, 246, 0.3)'
    >
      <StyledView style={styles.container}>
        <StyledText fontSize='md' style={styles.icon}>
          {icon}
        </StyledText>
        <StyledView style={styles.content}>
          <StyledText
            fontSize='xs'
            fontWeight='bold'
            color='#b0d943'
            marginBottom={4}
          >
            {title}
          </StyledText>
          <StyledText fontSize='xs' color='#ccc' style={styles.description}>
            {text}
          </StyledText>
        </StyledView>
      </StyledView>
    </Card>
  )
})

InfoCard.displayName = 'InfoCard'

//IT SHOULD BE MOVED TO A STYLED COMPONENTS
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8
  },
  icon: {
    marginTop: 1
  },
  content: {
    flex: 1
  },
  description: {
    lineHeight: 14
  }
})
