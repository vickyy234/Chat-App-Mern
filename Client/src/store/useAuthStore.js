import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { ChatStore } from "./useChatStore";
import { io } from "socket.io-client";

export const AuthStore = create((set, get) => ({
  authUser: null,
  onlineUsers: [],
  socket: null,

  isCheckingAuth: true,
  checkAuth: async () => {
    try {
      const res = await axios.get("api/auth/check");
      set({ authUser: res.data.user });
      get().connectSocket();
    } catch (error) {
      set({ authUser: null });
      console.error("Error checking auth:", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  isSigningUp: false,
  signUp: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axios.post("api/auth/register", data);
      set({ authUser: res.data.newUser });
      toast.success(res.data.message);
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data?.message || "Sign up failed");
      console.error("Error during sign up:", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  isLoggingIn: false,
  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axios.post("api/auth/login", data);
      set({ authUser: res.data.user });
      toast.success(res.data.message);
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data?.message || "Login failed");
      console.error("Error during login:", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await axios.post("api/auth/logout");
      set({ authUser: null });
      ChatStore.setState({ selectedUser: null });
      toast.success(res.data.message);
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response.data?.message || "Logout failed");
      console.error("Error during logout:", error);
    }
  },

  isUpdatingProfile: false,
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axios.put("api/auth/updateProfile", data);
      set({ authUser: res.data.updatedUser });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response.data?.message || "Profile update failed");
      console.error("Error updating profile:", error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(import.meta.env.VITE_SERVER_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();
    set({ socket });
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket.connected) get().socket.disconnect();
  },
}));
