import { Link } from "react-router-dom";
import { LogOut, Send, Settings, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="fixed top-0 z-40 w-full shadow-md bg-base-100">
      <div className="container h-16 px-4 mx-auto">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8" title="Home">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="flex items-center justify-center rounded-lg size-9 bg-primary/10">
                <Send className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Wave</h1>
            </Link>
          </div>

          {authUser && (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="gap-2 btn btn-sm" title="Profile">
                <User className="size-5" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button
                className="flex items-center gap-2 hover:cursor-pointer hover:scale-105"
                onClick={logout}
                title="Logout"
              >
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Navbar;
