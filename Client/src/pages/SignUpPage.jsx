import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2, Lock, Mail, Send, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { signUp, isSigningUp } = useAuthStore();
  const validateForm = () => {
    if (!formData.name.trim()) return toast.error("Full name is required");
    if (formData.name.length < 3) return toast.error("Full name must be at least 3 characters");
    if (formData.name.length > 30) return toast.error("Full name must be at most 30 characters");

    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");

    if (!formData.password.trim()) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (formData.password.length > 20)
      return toast.error("Password must be at most 20 characters");

    return true;
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signUp(formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 sm:p-12">
      <div className="w-full max-w-md p-4 space-y-8 rounded-lg shadow-lg bg-base-200 lg:p-8">
        <div className="mb-8 text-center">
          <div className="flex flex-col items-center gap-2 group">
            <div className="flex items-center justify-center transition-colors size-12 rounded-xl bg-primary/10 group-hover:bg-primary/20">
              <Send className="size-6 text-primary" />
            </div>
            <h1 className="mt-2 text-2xl font-bold">Create Account</h1>
            <p className="text-base-content/60">
              Get started with your free account
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="font-medium label-text">Full Name</span>
            </label>
            <div className="relative">
              <input
                type="text"
                className={`input input-bordered w-full pl-10`}
                placeholder="James Smith"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <User className="z-10 size-5 text-base-content/40" />
              </div>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="font-medium label-text">Email</span>
            </label>
            <div className="relative">
              <input
                type="text"
                className={`input input-bordered w-full pl-10`}
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Mail className="z-10 size-5 text-base-content/40" />
              </div>
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="font-medium label-text">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`input input-bordered w-full pl-10`}
                placeholder={showPassword ? "123456" : "••••••••"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="z-10 size-5 text-base-content/40" />
              </div>
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3"
                onClick={() => {
                  setShowPassword(!showPassword);
                }}
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? (
                  <EyeOff className="z-10 size-5 text-base-content/40" />
                ) : (
                  <Eye className="z-10 size-5 text-base-content/40" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn btn-primary"
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Loading...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="text-center">
          <p className="text-base-content/60">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
