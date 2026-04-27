import { StyleSheet, TextInput } from 'react-native'
import React from 'react'
import { useThemeColor } from '@/hooks/use-theme-color'

export type ThemedInputProps = {
lightColor?: string,
darkColor?: string,
type?: 'text' | 'password' | 'confirmPassword' | 'email'
placeholder?: string
}

const ThemedInput = ({
    lightColor,
    darkColor,
    type = 'text',
    placeholder
}: ThemedInputProps) => {
    const color = '#000'
    const borderColor = useThemeColor({}, 'tint')

  return (
    <TextInput
      style={[{color, borderColor}, styles.input]}
      placeholder={placeholder}
      keyboardType={type === 'email' ? 'email-address' : 'default'}
      secureTextEntry={type === 'password' || type === 'confirmPassword'}
    />
  )
}
const styles = StyleSheet.create({
    input: {
      padding: 16,
      borderWidth: 2,
      borderRadius: 11,
      width: '100%',
      height: 56,
      marginBottom: 20,
      fontSize: 16,
      fontWeight: '500',
    }
})
export default ThemedInput
