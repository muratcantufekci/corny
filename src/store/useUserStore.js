import { create } from "zustand";

const useUserStore = create((set) => ({
  token: "",
  isUserLoggedIn: false,
  isUserPremium: false,
  userAccountDetails: null,
  userAbouts: [],
  userTvShows: [],
  cardAbouts: [],
  cardInterests: [],
  waitListStatus: false,
  waitListCounter: 1,
  waitListTarget: 500,
  setToken: (token) => set({ token }),
  setIsUserLoggedIn: (isUserLoggedIn) => set({ isUserLoggedIn }),
  setIsUserPremium: (isUserPremium) => set({ isUserPremium }),
  setUserAccountDetails: (newDetails) =>
    set((state) => ({
      userAccountDetails: {
        ...state.userAccountDetails,
        ...newDetails,
      },
    })),
  setUserAbouts: (newData) =>
    set((state) => {
      const updatedUserAbouts = state.userAbouts.map((item) => {
        // Her bir item için gelen yeni data ile eşleşen varsa güncelle
        const newItem = newData.find((newItem) => newItem.title === item.title);
        return newItem ? { ...item, values: newItem.values } : item;
      });

      // Eğer state'de olmayan yeni title'lar varsa onları da ekleyelim
      newData.forEach((newItem) => {
        if (!updatedUserAbouts.find((item) => item.title === newItem.title)) {
          updatedUserAbouts.push(newItem);
        }
      });

      return { userAbouts: updatedUserAbouts };
    }),
    setUserTvShows: (userTvShows) => set({ userTvShows }),
    setcardAbouts: (cardAbouts) => set({ cardAbouts }),
    setcardInterests: (cardInterests) => set({ cardInterests }),
    setWaitListStatus: (waitListStatus) => set({ waitListStatus }),
    setWaitlistCounter: (waitListCounter) => set({waitListCounter}),
    setWaitlistTarget: (waitListTarget) => set({waitListTarget}),
}));

export default useUserStore;
