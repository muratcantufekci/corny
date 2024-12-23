import * as Device from "expo-device";
import Constants from "expo-constants";
import { Dimensions, PixelRatio, Platform } from "react-native";

export const getDeviceInfo = async () => {
  const { height, width } = Dimensions.get("window");
  const dpi = PixelRatio.get();

  const deviceInfo = {
    isIos: Platform.OS === "ios",
    isAndroid: Platform.OS === "android",
    appVersion: Constants.expoConfig?.version || "Unknown",
    osVersion: Device.osVersion || "Unknown",
    deviceModelName: Device.deviceName || "Unknown",
    locale: "",
    carrierName: "",
    height: height.toString(),
    width: width.toString(),
    dpi: dpi.toFixed(2),
    cpuCores: Device.totalMemory
      ? (Device.totalMemory / 2).toFixed(0)
      : "Unknown",
    systemMemory: (Device.totalMemory / 1024 ** 3).toFixed(0) || "Unknown",
    freeSpace: "8",
  };

  return deviceInfo;
};
