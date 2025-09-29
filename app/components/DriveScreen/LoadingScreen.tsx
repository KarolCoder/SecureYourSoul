import React, { memo } from 'react'
import { StyleSheet } from 'react-native'
import { StyledView, StyledText } from '../styled'
import { Card } from '../UI'
import { BackgroundGradient } from '../BackgroundGradient'

export const LoadingScreen = memo(() => {
  return (
    <BackgroundGradient>
      <StyledView flex={1} style={styles.container}>
        <Card
          padding={40}
          backgroundColor='rgba(15, 15, 15, 0.6)'
          borderRadius={20}
          borderWidth={1}
          borderColor='rgba(139, 92, 246, 0.5)'
          style={styles.card}
        >
          <StyledText fontSize='xxxxl' marginBottom={20}>
            ⚡
          </StyledText>
          <StyledText
            fontSize='xxl'
            fontWeight='bold'
            color='#8b5cf6'
            marginBottom={10}
          >
            Creating Secure Vault...
          </StyledText>
          <StyledText fontSize='md' color='#cbd5e1' textAlign='center'>
            Setting up your secure photo sharing space
          </StyledText>
        </Card>
      </StyledView>
    </BackgroundGradient>
  )
})

LoadingScreen.displayName = 'LoadingScreen'

//IT SHOULD BE MOVED TO A STYLED COMPONENTS
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  card: {
    alignItems: 'center'
  }
})
