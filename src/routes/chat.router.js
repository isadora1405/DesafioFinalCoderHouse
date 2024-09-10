const router = require("express").Router();
const chatController = require("./../controllers/chat-controller");
const authorizationMiddleware = require("../middleware/authorizationMiddleware.js");

router.get("/", (_request, response) => {
  response.render("chat", { style: "chat.css" });
});

router.post("/", authorizationMiddleware("user"), chatController.saveMessage);

module.exports = router;
