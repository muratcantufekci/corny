import { create } from "zustand";

const useOnboardingStore = create((set) => ({
  phone: "",
  code: "+90",
  identifierCode: "",
  phoneLang: "",
  setPhone: (phone) => set({ phone }),
  setCode: (code) => set({ code }),
  setIdentifierCode: (identifierCode) => set({ identifierCode }),
  setPhoneLang: (phoneLang) => set({ phoneLang }),
}));

export default useOnboardingStore;
