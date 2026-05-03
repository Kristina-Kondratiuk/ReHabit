import { useColorScheme } from 'react-native'
import React from 'react'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'

const AuthLayout = () => {
    const colorScheme = useColorScheme()
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name='login' options={{headerShown: false}} />
        <Stack.Screen name='register' options={{headerShown: false}} />
      </Stack>
    </ThemeProvider>
  )
}

export default AuthLayout