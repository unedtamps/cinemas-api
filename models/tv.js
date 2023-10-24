"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class tv extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.tvWatch)
    }
  }
  tv.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.STRING
      },
      title: {
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING(512),
      },
      release_date: {
        type: DataTypes.DATE,
      },
      description: {
        type: DataTypes.TEXT,
      },
      genres: {
        type: DataTypes.STRING(512),
      },
      cast: {
        type: DataTypes.STRING(1024),
      },
      production: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
      },
      duration: {
        type: DataTypes.INTEGER,
      },
      rating: {
        type: DataTypes.FLOAT,
      },
      total_season: {
        type: DataTypes.INTEGER,
      },
      total_episode: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "tv",
      tableName: "tvs"
    },
  )
  return tv
}
