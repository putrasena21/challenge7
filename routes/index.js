const express = require("express");
const router = express.Router();
const passport = require("../lib/passport");

router.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the challenge4 API",
  });
});

const user = require("./user");
router.use("/users", user);

const bio = require("./bio");
router.use("/bio", [passport.authenticate("jwt", { session: false })], bio);

const history = require("./history");
router.use(
  "/histories",
  [passport.authenticate("jwt", { session: false })],
  history
);

const media = require("./media");
router.use("/media", [passport.authenticate("jwt", { session: false })], media);

module.exports = router;
