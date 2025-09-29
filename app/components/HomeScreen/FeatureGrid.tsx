import React, { memo } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import { StyledView, StyledText } from '../styled'

const { width } = Dimensions.get('window')

interface FeatureItemProps {
  icon: string
  text: string
}

const FeatureItem = memo<FeatureItemProps>(({ icon, text }) => (
  <StyledView width={(width - 40) / 2} style={styles.featureItem}>
    <StyledText fontSize='lg' marginBottom={4}>
      {icon}
    </StyledText>
    <StyledText
      fontSize='xs'
      color='#ccc'
      textAlign='center'
      fontWeight='medium'
    >
      {text}
    </StyledText>
  </StyledView>
))

FeatureItem.displayName = 'FeatureItem'

interface FeatureGridProps {
  features: { icon: string; text: string }[]
}

export const FeatureGrid = memo<FeatureGridProps>(({ features }) => {
  return (
    <StyledView style={styles.gridContainer}>
      {features.map((feature, index) => (
        <FeatureItem key={index} icon={feature.icon} text={feature.text} />
      ))}
    </StyledView>
  )
})

FeatureGrid.displayName = 'FeatureGrid'

//IT SHOULD BE MOVED TO A STYLED COMPONENTS
const styles = StyleSheet.create({
  featureItem: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8
  }
})
