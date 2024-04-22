import { StyleSheet } from 'react-native';

const InputStyles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    width: '100%',
    fontSize: 18,
    fontWeight: '500'
  },
  primary: {
    backgroundColor: 'white',
    borderColor: 'black',
    color: 'black'
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

export default InputStyles;
