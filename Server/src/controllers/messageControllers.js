import User from "../models/userModel.js";
import Message from "../models/messageModel.js";

export const getUsers = async (req, res) => {
  try {
    const LoggedUserId = req.user._id;
    const users = await User.find({ _id: { $ne: LoggedUserId } }).select(
      "-password"
    );
    res.status(200).json({ message: "Users fetched successfully", users });
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
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image,
    });

    if (newMessage) {
      await newMessage.save();
      return res
        .status(201)
        .json({ message: "Message sent successfully", newMessage });
    } else {
      return res.status(400).json({ message: "Failed to send message" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
    console.error("Send message error:", error);
  }
};
