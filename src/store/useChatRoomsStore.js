import { create } from "zustand";

const useChatRoomsStore = create((set) => ({
  chatRooms: [],
  connection: null,
  myChatUser: null,
  setChatRooms: (chatRoomsOrUpdater) => set((state) => {
    if (typeof chatRoomsOrUpdater === 'function') {
      return { chatRooms: chatRoomsOrUpdater(state.chatRooms) };
    }
    return { chatRooms: chatRoomsOrUpdater };
  }),
  setConnection: (connection) => set({ connection }),
  setMyChatUser: (myChatUser) => set({ myChatUser }),
}));

export default useChatRoomsStore;
