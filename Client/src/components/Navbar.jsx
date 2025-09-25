import { Link } from "react-router-dom";
import { LogOut, Send, Settings, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header className="bg-base-100 fixed w-full top-0 z-40 shadow-md">
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8" title="Home">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <Send className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Wave</h1>
            </Link>
          </div>

          {authUser && (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="btn btn-sm gap-2" title="Profile">
                <User className="size-5" />
                <span className="hidden sm:inline">Profile</span>
              </Link>

              <button
                className="flex gap-2 items-center hover:cursor-pointer hover:scale-105"
                onClick={ logout }
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
