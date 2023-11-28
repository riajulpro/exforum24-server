const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).send({ status: "unAuthorized", code: "401" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    req.decode = decoded;
    next();
  } catch (error) {
    res.status(401).send({ status: "unAuthorized", code: "401" });
  }
}

module.exports = verifyToken;
