import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import Chat from "../models/chatModel.js";
import cloudinary from "../lib/cloudinary.js";
import { io, getReceiverSocketId } from "../lib/socket.js";

export const getUsers = async (req, res) => {
  try {
    const LoggedUserId = req.user._id;
    const users = await User.find({ _id: { $ne: LoggedUserId } }).select(
      "-password"
    );

    const chats = await Chat.find({
      participants: { $in: [LoggedUserId] },
    });

    const usersWithChatInfo = users.map((user) => {
      const chat = chats.find((chat) =>
        chat.participants.some((p) => p.toString() === user._id.toString())
      );
      return {
        ...user.toObject(),
        lastMessage: chat ? chat.lastMessage : null,
        lastMessageAt: chat ? chat.updatedAt : null,
      };
    });

    res.status(200).json({
      message: "Users fetched successfully",
      users: usersWithChatInfo,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Get users error:", error);
  }
};

export const getMessages = async (req, res) => {
  try {
    const LoggedUserId = req.user._id;
    const selectedUserId = req.params.id;

    const messages = await Message.find({
      $or: [
        { senderId: LoggedUserId, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: LoggedUserId },
      ],
    });

    res
      .status(200)
      .json({ message: "Messages fetched successfully", messages });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Get messages error:", error);
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, base64Image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageURL;
    if (base64Image) {
      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "Wave_Chat_Images",
        format: "jpg",
        overwrite: true,
      });
      imageURL = uploadResponse.secure_url;
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageURL,
    });

    await newMessage.save();

    let chat = await Chat.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!chat) {
      chat = new Chat({
        participants: [senderId, receiverId],
        lastMessage: newMessage.text || "📷 Image",
      });
    } else {
      chat.lastMessage = newMessage.text || "📷 Image";
    }
    await chat.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    const senderSocketId = getReceiverSocketId(senderId);
    if (receiverSocketId || senderSocketId) {
      io.to([receiverSocketId, senderSocketId]).emit("newMessage", newMessage);
    }

    return res
      .status(201)
      .json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Send message error:", error);
  }
};
