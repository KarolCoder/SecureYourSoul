import styled from 'styled-components/native'
import { theme } from '../../theme'

//THOSE COMPONENTS SHOULD BE MOVED TO DIFFERENT FOLDERS, I DIDN'T HAVE TIME TO DO IT, ALSO NOT EVERY PROPS ARE NECESSARY

interface StyledViewProps {
  flex?: number
  backgroundColor?: string
  padding?: number
  margin?: number
  borderRadius?: number
}

export const StyledView = styled.View<StyledViewProps>`
  background-color: ${(props: StyledViewProps) =>
    props.backgroundColor || 'transparent'};
  padding: ${(props: StyledViewProps) => props.padding || 0}px;
  margin: ${(props: StyledViewProps) => props.margin || 0}px;
  border-radius: ${(props: StyledViewProps) => props.borderRadius || 0}px;
`

interface StyledTextProps {
  fontSize?: keyof typeof theme.typography.fontSizes
  fontWeight?: keyof typeof theme.typography.fontWeights
  color?: string
  textAlign?: 'left' | 'center' | 'right'
  marginBottom?: number
}

export const StyledText = styled.Text<StyledTextProps>`
  font-size: ${(props: StyledTextProps) =>
    theme.typography.fontSizes[props.fontSize || 'md']}px;
  font-weight: ${(props: StyledTextProps) =>
    theme.typography.fontWeights[props.fontWeight || 'normal']};
  color: ${(props: StyledTextProps) =>
    props.color || theme.colors.text.primary};
  text-align: ${(props: StyledTextProps) => props.textAlign || 'left'};
  margin-bottom: ${(props: StyledTextProps) => props.marginBottom || 0}px;
`

interface StyledTouchableOpacityProps {
  backgroundColor?: string
  padding?: number
  borderRadius?: number
  disabled?: boolean
}

export const StyledTouchableOpacity = styled.TouchableOpacity<StyledTouchableOpacityProps>`
  background-color: ${(props: StyledTouchableOpacityProps) =>
    props.backgroundColor || 'transparent'};
  padding: ${(props: StyledTouchableOpacityProps) => props.padding || 0}px;
  border-radius: ${(props: StyledTouchableOpacityProps) =>
    props.borderRadius || 0}px;
  opacity: ${(props: StyledTouchableOpacityProps) =>
    props.disabled ? 0.5 : 1};
`

interface StyledScrollViewProps {
  backgroundColor?: string
  flex?: number
}

export const StyledScrollView = styled.ScrollView<StyledScrollViewProps>`
  background-color: ${(props: StyledScrollViewProps) => props.backgroundColor};
  flex: ${(props: StyledScrollViewProps) => props.flex || 1};
`

interface CardProps {
  padding?: number
  margin?: number
  marginBottom?: number
  backgroundColor?: string
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
}

export const Card = styled.View<CardProps>`
  background-color: ${(props: CardProps) =>
    props.backgroundColor ||
    'rgba(15, 15, 15, 0.3)'}; /* Semi-transparent dark */
  border-radius: ${(props: CardProps) =>
    props.borderRadius || theme.borderRadius.md}px;
  border-width: ${(props: CardProps) => props.borderWidth || 1}px;
  border-color: ${(props: CardProps) =>
    props.borderColor ||
    'rgba(139, 92, 246, 0.3)'}; /* Semi-transparent purple */
  padding: ${(props: CardProps) => props.padding || theme.spacing.lg}px;
  margin: ${(props: CardProps) => props.margin || theme.spacing.md}px;
  ${(props: CardProps) =>
    props.marginBottom && `margin-bottom: ${props.marginBottom}px;`}
  ${theme.shadows.md}
`

const BUTTON_VARIANT_STYLES = {
  primary: `background-color: ${theme.colors.primary};`,
  secondary: `background-color: ${theme.colors.secondary};`,
  danger: `background-color: ${theme.colors.danger};`,
  ghost: `background-color: transparent; border-width: 1px; border-color: ${theme.colors.primary};`,
  ghostNoBorder: 'background-color: transparent;'
} as const

const BUTTON_SIZE_STYLES = {
  small: `padding-vertical: ${theme.spacing.sm}px; padding-horizontal: ${theme.spacing.lg}px; min-height: 36px;`,
  medium: `padding-vertical: ${theme.spacing.md}px; padding-horizontal: ${theme.spacing.xxl}px; min-height: 48px;`,
  large: `padding-vertical: ${theme.spacing.lg}px; padding-horizontal: ${theme.spacing.xxxl}px; min-height: 56px;`
} as const

// Button components
interface ButtonContainerProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'ghostNoBorder'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
  disabled?: boolean
}

export const ButtonContainer = styled.TouchableOpacity<ButtonContainerProps>`
  align-items: center;
  justify-content: center;
  ${(props: ButtonContainerProps) => props.fullWidth && 'width: 100%;'}
  ${(props: ButtonContainerProps) =>
    BUTTON_VARIANT_STYLES[props.variant || 'primary']}
  ${(props: ButtonContainerProps) => BUTTON_SIZE_STYLES[props.size || 'medium']}
  ${(props: ButtonContainerProps) => props.disabled && 'opacity: 0.5;'}
  ${theme.shadows.md}
`

const BUTTON_TEXT_VARIANT_STYLES = {
  primary: `color: ${theme.colors.text.inverse};`,
  secondary: `color: ${theme.colors.text.primary};`,
  danger: `color: ${theme.colors.text.primary};`,
  ghost: `color: ${theme.colors.primary};`,
  ghostNoBorder: `color: ${theme.colors.primary};`
} as const

const BUTTON_TEXT_SIZE_STYLES = {
  small: `font-size: ${theme.typography.fontSizes.sm}px;`,
  medium: `font-size: ${theme.typography.fontSizes.md}px;`,
  large: `font-size: ${theme.typography.fontSizes.lg}px;`
} as const

interface ButtonTextProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'ghostNoBorder'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
}

export const ButtonText = styled.Text<ButtonTextProps>`
  font-weight: ${theme.typography.fontWeights.semibold};
  text-align: center;
  ${(props: ButtonTextProps) =>
    BUTTON_TEXT_VARIANT_STYLES[props.variant || 'primary']}
  ${(props: ButtonTextProps) => BUTTON_TEXT_SIZE_STYLES[props.size || 'medium']}
  ${(props: ButtonTextProps) => props.disabled && 'opacity: 0.7;'}
`

// Input components
export const InputContainer = styled.View`
  margin-bottom: ${theme.spacing.lg}px;
`

export const InputLabel = styled.Text`
  font-size: ${theme.typography.fontSizes.md}px;
  font-weight: ${theme.typography.fontWeights.medium};
  color: ${theme.colors.primary};
  margin-bottom: ${theme.spacing.sm}px;
`

interface InputFieldProps {
  multiline?: boolean
  error?: boolean
}

export const InputField = styled.TextInput<InputFieldProps>`
  background-color: ${theme.colors.background.tertiary};
  border-width: 1px;
  border-color: ${(props: InputFieldProps) =>
    props.error ? theme.colors.border.error : theme.colors.border.secondary};
  border-radius: ${theme.borderRadius.md}px;
  padding-horizontal: ${theme.spacing.lg}px;
  padding-vertical: ${theme.spacing.md}px;
  font-size: ${theme.typography.fontSizes.md}px;
  color: ${theme.colors.text.primary};
  min-height: ${(props: InputFieldProps) => (props.multiline ? 100 : 48)}px;
  text-align-vertical: ${(props: InputFieldProps) =>
    props.multiline ? 'top' : 'center'};
`

export const InputError = styled.Text`
  color: ${theme.colors.border.error};
  font-size: ${theme.typography.fontSizes.sm}px;
  margin-top: ${theme.spacing.xs}px;
`

// Header components
export const HeaderContainer = styled.View`
  align-items: center;
  margin-bottom: ${theme.spacing.xxxl}px;
`

export const HeaderTitle = styled.Text`
  font-size: ${theme.typography.fontSizes.xxxl}px;
  font-weight: ${theme.typography.fontWeights.bold};
  color: ${theme.colors.primary};
  text-align: center;
  margin-bottom: ${theme.spacing.sm}px;
`

export const HeaderSubtitle = styled.Text`
  font-size: ${theme.typography.fontSizes.md}px;
  color: ${theme.colors.text.secondary};
  text-align: center;
  line-height: ${theme.typography.lineHeights.relaxed *
  theme.typography.fontSizes.md}px;
`

interface LoadingContainerProps {
  size?: number
}

export const LoadingContainer = styled.View<LoadingContainerProps>`
  align-items: center;
  justify-content: center;
  width: ${(props: LoadingContainerProps) => props.size || 20}px;
  height: ${(props: LoadingContainerProps) => props.size || 20}px;
`

export const LoadingText = styled.Text`
  font-size: ${theme.typography.fontSizes.xl}px;
  color: ${theme.colors.primary};
`
