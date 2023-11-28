const jwt = require("jsonwebtoken");

function generateToken(payload) {
  return jwt.sign(payload, process.env.SECRET_TOKEN_KEY, { expiresIn: "24h" });
}

module.exports = { generateToken };
