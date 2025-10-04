import React from "react";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import { ChatStore } from "../store/useChatStore";

const HomePage = () => {
  const { selectedUser } = ChatStore();

  return (
    <div className="h-screen bg-base-200">
      <div className="flex items-center justify-center px-4 pt-20">
        <div className="bg-base-100 rounded-lg shadow-lg w-full max-w-6xl h-[calc(100vh-8rem)]">
          <div className="flex h-full overflow-hidden rounded-lg">
            <Sidebar />
            {selectedUser ? <ChatContainer /> : <NoChatSelected />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
