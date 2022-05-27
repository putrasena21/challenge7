"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bio extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bio.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "owner",
      });
    }
  }
  Bio.init(
    {
      name: DataTypes.STRING,
      age: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      avatar: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Bio",
    }
  );
  return Bio;
};
