import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { ChatStore } from "./useChatStore";

export const AuthStore = create((set, get) => ({
  authUser: null,
  onlineUsers: [],

  isCheckingAuth: true,
  checkAuth: async () => {
    try {
      const res = await axios.get("/auth/check");
      set({ authUser: res.data.user });
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
      const res = await axios.post("/auth/register", data);
      toast.success(res.data.message);
      set({ authUser: res.data.newUser });
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
      const res = await axios.post("/auth/login", data);
      set({ authUser: res.data.user });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data?.message || "Login failed");
      console.error("Error during login:", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      const res = await axios.post("/auth/logout");
      set({ authUser: null });
      ChatStore.setState({ selectedUser: null });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response.data?.message || "Logout failed");
      console.error("Error during logout:", error);
    }
  },

  isUpdatingProfile: false,
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axios.put("/auth/updateProfile", data);
      set({ authUser: res.data.updatedUser });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response.data?.message || "Profile update failed");
      console.error("Error updating profile:", error);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
}));
