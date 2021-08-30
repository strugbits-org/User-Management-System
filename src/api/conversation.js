const router = require("express").Router();
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const authMW = require("../../middleware/authMW");

//new conversation
router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const existingReceiver = await Conversation.find({
      members: req.body.receiverId,
    });

    const [existingConvo] = existingReceiver.map((v) =>
      v.members.find((c) => c === req.body.senderId)
    );

    if (existingConvo) {
      res.status(200).json("Success");
    } else {
      const savedConversation = await newConversation.save();
      res.status(200).json(savedConversation);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conversation of a user
router.get("/:userId", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conversation includes two userId
router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/search-users/:keyword", authMW, async (req, res) => {
  let users = [];
  let userDetail = [];
  const word = req.params.keyword.toLowerCase();
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.user.id] },
    });

    // const result = await User.find({
    //   userName: { $regex: new RegExp(".*" + req.params.keyword + ".*", "i") },
    // });
    conversation.map((v) => {
      const friendId = v.members.find((v) => v !== req.user.id);
      const friend = {
        friendId,
        convoId: v._id,
      };
      users.push(friend);
    });

    const userFriends = users.map(async (v) => {
      const friendName = await User.find({ _id: v.friendId }).select(
        "userName"
      );
      return friendName;
    });

    await Promise.all(userFriends).then((v) =>
      v.map((c) => {
        users.map((user) => {
          if (user.friendId === c[0].id) {
            const detail = {
              name: c[0].userName,
              convId: user.convoId,
            };
            userDetail.push(detail);
          }
        });
      })
    );
      let search = [];
      userDetail.map((v) => {
        const lowerCase = v.name.toLowerCase();
        if(lowerCase === word){
          search.push(lowerCase)
        }
      })

    res.status(200).json(userDetail);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
