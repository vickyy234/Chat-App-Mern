import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

export const ChatStore = create((set) => ({
  users: [],
  messages: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axios.get("/messagges/getUsers");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data?.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axios.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data?.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user, messages: [] }); 
  },
}));
