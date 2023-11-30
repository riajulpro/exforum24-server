const User = require("../../models/userModel");

const verifyAdmin = async (req, res, next) => {
  try {
    const email = req.decode.email;

    const user = await User.findOne({ email });

    if (!user || !user.isAdmin) {
      return res.status(403).send({ message: "Forbidden access" });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = verifyAdmin;
