import { useState } from "react";
import { Camera, Copy, Download, Loader, Mail, User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthStore } from "../store/useAuthStore";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = AuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type.split("/")[0] !== "image") {
      toast.error("Only image files are allowed");
      e.target.value = null;
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast.error("File size exceeds 5MB");
      e.target.value = null; // reset the input
      return;
    }

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      updateProfile({ base64Image });
    };
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl p-4 py-8 mx-auto">
        {!showProfile && (
          <div className="relative p-6 space-y-8 bg-base-300 rounded-xl">
            <div className="absolute top-2 right-2">
              <button onClick={() => navigate("/")} title="Close">
                <X className="transition-transform duration-200 rounded-full cursor-pointer size-8 text-zinc-500 hover:scale-110 bg-base-200 hover:text-white" />
              </button>
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-semibold ">Profile</h1>
              <p className="mt-2">Your profile information</p>
            </div>

            {/* avatar upload section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center w-full h-full bg-opacity-20">
                  <span className="loading loading-ring loading-md"></span>
                </div>
                <img
                  src={selectedImg || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="object-cover transition-transform duration-200 border-4 rounded-full cursor-pointer size-32 hover:scale-105"
                  onClick={() => {
                    if (authUser.profilePic) {
                      setShowProfile(true);
                    }
                  }}
                  onLoad={(e) =>
                    (e.target.previousSibling.style.display = "none")
                  }
                  title={authUser.profilePic ? "View Profile Picture" : null}
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
                  title="Change Profile Picture"
                >
                  <Camera className="w-5 h-5 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <p className="text-sm text-zinc-400">
                {isUpdatingProfile
                  ? "Uploading..."
                  : "Click the camera icon to update your photo"}
              </p>
            </div>

            <div className="pb-6 space-y-6 border-b border-zinc-700">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <User className="w-4 h-4" />
                  Full Name
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border truncate">
                  {authUser?.name}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <Mail className="w-4 h-4" />
                  Email Address
                </div>
                <div className="flex px-4 py-2.5 justify-between bg-base-200 rounded-lg border">
                  <p className="truncate">{authUser?.email}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(authUser?.email || "");
                      toast.success("Copied to clipboard!"); // optional
                    }}
                    className="p-1 transition-transform duration-200 rounded-lg cursor-pointer hover:bg-base-300 hover:scale-110"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4 text-zinc-500 hover:text-white" />
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 bg-base-300 rounded-xl">
              <h2 className="mb-4 text-lg font-medium">Account Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2">
                  <span>Member Since</span>
                  <span
                    className="text-blue-500 transition-transform duration-200 cursor-pointer hover:scale-110"
                    title={authUser.createdAt?.split("T")[0]}
                  >
                    {authUser.createdAt?.split("T")[0]}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Account Status</span>
                  <span
                    className="text-green-500 transition-transform duration-200 cursor-pointer hover:scale-110"
                    title="Active"
                  >
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {showProfile && (
          <div className="absolute left-0 right-0 flex items-center justify-center p-6 mx-auto top-50 z-100 bg-base-300 rounded-xl max-h-75 max-w-75">
            <div
              className="absolute transition-transform duration-200 rounded-full cursor-pointer top-2 right-2 bg-base-100 hover:scale-110"
              title="Close"
            >
              <X
                className="size-7 text-zinc-500 hover:text-white "
                onClick={() => setShowProfile(false)}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center w-full h-full bg-opacity-20">
              <span className="loading loading-ring loading-lg"></span>
            </div>
            <img
              src={authUser.profilePic || "/avatar.png"}
              alt="profile"
              className="object-cover rounded-full w-50 h-50"
              onLoad={(e) => (e.target.previousSibling.style.display = "none")}
            />

            <a
              href={authUser.profilePic}
              className="absolute p-2 transition-transform duration-200 rounded-full cursor-pointer bottom-2 right-2 bg-base-100 hover:scale-110"
              download="profile"
              title="Download"
            >
              <Download className="size-6 text-zinc-500 hover:text-white" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProfilePage;
