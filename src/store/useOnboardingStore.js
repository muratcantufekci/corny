import { create } from "zustand";

const useOnboardingStore = create((set) => ({
  phone: "",
  code: "+90",
  city: "",
  name: "",
  photos: "",
  movies: "",
  gender: "",
  birthday: "",
  email: "",
  identifierCode: "",
  setPhone: (phone) => set({ phone }),
  setCode: (code) => set({ code }),
  setCity: (city) => set({ city }),
  setName: (name) => set({ name }),
  setMovies: (movies) => set({ movies }),
  setGender: (gender) => set({ gender }),
  setBirthday: (birthday) => set({ birthday }),
  setEmail: (email) => set({ email }),
  setIdentifierCode: (identifierCode) => set({ identifierCode }),
}));

export default useOnboardingStore;
