import { useState } from "react";
import { Camera, Copy, Download, Loader, Mail, User, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
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
      <div className="max-w-2xl mx-auto p-4 py-8">
        {!showProfile && (
          <div className="relative bg-base-300 rounded-xl p-6 space-y-8">
            <div className="absolute top-2 right-2">
              <button onClick={() => navigate("/")} title="Close">
                <X className="size-8 text-zinc-500 hover:scale-110 bg-base-200 hover:text-white rounded-full cursor-pointer transition-transform duration-200" />
              </button>
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-semibold ">Profile</h1>
              <p className="mt-2">Your profile information</p>
            </div>

            {/* avatar upload section */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={selectedImg || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className={`size-32 rounded-full object-cover border-4 cursor-pointer transition-transform duration-200 hover:scale-105 ${
                    isImageLoading ? "opacity-50" : "opacity-100"
                  }`}
                  onClick={() => {
                    if (authUser.profilePic) {
                      setShowProfile(true);
                    }
                  }}
                  onLoad={() => setIsImageLoading(false)}
                  title={authUser.profilePic ? "View Profile Picture" : null}
                />
                {isImageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full">
                    <Loader className="size-10 animate-spin" />
                  </div>
                )}
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

            <div className="space-y-6 pb-6 border-b border-zinc-700">
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border truncate">
                  {authUser?.name}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
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
                    className="p-1 hover:bg-base-300 hover:scale-110 rounded-lg transition-transform duration-200 cursor-pointer"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4 text-zinc-500 hover:text-white" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-base-300 rounded-xl px-6">
              <h2 className="text-lg font-medium  mb-4">Account Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2">
                  <span>Member Since</span>
                  <span
                    className="text-blue-500 hover:scale-110 transition-transform duration-200 cursor-pointer"
                    title={authUser.createdAt?.split("T")[0]}
                  >
                    {authUser.createdAt?.split("T")[0]}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Account Status</span>
                  <span
                    className="text-green-500 hover:scale-110 transition-transform duration-200 cursor-pointer"
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
          <div className="absolute top-50 z-100 flex bg-base-300 rounded-xl p-6 max-h-75 max-w-75 items-center justify-center mx-auto left-0 right-0">
            <div
              className="absolute top-2 right-2 bg-base-100 rounded-full cursor-pointer hover:scale-110 transition-transform duration-200"
              title="Close"
            >
              <X
                className="size-7 text-zinc-500  hover:text-white "
                onClick={() => setShowProfile(false)}
              />
            </div>
            <img
              src={authUser.profilePic || "/avatar.png"}
              alt="profile"
              className="w-50 h-50 object-cover rounded-full"
            />

            <a
              href={authUser.profilePic}
              className="absolute bottom-2 right-2 bg-base-100 rounded-full p-2 transition-transform duration-200 cursor-pointer hover:scale-110"
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
