const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    // unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  postalCode: {
    type: Number,
    required: true,
  },
  aboutMe: {
    type: String,
    required: true,
  },
  university: {
    type: String,
    required: true,
  },
  employment: {
    type: String,
    required: true,
  },
  userImage: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = UserProfile = mongoose.model("userProfile", UserProfileSchema);
