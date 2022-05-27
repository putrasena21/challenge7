const { imagekit } = require("../helpers/imagekit");
const jwt = require("jsonwebtoken");
const { Bio, Video } = require("../models");

module.exports = {
  imageKit: async (req, res) => {
    try {
      const file = req.file.buffer.toString("base64");
      const uniqueSubfix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = uniqueSubfix + req.file.originalname;

      const upload = await imagekit.upload({
        fileName: fileName,
        file: file,
      });

      if (upload) {
        const url = upload.url;
        const token = req.headers.authorization;
        const user = jwt.decode(token.split(" ")[1]);

        let bio = await Bio.findOne({
          where: {
            user_id: user.id,
          },
        });

        let updated = await bio.update({
          avatar: url,
        });

        return res.status(200).json({
          status: "success",
          message: "Avatar uploaded successfully",
          data: {
            ...upload,
          },
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: "Error",
        message: err.message,
        error: err,
      });
    }
  },

  videoKit: async (req, res) => {
    try {
      const file = req.file.buffer.toString("base64");
      const uniqueSubfix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const fileName = uniqueSubfix + req.file.originalname;

      const upload = await imagekit.upload({
        fileName: fileName,
        file: file,
      });

      if (upload) {
        const url = upload.url;
        const token = req.headers.authorization;
        const user = jwt.decode(token.split(" ")[1]);

        // upload video
        let video = await Video.create({
          title: fileName,
          url: url,
          user_id: user.id,
        });

        return res.status(200).json({
          status: "success",
          message: "Video uploaded successfully",
          data: {
            ...upload,
          },
        });
      }
    } catch (err) {
      return res.status(500).json({
        status: "Error",
        message: err.message,
        error: err,
      });
    }
  },
};
