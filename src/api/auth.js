const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const User = require("../models/User");
const authMW = require("../../middleware/authMW");
const {
  register,
  login,
  verifyEmail,
} = require("../controller/AuthController");

// Get User Details
router.get("/", authMW, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Register
router.post(
  "/register",
  [
    check("userName", "User Name is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty(),
    check("email", "Email is not valid").isEmail(),
    check("password", "Password is required").not().isEmpty(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  (req, res) => register(req, res)
);

// Login
router.post(
  "/login",
  [
    check("email", "Email is required").not().isEmpty(),
    check("email", "Email is not valid").isEmail(),
    check("password", "Password is required").not().isEmpty(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  (req, res) => login(req, res)
);

// Verify Email
router.post("/verify-email", (req, res) => verifyEmail(req, res));

module.exports = router;
