const express = require("express");
const router = express.Router();
const passport = require("../lib/passport");

const {
  createUser,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
  login,
} = require("../controllers/user");

router.post("/login", login);
router.post("/register", createUser);

router.get("/", [passport.authenticate("jwt", { session: false })], getAllUser);
router.get("/:id", [passport.authenticate("jwt", { session: false })], getUser);
router.put(
  "/:id",
  [passport.authenticate("jwt", { session: false })],
  updateUser
);
router.delete(
  "/:id",
  [passport.authenticate("jwt", { session: false })],
  deleteUser
);

module.exports = router;
