import { Stack } from 'expo-router'
import { ErrorBoundary } from './components/ErrorBoundary'

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <Stack
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name='index' />
        <Stack.Screen name='connect' />
        <Stack.Screen name='drive' />
        <Stack.Screen name='folder' />
        <Stack.Screen name='settings' />
      </Stack>
    </ErrorBoundary>
  )
}
