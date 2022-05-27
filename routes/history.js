const express = require("express");
const router = express.Router();

const middleware = require("../middleware");

const {
  createHistory,
  getHistoryByUserId,
  updateHistory,
  deleteHistory,
} = require("../controllers/history");

router.post("/", [middleware.role], createHistory);
router.get("/:id", [middleware.role], getHistoryByUserId);
router.put("/:id", [middleware.role], updateHistory);
router.delete("/:id", [middleware.role], deleteHistory);

module.exports = router;
