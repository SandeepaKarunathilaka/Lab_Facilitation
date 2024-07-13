const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/patient/signup", authController.patientSignup);
router.post("/login", authController.login);

module.exports = router;
