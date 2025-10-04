import { useEffect, useState } from "react";
import { ChatStore } from "../store/useChatStore";
import { AuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";

const Sidebar = () => {
  const { getUsers, isUsersLoading, setSelectedUser, users, selectedUser } = ChatStore();

  const { onlineUsers } = AuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);
  
  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="flex flex-col w-20 h-full transition-all duration-200 border-r lg:w-72 border-base-300">
      <div className="w-full p-5 border-b border-base-300">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="hidden font-medium lg:block">Contacts</span>
        </div>

        <div className="items-center hidden gap-2 mt-3 lg:flex">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span>
        </div>
      </div>

      <div className="w-full py-3 overflow-y-auto">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative mx-auto rounded-full lg:mx-0 bg-base-300">
              <div className="absolute inset-0 flex items-center justify-center w-full h-full bg-opacity-20">
                <span className="loading loading-ring loading-xs"></span>
              </div>
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="object-cover rounded-full size-10 lg:size-12"
                onLoad={(e) =>
                  (e.target.previousSibling.style.display = "none")
                }
              />
              {onlineUsers.includes(user._id) && (
                <span className="absolute bottom-0 right-0 bg-green-500 rounded-full size-3 ring-2 ring-zinc-900" />
              )}
            </div>

            <div className="hidden text-left lg:block w-7/9">
              <div className="font-medium truncate">{user.name}</div>
              <div className="text-sm text-zinc-400">
                <div className="flex items-center justify-between w-full">
                  <span className="truncate" title={user.lastMessage}>
                    {user.lastMessage}
                  </span>
                  {user.lastMessageAt && (
                    <time className="ml-2 text-xs text-zinc-500">
                      {new Date(user.lastMessageAt).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}
                    </time>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="py-4 text-center text-zinc-500">No online users</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
