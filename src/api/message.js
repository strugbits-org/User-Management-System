const router = require("express").Router();
const Message = require("../models/Message");
const UserProfile = require("../models/UserProfile");

//add new message
router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get messages
router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    // const uniqueRecord = [
    //   ...new Map(messages.map((v) => [v["sender"], v])).values(),
    // ];

    // const user1 = await UserProfile.findOne({
    //   userId: uniqueRecord[0]?.sender,
    // });
    // const user2 = await UserProfile.findOne({
    //   userId: uniqueRecord[1]?.sender,
    // });

    // if (user1 && user2) {
    //   const user1ImagePath = {
    //     userImage: user1.userImage,
    //     user: user1.userId,
    //   };
    //   messages.push(user1ImagePath);

    //   const user2ImagePath = {
    //     userImage: user2.userImage,
    //     user: user2.userId,
    //   };
    //   messages.push(user2ImagePath);
    // } else if (user1) {
    //   const user1ImagePath = {
    //     userImage: user1.userImage,
    //     user: user1.userId,
    //   };
    //   messages.push(user1ImagePath);
    // }

    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
