import { create } from "zustand";

const useUserStore = create((set) => ({
  token: "",
  isUserLoggedIn: false,
  setToken: (token) => set({ token }),
  setIsUserLoggedIn: (isUserLoggedIn) => set({ isUserLoggedIn }),
}));

export default useUserStore;
