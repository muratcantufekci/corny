import { StyleSheet } from 'react-native';

const InputStyles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    width: '100%',
    fontSize: 16,
    fontWeight: '400',
  },
  primary: {
    backgroundColor: 'white',
    borderColor: '#D1D1D6',
    color: 'black'
  },
  error: {
    borderColor: '#FF524F',
    borderWidth: 2,
  },
  success: {
    borderColor: '#4CA30D',
    borderWidth: 2,
  }
});

export default InputStyles;
