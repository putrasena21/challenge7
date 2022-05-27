const express = require("express");
const router = express.Router();

const middleware = require("../middleware");

const media = require("../controllers/media");

router.post("/upload/avatar", [middleware.upload], media.imageKit);
router.post("/upload/video", [middleware.upload], media.videoKit);

module.exports = router;
