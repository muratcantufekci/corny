import { create } from "zustand";

const useAppUtils = create((set) => ({
  backgroundColor: "#FFFFFF",
  paddingHorizontal: 16,
  bottomTabStyle: "flex",
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setPaddingHorizontal: (paddingHorizontal) => set({ paddingHorizontal }),
  setBottomTabStyle: (bottomTabStyle) => set({ bottomTabStyle }),
}));

export default useAppUtils;
