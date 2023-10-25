"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class subtitles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  subtitles.init(
    {
      episode_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      url_sub: DataTypes.STRING,
      lang: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
    },
    {
      sequelize,
      modelName: "subtitles",
      timestamps:false
    },
  )
  return subtitles
}
