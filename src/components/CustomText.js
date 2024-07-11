import { Text } from 'react-native';

const CustomText = ({ children, style }) => {
  const getFontFamily = (fontWeight) => {
    switch (fontWeight) {
      case '800':
        return 'RethinkSans-ExtraBold';
      case '700':
        return 'RethinkSans-Bold';
      case '600':
        return 'RethinkSans-SemiBold';
      case '500':
        return 'RethinkSans-Medium';
      default:
        return 'RethinkSans-Regular';
    }
  };

  const { fontWeight, ...otherStyles } = style || {};

  return (
    <Text style={{ fontFamily: getFontFamily(fontWeight), ...otherStyles }}>
      {children}
    </Text>
  );
};

export default CustomText;
