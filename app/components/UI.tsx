import React, { memo } from 'react'
import {
  ViewStyle,
  TouchableOpacityProps,
  StyleSheet,
  TextStyle
} from 'react-native'
import {
  ButtonContainer,
  ButtonText,
  Card as StyledCard,
  InputContainer,
  InputLabel,
  InputField,
  InputError,
  HeaderContainer,
  HeaderTitle,
  HeaderSubtitle
} from './styled'

//THOSE COMPONENTS SHOULD BE MOVED TO DIFFERENT FOLDERS, I DIDN'T HAVE TIME TO DO IT
interface ButtonProps extends TouchableOpacityProps {
  title: string
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'ghostNoBorder'
  size?: 'small' | 'medium' | 'large'
  fullWidth?: boolean
  loading?: boolean
  textStyle?: TextStyle
}

export const Button = memo<ButtonProps>(
  ({
    title,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    loading = false,
    style,
    textStyle,
    disabled,
    ...props
  }) => {
    return (
      <ButtonContainer
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        disabled={disabled || loading}
        style={style}
        {...props}
      >
        <ButtonText
          variant={variant}
          size={size}
          disabled={disabled || loading}
          style={textStyle}
        >
          {loading ? 'Loading...' : title}
        </ButtonText>
      </ButtonContainer>
    )
  }
)

Button.displayName = 'Button'

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
  padding?: number
  margin?: number
  marginBottom?: number
  backgroundColor?: string
  borderRadius?: number
  borderWidth?: number
  borderColor?: string
}

export const Card = memo<CardProps>(
  ({
    children,
    style,
    padding = 20,
    margin = 10,
    marginBottom,
    backgroundColor,
    borderRadius,
    borderWidth,
    borderColor
  }) => {
    return (
      <StyledCard
        padding={padding}
        margin={margin}
        marginBottom={marginBottom}
        backgroundColor={backgroundColor}
        borderRadius={borderRadius}
        borderWidth={borderWidth}
        borderColor={borderColor}
        style={style}
      >
        {children}
      </StyledCard>
    )
  }
)

Card.displayName = 'Card'

// Input Component
interface InputProps {
  placeholder?: string
  value: string
  onChangeText: (text: string) => void
  multiline?: boolean
  numberOfLines?: number
  secureTextEntry?: boolean
  style?: ViewStyle
  label?: string
  error?: string
}

export const Input = memo<InputProps>(
  ({
    placeholder,
    value,
    onChangeText,
    multiline = false,
    numberOfLines = 1,
    secureTextEntry = false,
    style,
    label,
    error
  }) => {
    return (
      <InputContainer>
        {label && <InputLabel>{label}</InputLabel>}
        <InputField
          placeholder={placeholder}
          placeholderTextColor='#999'
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={numberOfLines}
          secureTextEntry={secureTextEntry}
          textAlignVertical={multiline ? 'top' : 'center'}
          error={!!error}
          style={style}
        />
        {error && <InputError>{error}</InputError>}
      </InputContainer>
    )
  }
)

Input.displayName = 'Input'

// Header Component
interface HeaderProps {
  title: string
  subtitle?: string
  style?: ViewStyle
  showBackButton?: boolean
  onBackPress?: () => void
}

export const Header = memo<HeaderProps>(
  ({ title, subtitle, style, showBackButton = false, onBackPress }) => {
    return (
      <HeaderContainer style={style}>
        {showBackButton && (
          <Button
            title='←'
            onPress={onBackPress}
            variant='ghostNoBorder'
            size='small'
            style={styles.backButton}
            textStyle={styles.backButtonText}
          />
        )}
        <HeaderTitle>{title}</HeaderTitle>
        {subtitle && <HeaderSubtitle>{subtitle}</HeaderSubtitle>}
      </HeaderContainer>
    )
  }
)

Header.displayName = 'Header'

//IT SHOULD BE MOVED TO A STYLED COMPONENTS
const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
    minWidth: 40,
    height: 40
  },
  backButtonText: {
    fontSize: 20
  }
})
