import PropTypes from "prop-types";
import { TouchableOpacity, Text } from "react-native";
import styles from "../helper/ButtonStyles";
import CustomText from "./CustomText";

const Button = ({
  type = "button",
  variant = "primary",
  disabled = false,
  children,
  style,
  ...props
}) => {
  const variantStyles = {
    primary: styles.primary,
    disable: styles.disable
  };

  const containerStyle = [styles.button, variantStyles[variant], style];
  const textStyle = [styles.text, variantStyles[variant]];

  return (
    <TouchableOpacity
      type={type}
      style={containerStyle}
      disabled={disabled}
      {...props}
    >
      <CustomText style={textStyle}>{children}</CustomText>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(["submit", "button", "reset"]),
  variant: PropTypes.oneOf(["primary", "disable"]),
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

export default Button;
