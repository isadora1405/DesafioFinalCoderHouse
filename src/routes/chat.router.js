const router = require("express").Router();
const chatController = require("./../controllers/chat-controller");

router.get("/", (_request, response) => {
  response.render("chat", { style: "chat.css" });
});

router.post("/", chatController.saveMessage);

module.exports = router;
