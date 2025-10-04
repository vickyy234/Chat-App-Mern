import mongoose from "mongoose";
import User from "./userModel.js";

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const chat = mongoose.model("Chat", chatSchema);

export default chat;
