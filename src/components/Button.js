import PropTypes from "prop-types";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import CustomText from "./CustomText";

const Button = ({
  type = "button",
  variant = "primary",
  disabled = false,
  loader,
  children,
  style,
  ...props
}) => {
  const variantStyles = {
    primary: styles.primary,
    disable: styles.disable,
    white: styles.white,
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
      {loader ?? loader}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    width: '100%',
    gap: 12
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
  },
  white: {
    backgroundColor: 'white',
    borderColor: 'white',
    color: 'black',
  }
});

Button.propTypes = {
  type: PropTypes.oneOf(["submit", "button", "reset"]),
  variant: PropTypes.oneOf(["primary", "disable", "white"]),
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

export default Button;
