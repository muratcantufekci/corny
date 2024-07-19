import PropTypes from "prop-types";
import { TextInput } from "react-native";
import styles from "../helper/InputStyles";

const Input = ({
  variant = "primary",
  placeholder,
  value,
  onChangeText,
  style,
  inputMode= "text",
  ...props
}) => {
  const variantStyles = {
    primary: styles.primary,
    secondary: styles.secondary,
    error: styles.error,
    success: styles.success
  };

  const textStyle = [styles.container, variantStyles[variant]];

  return (
    <TextInput
      style={textStyle}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      inputMode={inputMode}
      type
      {...props}
    />
  );
};

Input.propTypes = {
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "error",
    "success"
  ]),
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  style: PropTypes.object,
};

export default Input;
