import { create } from "zustand";

const useUserStore = create((set) => ({
  token: "",
  isUserLoggedIn: false,
  userAccountDetails: null,
  setToken: (token) => set({ token }),
  setIsUserLoggedIn: (isUserLoggedIn) => set({ isUserLoggedIn }),
  setUserAccountDetails: (newDetails) =>
    set((state) => ({
      userAccountDetails: {
        ...state.userAccountDetails,
        ...newDetails, // Gelen obje ile mevcut state'in birleşimi yapılır
      },
    })),
}));

export default useUserStore;
