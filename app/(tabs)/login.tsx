import { Button, StyleSheet, Text, TextInput, View } from "react-native"

export const login = () => {
  return (
    <View style={styles.cont}>
        <Text style={styles.text}>Zaloguj się</Text>
        <TextInput style={styles.email}/>
        <TextInput style={styles.pass}/>
        <Button style={styles.button} title="Zaloguj się"/>
    </View>
  )
}

const styles = StyleSheet.create({
    cont: {
        flex: 1,
        justifyContent: 'center',
        color: '#f1f1f1'
    },
    text: {
        fontSize: 24,
        fontWeight: 500,
        color: 'black',
    }
})
