const express = require("express");
const sessionController = require("../controllers/session-controller");

const router = express.Router();

router.post("/register", sessionController.registerUser);
router.post("/login", sessionController.loginUser);
router.get("/logout", sessionController.logoutUser);
router.get("/failregister", sessionController.failRegister);
router.get("/github", sessionController.githubAuth);
router.get("/githubcallback", sessionController.githubCallback);

module.exports = router;
