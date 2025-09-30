import React from "react";
import { X } from "lucide-react";
import { AuthStore } from "../store/useAuthStore";
import { ChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = ChatStore();
  const { onlineUsers } = AuthStore();

  return (
    <div className="p-3 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="relative rounded-full size-10">
              <div className="absolute inset-0 flex items-center justify-center w-full h-full bg-opacity-20">
                <span className="loading loading-ring loading-xs"></span>
              </div>
              <img
                src={selectedUser.profilePic}
                alt={selectedUser.name}
                onLoad={(e) =>
                  (e.target.previousSibling.style.display = "none")
                }
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium">{selectedUser.name}</h3>
            <p className="text-sm text-base-content/70">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        <button
          title="Close Chat"
          className="btn btn-ghost btn-circle"
          onClick={() => setSelectedUser(null)}
        >
          <X />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
