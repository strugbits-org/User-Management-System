const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const Token = require("../models/Token");
const sendMail = require("../sendMail/SendMail");
const { frontendURL } = require("../shared/Shared");

const register = async (req, res) => {
  const errors = validationResult(req);
  const { userName, email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exits" });
    } else {
      const newUser = new User({
        userName,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      newUser.password = await bcrypt.hash(password, salt);
      await newUser.save();

      const payload = {
        user: {
          id: newUser.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 300 },
        async (err, token) => {
          if (err) {
            throw err;
          } else {
            const newToken = new Token({
              userId: newUser.id,
              token,
            });
            await newToken.save();
            const link = `${frontendURL}/verify-email?token=${token}`;
            sendMail(link, newUser.email);
            res.json({
              message:
                "We've sent account verification link to your email address. Please click on the link given in email to verify your account.",
            });
          }
        }
      );
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const login = async (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    } else {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
      }
      if (user.status === false) {
        return res
          .status(400)
          .json({ message: "Email address is not verified" });
      }
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 300000 },
        (err, token) => {
          if (err) {
            throw err;
          } else {
            res.json({ message: "You have been login successfully", token });
          }
        }
      );
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.body;
  const verifyUser = await Token.findOne({ token });
  if (verifyUser) {
    const userDetail = await User.findOne({ _id: verifyUser.userId });
    await User.findByIdAndUpdate(
      userDetail._id,
      { status: true },
      { upsert: true }
    );
    res.json({
      message: "Your email address has been verified",
      id: verifyUser.userId,
    });
  } else {
    res.json({ message: "Invalid Token" });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
};
