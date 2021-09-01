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
      user1Name: user1[0].firstName + " " + user1[0].lastName,
      user1Email: user1[0].email,
      user1Location:user1[0].city + ", " + user1[0].country,
      user1Employment:user1[0].employment,
      user2Id: user2[0].userId,
      user2Image: user2[0].userImage,
      user2Name: user2[0].firstName + " " + user2[0].lastName,
      user2Email: user2[0].email,
      user2Location:user2[0].city + ", " + user2[0].country,
      user2Employment:user2[0].employment,
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
