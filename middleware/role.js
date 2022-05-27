const jwt = require("jsonwebtoken");

const role = (req, res, next) => {
  const token = req.headers.authorization;
  const user = jwt.decode(token.split(" ")[1]);
  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "No token provided!",
    });
  }
  if (user.role !== "admin") {
    return res.status(401).json({
      status: "error",
      message: "Only admin can access this route!",
    });
  } else {
    next();
  }
};

module.exports = role;
