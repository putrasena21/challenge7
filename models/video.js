"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Video.belongsTo(models.User, { foreignKey: "user_id", as: "creator" });
    }
  }
  Video.init(
    {
      title: DataTypes.STRING,
      url: DataTypes.STRING,
      user_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Video",
    }
  );
  return Video;
};
