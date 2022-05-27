const { Bio, User } = require("../models");

createBio = async (req, res) => {
  try {
    let { name, age, user_id } = req.body;

    if (!name || !age || !user_id) {
      return res.status(400).json({
        status: "Error",
        message: "Please fill all the fields",
        data: null,
      });
    }

    let userExists = await User.findOne({
      where: { id: user_id },
    });

    let bioExists = await Bio.findOne({
      where: { user_id: user_id },
    });

    if (!userExists) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (bioExists) {
      return res.status(400).json({
        status: "error",
        message: "Bio already exists",
      });
    }

    let newBio = await Bio.create({
      name,
      age,
      user_id,
    });

    return res.status(201).json({
      status: "Success",
      message: "Bio created successfully",
      data: newBio,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      message: err.message,
    });
  }
};

getAllBio = async (req, res) => {
  try {
    let bios = await Bio.findAll({
      include: "owner",
    });

    return res.status(200).json({
      status: "Success",
      message: "Bios retrieved successfully",
      data: bios,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      message: err.message,
    });
  }
};

getBio = async (req, res) => {
  try {
    let { id } = req.params;

    let bio = await Bio.findOne({
      where: { id },
      include: "owner",
    });

    if (!bio) {
      return res.status(404).json({
        status: "Error",
        message: "Bio not found",
      });
    }

    return res.status(200).json({
      status: "Success",
      message: "Bio retrieved successfully",
      data: bio,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      message: err.message,
    });
  }
};

updateBio = async (req, res) => {
  try {
    let { id } = req.params;
    let { name, age } = req.body;

    let bio = await Bio.findOne({
      where: { id },
    });

    if (!bio) {
      return res.status(404).json({
        status: "Error",
        message: "Bio not found",
      });
    }

    if (name) bio.name = name;
    if (age) bio.age = age;

    let updated = await bio.update({
      name,
      age,
    });

    return res.status(200).json({
      status: "Success",
      message: "Bio updated successfully",
      data: updated,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      message: err.message,
    });
  }
};

deleteBio = async (req, res) => {
  try {
    let { id } = req.params;

    let bio = await Bio.findOne({
      where: { id },
    });

    if (!bio) {
      return res.status(404).json({
        status: "Error",
        message: "Bio not found",
      });
    }

    let deleted = await bio.destroy();

    return res.status(200).json({
      status: "Success",
      message: "Bio deleted successfully",
      data: bio,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      message: err.message,
    });
  }
};

module.exports = {
  createBio,
  getAllBio,
  getBio,
  updateBio,
  deleteBio,
};
