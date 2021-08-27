const { validationResult } = require("express-validator");
const UserProfile = require("../models/UserProfile");
const User = require("../models/User");
const { unlink } = require("fs");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const userProfile = await UserProfile.findOne({ userId: user._id });
    let userProfileDetails = {};
    if (userProfile) {
      userProfileDetails = {
        userName: user.userName,
        email: userProfile.email,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        address: userProfile.address,
        city: userProfile.city,
        country: userProfile.country,
        postalCode: userProfile.postalCode,
        aboutMe: userProfile.aboutMe,
        employment: userProfile.employment,
        university: userProfile.university,
        userImage: userProfile.userImage,
      };
    } else {
      userProfileDetails = {
        userName: user.userName,
      };
    }
    res.json(userProfileDetails);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const updateProfile = async (req, res) => {
  const errors = validationResult(req);
  const {
    userName,
    email,
    firstName,
    lastName,
    address,
    city,
    country,
    postalCode,
    aboutMe,
    university,
    employment,
    id,
  } = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const userProfile = new UserProfile({
      email,
      firstName,
      lastName,
      address,
      city,
      country,
      postalCode,
      aboutMe,
      university,
      employment,
      userId: id,
      userImage: req.file?.path,
    });
    const exisitingProfile = await UserProfile.findOne({ userId: id });

    if (exisitingProfile) {
      if (req.file) {
        unlink(exisitingProfile.userImage, (err) => {
          if (err) throw err;
        });
        await UserProfile.findOneAndUpdate(
          { _id: exisitingProfile._id },
          {
            $set: {
              userImage: req.file.path,
            },
          }
        );
      }
      await UserProfile.findOneAndUpdate(
        { _id: exisitingProfile._id },
        {
          $set: {
            email: email,
            firstName: firstName,
            lastName: lastName,
            address: address,
            city: city,
            country: country,
            postalCode: postalCode,
            aboutMe: aboutMe,
            university: university,
            employment: employment,
          },
        }
      );
      await User.findByIdAndUpdate(
        id,
        { userName: userName },
        { upsert: true }
      );
    } else {
      await userProfile.save();
      await User.findByIdAndUpdate(
        id,
        { userName: userName },
        { upsert: true }
      );
    }

    res.json({
      message: "Your Profile has been updated successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const getUserProfileDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    const userProfile = await UserProfile.findOne({ userId: user._id });
    let userProfileDetails = {};
    if (userProfile) {
      userProfileDetails = {
        userName: user.userName,
        email: userProfile.email,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        address: userProfile.address,
        city: userProfile.city,
        country: userProfile.country,
        postalCode: userProfile.postalCode,
        aboutMe: userProfile.aboutMe,
        university: userProfile.userProfile,
        employment: userProfile.employment,
        userImage: userProfile.userImage,
      };
    } else {
      userProfileDetails = {
        userName: user.userName,
      };
    }
    res.json(userProfileDetails);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await UserProfile.find({ userId: { $ne: req.user.id } })
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  updateProfile: updateProfile,
  getUserProfile: getUserProfile,
  getUserProfileDetails: getUserProfileDetails,
  getAllUsers: getAllUsers,
};
