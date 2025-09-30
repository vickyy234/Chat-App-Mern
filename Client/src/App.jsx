import { useEffect, useState, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { AuthStore } from "./store/useAuthStore";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = AuthStore();
  const [showServerWakeMessage, setShowServerWakeMessage] = useState(false);

  useEffect(() => {
    const checkUserAuth = async () => {
      const hasShown = sessionStorage.getItem("serverMessageShown");
      if (!hasShown) {
        setShowServerWakeMessage(true);
      }
      await checkAuth();
      setShowServerWakeMessage(false);
      sessionStorage.setItem("serverMessageShown", "true");
    };
    checkUserAuth();
  }, []);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
        {showServerWakeMessage && (
          <div className="px-4 py-3 mx-4 mt-4 text-sm font-semibold text-yellow-900 bg-yellow-100 border border-yellow-300 rounded-lg shadow-md sm:text-md md:text-lg">
            ⚠️ The server may take up to a minute to wake up if it’s been idle.
            Please wait while it loads.
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default App;
