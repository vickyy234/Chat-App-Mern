import React from "react";
import { Send } from "lucide-react";
const NoChatSelected = () => {
  return (
    <div className="flex flex-col items-center justify-center flex-1 w-full p-16 bg-base-100/50">
      <div className="max-w-md space-y-6 text-center">
        <div className="relative">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 animate-bounce">
              <Send className="w-8 h-8 text-primary hover:text-primary/50" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold">Welcome to Wave!</h2>
        <p className="text-base-content/60">Select a chat to start messaging</p>
      </div>
    </div>
  );
};

export default NoChatSelected;
