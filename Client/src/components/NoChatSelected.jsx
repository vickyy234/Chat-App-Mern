import React from "react";
import { Send } from "lucide-react";
const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50">
      <div className="max-w-md text-center space-y-6">
        <div className="relative">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center animate-bounce">
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
