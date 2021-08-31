const Conversation = require("../models/Conversation");

const addNewConversation = async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const existingReceiver = await Conversation.find({
      members: req.body.receiverId,
    });
    let existingConvo = [];
    existingReceiver.map((v) => {
      existingConvo = v.members.find((c) => c === req.body.senderId);
    });

    if (existingConvo) {
      res.status(200).json("Success");
    } else {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getUserConversation = async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const searchConversation = async (req, res) => {
  const users = [];
  const searchResult = [];
  const word = req.params.keyword;

  try {
    const conversation = await Conversation.find({
      members: { $in: [req.user.id] },
    });

    const result = await User.find({
      userName: { $regex: new RegExp(".*" + word + ".*", "i") },
    });

    conversation.map((v) => {
      const friendId = v.members.find((v) => v !== req.user.id);
      const friend = {
        friendId,
        convoId: v._id,
      };
      users.push(friend);
    });

    result.map((v) => {
      users.map((c) => {
        if (v.id === c.friendId) {
          const searchObj = {
            userName: v.userName,
            friendId: c.friendId,
            convoId: c.convoId,
          };
          searchResult.push(searchObj);
        }
      });
    });

    res.status(200).json(searchResult);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  addNewConversation,
  getUserConversation,
  searchConversation,
};
