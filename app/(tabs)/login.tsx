import React from "react"
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"

export default function Login() {
  return (
    <View style={styles.cont}>
        <Text style={styles.text}>Zaloguj się</Text>
        <TextInput style={styles.input} placeholder="Email"/>
        <TextInput style={styles.input} placeholder="Password"/>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Zaloguj się</Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    cont: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        color: '#f1f1f1'
    },
    text: {
        fontSize: 50,
        fontWeight: 500,
        color: '#000000',
        marginBottom: 20
    },
    input: {
      backgroundColor: 'gray',
      padding: 12,
      borderWidth: 1,
      borderRadius: 40,
      width: '100%',
      height: 60,
      marginBottom: 20
    },
    button: {
      backgroundColor: 'blue',
      paddingVertical: 12,
      borderRadius: 40,
      display: 'flex',
      width: '100%',
      height: 60,
      justifyContent: 'center',
    },
    buttonText: {
      color: '#ffffff',
      fontSize: 24,
      marginHorizontal: 'auto'
    }
})
