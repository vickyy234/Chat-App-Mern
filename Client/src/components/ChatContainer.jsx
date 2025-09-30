import React from "react";
import { useEffect } from "react";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import { ChatStore } from "../store/useChatStore";
import { AuthStore } from "../store/useAuthStore";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading } = ChatStore();
  const { selectedUser } = ChatStore();
  const { authUser } = AuthStore();

  const authUserProfilePic = authUser.profilePic;

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);

  if (isMessagesLoading) {
    return (
      <div className="flex flex-col flex-1 overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <ChatHeader />

      <div className="flex flex-col flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            key={message._id}
          >
            <div className="chat-image avatar">
              <div className="relative border rounded-full size-10">
                <div className="absolute inset-0 flex items-center justify-center bg-opacity-20">
                  <span className="loading loading-ring loading-xs"></span>
                </div>
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUserProfilePic || "./avatar.png"
                      : selectedUser.profilePic || "./avatar.png"
                  }
                  alt="Profile pic"
                  onLoad={(e) =>
                    (e.target.previousSibling.style.display = "none")
                  }
                />
              </div>
            </div>
            <div className="mb-1 chat-header">
              <time className="ml-1 text-xs opacity-50">
                {new Date(message.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </time>
            </div>
            <div className="flex flex-col chat-bubble">
              {message.image && (
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center bg-opacity-20">
                    <span className="loading loading-spinner loading-xs"></span>
                  </div>
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2 size-48 object-cover"
                    onLoad={(e) =>
                      (e.target.previousSibling.style.display = "none")
                    }
                    load="smooth"
                  />
                </div>
              )}
              {message.text && <span>{message.text}</span>}
            </div>
            <div
              className={`chat-footer ${
                message.senderId === authUser._id ? "" : "hidden"
              }`}
            >
              Delivered
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
