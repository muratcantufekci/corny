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
  disable: {
    backgroundColor: '#D1D1D6',
    borderColor: '#D1D1D6',
    color: '#93939F',
  }
});

export default ButtonStyles;
