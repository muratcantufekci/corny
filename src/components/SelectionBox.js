import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import User from "../assets/svg/user.svg";
import Plus from "../assets/svg/plus.svg";
import Check from "../assets/svg/check.svg";
import Close from "../assets/svg/close-circle-wrong.svg";

const SelectionBox = ({
  isMovie,
  img,
  selected,
  selectFunc,
  deleteFunc,
  onLongPress,
  isShaking,
}) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if(!isShaking){
      stopShakeAnimation()
    }
  },[isShaking])

  const startShakeAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotation, {
          toValue: 2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: -2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: 2,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopShakeAnimation = () => {
    rotation.stopAnimation();
    rotation.setValue(0);
  };

  const rotateInterpolate = rotation.interpolate({
    inputRange: [-2, 0, 2],
    outputRange: ["-2deg", "0deg", "2deg"],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        selected ? styles.noDashedBorder : "",
        { transform: [{ rotate: rotateInterpolate }] },
      ]}
    >
      <TouchableOpacity
        onPress={selectFunc}
        onLongPress={() => {
          startShakeAnimation();
          onLongPress();
        }}
        // onPressOut={stopShakeAnimation}
      >
        <View style={styles.imageContainer}>
          {img ? (
            <Image source={{ uri: img }} style={styles.image} />
          ) : isMovie ? null : (
            <User style={{color: "#D1D1D6"}}/>
          )}
        </View>
        {selected ? (
          <Check style={styles.checkIcon} />
        ) : (
          <View style={styles.plusIcon}>
            <Plus />
          </View>
        )}
        {selected && !isMovie && (
          <TouchableOpacity style={styles.closeIcon} onPress={deleteFunc}>
            <Close width={30} height={30} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const boxWidth = (Dimensions.get("window").width - 64) / 3;
const boxHeight = Dimensions.get("window").height / 5.5;

const styles = StyleSheet.create({
  container: {
    height: boxHeight,
    width: boxWidth,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: "#D1D1D6",
    borderStyle: "dashed",
    marginBottom: 14,
  },
  noDashedBorder: {
    borderStyle: "solid",
    borderColor: "#FF524F",
    borderWidth: 1.5,
  },
  plusIcon: {
    position: "absolute",
    bottom: -12,
    right: -5,
    backgroundColor: "white",
    borderRadius: 50,
  },
  checkIcon: {
    position: "absolute",
    bottom: -13,
    right: 0,
    color: "black",
  },
  closeIcon: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "white",
    borderRadius: 50,
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    overflow: "hidden",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default SelectionBox;
