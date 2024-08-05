import { create } from "zustand";

const useUserStore = create((set) => ({
  token: "",
  setToken: (token) => set({ token }),
}));

export default useUserStore;
