import PropTypes from "prop-types";
import { StyleSheet, TextInput, View } from "react-native";

const Input = ({
  variant = "primary",
  placeholder,
  value,
  onChangeText,
  style,
  inputMode = "text",
  beforeIcon,
  afterIcon,
  ...props
}) => {
  const variantStyles = {
    primary: styles.primary,
    secondary: styles.secondary,
    error: styles.error,
    success: styles.success,
  };

  const textStyle = [styles.container, variantStyles[variant], style];

  return (
    <View style={textStyle}>
      {beforeIcon && beforeIcon}
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        inputMode={inputMode}
        type
        {...props}
      />
      {afterIcon && afterIcon}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
  },
  input: {
    paddingVertical: 16,
    flex: 1,
    fontSize: 16,
    fontWeight: "400",
  },
  primary: {
    backgroundColor: "white",
    borderColor: "#D1D1D6",
    color: "black",
  },
  error: {
    borderColor: "#FF524F",
    borderWidth: 2,
  },
  success: {
    borderColor: "#4CA30D",
    borderWidth: 2,
  },
});

Input.propTypes = {
  variant: PropTypes.oneOf(["primary", "secondary", "error", "success"]),
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChangeText: PropTypes.func,
  style: PropTypes.object,
};

export default Input;
