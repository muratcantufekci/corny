import { StyleSheet } from 'react-native';

const ButtonStyles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
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
    backgroundColor: 'black',
    borderColor: 'black',
    color: 'white',
  },
});

export default ButtonStyles;
