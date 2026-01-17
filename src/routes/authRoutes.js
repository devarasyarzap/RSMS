const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/users", authController.getAllUsers);

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/register-patient", authController.registerPatientSelf);

module.exports = router;
