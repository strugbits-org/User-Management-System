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
    const users = await UserProfile.find({
      userId: { $ne: req.user.id },
    }).select("university userImage firstName lastName country");
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const searchUsers = async (req, res) => {
  const { name, university, country } = req.body;
  let getFilterUsers = [];

  try {
    if (university && name && country) {
      getFilterUsers = await UserProfile.find({
        userId: { $ne: req.user.id },
        university: { $regex: new RegExp(req.body.university, "i") },
        country: req.body.country,
        firstName: { $regex: new RegExp(req.body.name, "i") },
      }).select("university userImage firstName lastName country");
      if (getFilterUsers.length === 0) {
        getFilterUsers = await UserProfile.find({
          userId: { $ne: req.user.id },
          university: { $regex: new RegExp(req.body.university, "i") },
          country: req.body.country,
          lastName: { $regex: new RegExp(req.body.name, "i") },
        }).select("university userImage firstName lastName country");
      }
    } else if (university && country) {
      getFilterUsers = await UserProfile.find({
        userId: { $ne: req.user.id },
        university: { $regex: new RegExp(req.body.university, "i") },
        country: req.body.country,
      }).select("university userImage firstName lastName country");
    } else if (name && university) {
      getFilterUsers = await UserProfile.find({
        userId: { $ne: req.user.id },
        university: { $regex: new RegExp(req.body.university, "i") },
        firstName: { $regex: new RegExp(req.body.name, "i") },
      }).select("university userImage firstName lastName country");
      if (getFilterUsers.length === 0) {
        getFilterUsers = await UserProfile.find({
          userId: { $ne: req.user.id },
          university: { $regex: new RegExp(req.body.university, "i") },
          lastName: { $regex: new RegExp(req.body.name, "i") },
        }).select("university userImage firstName lastName country");
      }
    } else if (name && country) {
      getFilterUsers = await UserProfile.find({
        userId: { $ne: req.user.id },
        country: req.body.country,
        firstName: { $regex: new RegExp(req.body.name, "i") },
      }).select("university userImage firstName lastName country");
      if (getFilterUsers.length === 0) {
        getFilterUsers = await UserProfile.find({
          userId: { $ne: req.user.id },
          country: req.body.country,
          lastName: { $regex: new RegExp(req.body.name, "i") },
        }).select("university userImage firstName lastName country");
      }
    } else if (name || university || country) {
      if (name) {
        getFilterUsers = await UserProfile.find({
          userId: { $ne: req.user.id },
          firstName: { $regex: new RegExp(req.body.name, "i") },
        }).select("university userImage firstName lastName country");
        if (getFilterUsers.length === 0) {
          getFilterUsers = await UserProfile.find({
            userId: { $ne: req.user.id },
            lastName: { $regex: new RegExp(req.body.name, "i") },
          }).select("university userImage firstName lastName country");
        }
      } else if (university) {
        getFilterUsers = await UserProfile.find({
          userId: { $ne: req.user.id },
          university: { $regex: new RegExp(req.body.university, "i") },
        }).select("university userImage firstName lastName country");
      } else {
        getFilterUsers = await UserProfile.find({
          userId: { $ne: req.user.id },
          country: req.body.country,
        }).select("university userImage firstName lastName country");
      }
    } else {
      getFilterUsers = [];
    }

    res.json(getFilterUsers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getUserIdByUserProfileId = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await UserProfile.findById(id).select("userId");
    res.json(user.userId);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  updateProfile,
  getUserProfile,
  getUserProfileDetails,
  getAllUsers,
  searchUsers,
  getUserIdByUserProfileId,
};
