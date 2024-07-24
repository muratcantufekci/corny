import React from 'react';
import { Text } from 'react-native';

const CustomText = ({ children, style , ...props}) => {
  const combinedStyle = Array.isArray(style)
    ? style.reduce((acc, curr) => ({ ...acc, ...curr }), {})
    : style;

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

  const { fontWeight, ...otherStyles } = combinedStyle || {};
  const fontFamily = getFontFamily(fontWeight);

  return (
    <Text style={[{ fontFamily }, otherStyles]} {...props}>
      {children}
    </Text>
  );
};

export default CustomText;
