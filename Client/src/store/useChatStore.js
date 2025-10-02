import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthStore } from "./useAuthStore";

export const ChatStore = create((set, get) => ({
  users: [],
  messages: [],

  isUsersLoading: false,
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axios.get("api/messages/getUsers");
      set({ users: res.data.users });
    } catch (error) {
      toast.error(error.response.data?.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  isMessagesLoading: false,
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axios.get(`api/messages/${userId}`);
      set({ messages: res.data.messages });
    } catch (error) {
      toast.error(error.response.data?.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  isMessagesSending: false,
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    set({ isMessagesSending: true });
    try {
      const res = await axios.post(
        `api/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data.newMessage] });
    } catch (error) {
      toast.error(error.response.data?.message);
    } finally {
      set({ isMessagesSending: false });
    }
  },

  selectedUser: null,
  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = AuthStore.getState().socket;

    if (selectedUser)
      socket.on("newMessage", (newMessage) => {
        if (newMessage.senderId !== selectedUser._id) return;
        set({ messages: [...get().messages, newMessage] });
      });
  },

  unsubscribeFromMessages: () => {
    const socket = AuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
