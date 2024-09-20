import { create } from "zustand";

const useAppUtils = create((set) => ({
  backgroundColor: "#FFFFFF",
  paddingHorizontal: 16,
  bottomTabStyle: "flex",
  languge: null,
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setPaddingHorizontal: (paddingHorizontal) => set({ paddingHorizontal }),
  setBottomTabStyle: (bottomTabStyle) => set({ bottomTabStyle }),
  setLanguage: (languge) => set({ languge }),
}));

export default useAppUtils;
