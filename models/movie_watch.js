"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class movieWatch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.movie, {
        foreignKey: "movie_id",
      })
      // define association here
    }
  }
  movieWatch.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.STRING,
      },
      title: {
        type: DataTypes.STRING(512),
      },
      watch_url: {
        type: DataTypes.STRING(512),
      },
      movie_id: {
        type: DataTypes.STRING,
      },
      quality: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "movieWatch",
      tableName: "movie_watches",
      timestamps: false,
    },
  )
  return movieWatch
}
