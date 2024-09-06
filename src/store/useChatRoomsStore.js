import { create } from "zustand";

const useChatRoomsStore = create((set) => ({
  chatRooms: [],
  connection: null,
  myChatUserName: null,
  setChatRooms: (chatRoomsOrUpdater) => set((state) => {
    if (typeof chatRoomsOrUpdater === 'function') {
      return { chatRooms: chatRoomsOrUpdater(state.chatRooms) };
    }
    return { chatRooms: chatRoomsOrUpdater };
  }),
  setConnection: (connection) => set({ connection }),
  setMyChatUserName: (myChatUserName) => set({ myChatUserName }),
}));

export default useChatRoomsStore;
