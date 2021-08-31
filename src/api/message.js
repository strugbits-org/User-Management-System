const router = require("express").Router();
const authMW = require("../../middleware/authMW");
const {
  getMessages,
  addNewMessage,
} = require("../controller/MessageController");

//add new message
router.post("/", authMW, (req, res) => addNewMessage(req, res));

//get messages
router.get("/:conversationId", authMW, (req, res) => getMessages(req, res));

module.exports = router;
