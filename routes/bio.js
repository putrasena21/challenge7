const express = require("express");
const router = express.Router();

const {
  createBio,
  getBio,
  getAllBio,
  updateBio,
} = require("../controllers/bio");

router.post("/", createBio);
router.get("/", getAllBio);
router.get("/:id", getBio);
router.put("/:id", updateBio);
router.delete("/:id", deleteBio);

module.exports = router;
