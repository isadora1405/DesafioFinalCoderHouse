const express = require("express");
const sessionController = require("../controllers/session-controller");

const router = express.Router();

router.post("/register", sessionController.registerUser);
router.post("/login", sessionController.loginUser);
router.get("/logout", sessionController.logoutUser);

module.exports = router;
