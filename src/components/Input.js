import PropTypes from "prop-types";
import { TextInput, View } from "react-native";
import styles from "../helper/InputStyles";

const Input = ({
  variant = "primary",
  placeholder,
  value,
  inputMode = "text",
  onChangeText,
  style,
  ...props
}) => {
  const variantStyles = {
    primary: styles.primary,
    secondary: styles.secondary,
    green: styles.green,
    white: styles.white,
    black: styles.black,
    dark: styles.dark,
  };

  const textStyle = [styles.container, variantStyles[variant]];

  return (
    <TextInput
      style={textStyle}
      inputMode={inputMode}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      {...props}
    />
  );
};

Input.propTypes = {
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "green",
    "white",
    "black",
    "dark",
  ]),
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  style: PropTypes.object,
};

export default Input;
