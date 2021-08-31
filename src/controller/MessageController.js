const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const UserProfile = require("../models/UserProfile");

const addNewMessage = async (req, res) => {
  const newMessage = new Message(req.body);
  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });

    const conversationIds = await Conversation.findById(
      req.params.conversationId
    );

    const user1Id = conversationIds.members[0];
    const user2Id = conversationIds.members[1];
    const user1 = await UserProfile.find({ userId: user1Id });
    const user2 = await UserProfile.find({ userId: user2Id });

    const userImages = {
      user1Id: user1[0].userId,
      user1Image: user1[0].userImage,
      user2Id: user2[0].userId,
      user2Image: user2[0].userImage,
    };
    res.status(200).json({ messages, userImages });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  addNewMessage,
  getMessages,
};
