import { create } from "zustand";

const useUserStore = create((set, get) => ({
  token: "",
  isUserLoggedIn: false,
  isUserPremium: false,
  jokerCount: 0,
  superlikeCount: 0,
  userAccountDetails: null,
  userAbouts: [],
  userTvShows: [],
  cardAbouts: [],
  filters: {},
  cardInterests: [],
  waitListStatus: false,
  waitListCounter: 1,
  waitListTarget: 500,
  setToken: (token) => set({ token }),
  setIsUserLoggedIn: (isUserLoggedIn) => set({ isUserLoggedIn }),
  setIsUserPremium: (isUserPremium) => set({ isUserPremium }),
  setJokerCount: (jokerCount) => set({ jokerCount }),
  setSuperlikeCount: (superlikeCount) => set({ superlikeCount }),
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
  setFilters: (key, value) => {
    const currentFilters = get().filters || {};
    let updatedFilters;
  
    if (!key) {
      // Eğer key yoksa, gelen objeyi doğrudan yaz
      updatedFilters = {};
    } else if (key === "Age" || key === "Distance") {
      updatedFilters = {
        ...currentFilters,
        [key]: value,
      };
    } else {
      const currentValues = currentFilters[key] || [];
      let updatedValues;
  
      if (currentValues.includes(value)) {
        // Eğer değer zaten mevcutsa, onu çıkar (toggle mantığı)
        updatedValues = currentValues.filter((item) => item !== value);
      } else if (value.length === 0) {
        updatedValues = [];
      } else {
        // Değer mevcut değilse, ekle
        updatedValues = [...currentValues, value];
      }
  
      // Eğer değerler boşsa anahtarı kaldır, aksi halde güncelle
      updatedFilters =
        updatedValues.length > 0
          ? { ...currentFilters, [key]: updatedValues }
          : Object.fromEntries(
              Object.entries(currentFilters).filter(([k]) => k !== key)
            );
    }
    set({ filters: updatedFilters });
  },  
  resetFilters: () => set({ filters: {} }),
  setcardInterests: (cardInterests) => set({ cardInterests }),
  setWaitListStatus: (waitListStatus) => set({ waitListStatus }),
  setWaitlistCounter: (waitListCounter) => set({ waitListCounter }),
  setWaitlistTarget: (waitListTarget) => set({ waitListTarget }),
}));

export default useUserStore;
