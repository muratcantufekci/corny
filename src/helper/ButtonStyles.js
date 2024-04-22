import { StyleSheet } from 'react-native';

const ButtonStyles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    width: '100%',
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500'
  },
  primary: {
    backgroundColor: 'blue',
    borderColor: 'blue',
  },
  secondary: {
    backgroundColor: 'green',
    borderColor: 'green',
  },
  green: {
    backgroundColor: 'green',
    borderColor: 'green',
  },
  white: {
    backgroundColor: 'white',
    borderColor: 'black',
    color: 'black'
  },
  black: {
    backgroundColor: 'black',
    borderColor: 'black',
    color: 'white',
  },
  dark: {
    backgroundColor: 'gray',
    borderColor: 'gray',
  },
});

export default ButtonStyles;
