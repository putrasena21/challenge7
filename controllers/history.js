const { History, User } = require("../models");

createHistory = async (req, res) => {
  try {
    let { score, score_date, user_id } = req.body;

    if (!score || !score_date || !user_id) {
      return res.status(400).json({
        status: "Error",
        message: "Please fill all the fields",
        data: null,
      });
    }

    let userExists = await User.findOne({
      where: { id: user_id },
    });

    if (!userExists) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    let newHistory = await History.create({
      score,
      score_date,
      user_id,
    });

    return res.status(201).json({
      status: "Success",
      message: "History created successfully",
      data: newHistory,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

getHistoryByUserId = async (req, res) => {
  try {
    let { id } = req.params;

    let userExists = await User.findOne({
      where: { id },
    });

    if (!userExists) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    let history = await User.findAll({
      include: "histories",
      where: { id: id },
    });

    return res.status(200).json({
      status: "Success",
      message: "History retrieved successfully",
      data: history,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      message: err.message,
    });
  }
};

updateHistory = async (req, res) => {
  try {
    let { id } = req.params;

    let history = await History.findOne({
      where: { id },
    });

    if (!history) {
      return res.status(404).json({
        status: "error",
        message: "History not found",
      });
    }

    let { score, score_date } = req.body;

    if (score) history.score = score;
    if (score_date) history.score_date = score_date;

    let updatedHistory = await history.update(
      {
        score,
        score_date,
      },
      {
        where: { id },
      }
    );

    return res.status(200).json({
      status: "Success",
      message: "History updated successfully",
      data: updatedHistory,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      message: err.message,
    });
  }
};

deleteHistory = async (req, res) => {
  try {
    let { id } = req.params;

    let history = await History.findOne({
      where: { id },
    });

    if (!history) {
      return res.status(404).json({
        status: "error",
        message: "History not found",
      });
    }

    let deletedHistory = await history.destroy({
      where: { id },
    });

    return res.status(200).json({
      status: "Success",
      message: "History deleted successfully",
      data: deletedHistory,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      message: err.message,
    });
  }
};

module.exports = {
  createHistory,
  getHistoryByUserId,
  updateHistory,
  deleteHistory,
};
