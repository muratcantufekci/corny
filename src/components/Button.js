import PropTypes from "prop-types";
import { TouchableOpacity, StyleSheet } from "react-native";
import CustomText from "./CustomText";

const Button = ({
  type = "button",
  variant = "primary",
  disabled = false,
  loader,
  children,
  style,
  prevIcon,
  ...props
}) => {
  const variantStyles = styles.variants[variant] || styles.variants.primary;

  return (
    <TouchableOpacity
      type={type}
      style={[styles.button, variantStyles.container, style]}
      disabled={disabled}
      {...props}
    >
      {prevIcon && prevIcon}
      <CustomText style={[styles.text, variantStyles.text]}>
        {children}
      </CustomText>
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
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    width: "100%",
    gap: 12,
  },
  text: {
    fontSize: 18,
    fontWeight: "500",
  },
  variants: {
    primary: {
      container: {
        backgroundColor: "black",
        borderColor: "black",
      },
      text: {
        color: "white",
      },
    },
    disable: {
      container: {
        backgroundColor: "#D1D1D6",
        borderColor: "#D1D1D6",
      },
      text: {
        color: "#93939F",
      },
    },
    white: {
      container: {
        backgroundColor: "white",
        borderColor: "white",
      },
      text: {
        color: "black",
      },
    },
    ghost: {
      container: {
        backgroundColor: "#EFEFF1",
        borderColor: "#EFEFF1",
      },
      text: {
        color: "#000000",
      },
    },
    danger: {
      container: {
        backgroundColor: "#E41F2E",
        borderColor: "#E41F2E",
      },
      text: {
        color: "#FFFFFF",
      },
    },
  },
});

Button.propTypes = {
  type: PropTypes.oneOf(["submit", "button", "reset"]),
  variant: PropTypes.oneOf(["primary", "disable", "white", "ghost", "danger"]),
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
};

export default Button;
