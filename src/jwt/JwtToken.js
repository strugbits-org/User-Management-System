const jwt = require("jsonwebtoken");
const config = require("config");

const jwtAuth = (payload,) => {

  jwt.sign(payload, config.get("jwtSecret"), { expiresIn: 360000 });
};

module.exports = jwtAuth;
