import { StyleSheet, Text } from "react-native"

const FormErrorMessage = ({message}) => {
  return (
    <Text style={styles.text}>{message}</Text>
  )
}

const styles = StyleSheet.create({
    text: {
        color: 'red',
        fontSize: 14
    }
})

export default FormErrorMessage