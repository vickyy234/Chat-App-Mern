import { useEffect, useState, useRef } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
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
      <div className="flex items-center justify-center h-screen flex-col">
        <Loader className="size-10 animate-spin" />
        {showServerWakeMessage && (
          <div className="bg-yellow-100 border mx-4 font-semibold border-yellow-300 text-yellow-900 px-4 py-3 rounded-lg shadow-md mt-4 text-sm sm:text-md md:text-lg">
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
