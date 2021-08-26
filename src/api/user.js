const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const authMW = require("../../middleware/authMW");
const {
  updateProfile,
  getUserProfile,
  getUserProfileDetails
} = require("../controller/UserController");
const { upload } = require("../shared/Shared");

// Get User Profile Details
router.get("/", authMW, (req, res) => getUserProfile(req, res));

// Update Profile
router.post(
  "/update-profile",
  authMW,
  upload.single("userImage"),
  [
    check("userName", "User Name is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty(),
    check("email", "Email is not valid").isEmail(),
    check("firstName", "Firt Name is required").not().isEmpty(),
    check("lastName", "Last Name is required").not().isEmpty(),
    check("address", "Address is required").not().isEmpty(),
    check("city", "City is required").not().isEmpty(),
    check("country", "Country is required").not().isEmpty(),
    check("postalCode", "Postal Code is required").not().isEmpty(),
    check("aboutMe", "About Me is required").not().isEmpty(),
  ],
  (req, res) => updateProfile(req, res)
);

// get user profile not protected
router.get("/get-user/:id", (req, res) => getUserProfileDetails(req, res));

module.exports = router;
