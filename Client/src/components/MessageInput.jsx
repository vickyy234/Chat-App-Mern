import React from "react";
import toast from "react-hot-toast";
import { useState, useRef } from "react";
import { X, Image, Send } from "lucide-react";
import { ChatStore } from "../store/useChatStore";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage, isMessagesSending } = ChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      e.target.value = null;
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      e.target.value = null;
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!text.trim() && !image) || isMessagesSending) {
      toast.error("Message cannot be empty");
      return;
    }

    try {
      await sendMessage({ text: text.trim(), base64Image: image });
      setText("");
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div className="w-full p-4">
      {image && (
        <div className="flex items-center gap-2 mb-3">
          <div className="relative">
            <img
              src={image}
              alt="Preview"
              className={`object-cover w-20 h-20 rounded-lg border-zinc-700 ${
                isMessagesSending ? "animate-pulse" : ""
              }`}
              title={`${isMessagesSending ? "Uploading" : ""}`}
            />
            <button
              onClick={removeImage}
              className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-around"
            >
              <X />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            className="w-full rounded-lg input input-bordered input-sm sm:input-md"
            placeholder="Type a message"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current.click()}
            className={`hidden btn btn-circle sm:flex ${
              image ? "text-emerald-500" : "text-zinc-400"
            }`}
            title="media"
          >
            <Image size={20} />
          </button>
        </div>
        <div title={`${isMessagesSending ? "Sending..." : "send"}`}>
          <button
            type="submit"
            className="btn btn-sm btn-circle"
            disabled={(!text.trim() && !image) || isMessagesSending}
          >
            <Send
              size={22}
              className={`${isMessagesSending && "animate-spin"}`}
            />
          </button>
        </div>
      </form>
    </div>
  );
};

export default MessageInput;
