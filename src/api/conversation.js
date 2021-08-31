const router = require("express").Router();
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const authMW = require("../../middleware/authMW");
const {
  addNewConversation,
  getUserConversation,
  searchConversation,
} = require("../controller/ConversationController");

//new conversation
router.post("/", authMW, (req, res) => addNewConversation(req, res));

//get conversation of a user
router.get("/:userId", authMW, (req, res) => getUserConversation(req, res));

//search conversation
router.get("/search-users/:keyword", authMW, (req, res) =>
  searchConversation(req, res)
);

// get conversation includes two userId
// router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
//   try {
//     const conversation = await Conversation.findOne({
//       members: { $all: [req.params.firstUserId, req.params.secondUserId] },
//     });
//     res.status(200).json(conversation);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router;
