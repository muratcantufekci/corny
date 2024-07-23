import { Image, StyleSheet, View, Modal as RNModal } from "react-native";
import Button from "./Button";
import CustomText from "./CustomText";

const Modal = ({ img, title, desc, btnText, btnVariant, visible, onClose, btnClickFunc }) => {
  return (
    <RNModal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image source={img} style={styles.img} />
          <CustomText style={styles.title}>{title}</CustomText>
          <CustomText style={styles.desc}>{desc}</CustomText>
          <Button variant={btnVariant} onPress={btnClickFunc}>{btnText}</Button>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 24
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    width: "100%"
  },
  img: {
    width: 170,
    height: 215,
    resizeMode: "contain",
    zIndex: 9
  },
  title: {
    fontWeight: '500',
    fontSize: 28,
    lineHeight: 32,
    textAlign: 'center',
    color: "#000000",
    marginBottom: 8,
  },
  desc: {
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: "#51525C",
    marginBottom: 32,
  },
});

export default Modal;
