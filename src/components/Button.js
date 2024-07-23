import PropTypes from 'prop-types';
import { TouchableOpacity, Text } from 'react-native';
import styles from '../helper/ButtonStyles';
import CustomText from './CustomText';

const Button = ({ type = 'button', variant = 'primary', children, style, ...props }) => {
  const variantStyles = {
    primary: styles.primary,
    secondary: styles.secondary,
    green: styles.green,
    white: styles.white,
    black: styles.black,
    dark: styles.dark,
  };

  const containerStyle = [styles.button, variantStyles[variant], style];
  const textStyle = [styles.text, variantStyles[variant]];

  return (
    <TouchableOpacity type={type} style={containerStyle} {...props}>
      <CustomText style={textStyle}>{children}</CustomText>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(['submit', 'button', 'reset']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'green', 'white', 'black', 'dark']),
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

export default Button;
