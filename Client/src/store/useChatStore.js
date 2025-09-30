import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

export const ChatStore = create((set, get) => ({
  users: [],
  messages: [],

  isUsersLoading: false,
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axios.get("/messages/getUsers");
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
      const res = await axios.get(`/messages/${userId}`);
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
        `/messages/send/${selectedUser._id}`,
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
}));
