import { create } from "zustand";

const usePremiumPackagesStore = create((set) => ({
  premiumPackages: [],
  jokerPackages: [],
  superlikePackages: [],
  setPremiumPackages: (premiumPackages) => set({ premiumPackages }),
  setJokerPackages: (jokerPackages) => set({ jokerPackages }),
  setSuperlikePackages: (superlikePackages) => set({ superlikePackages }), 
}));

export default usePremiumPackagesStore;
