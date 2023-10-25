"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.movieWatch)
      // define association here
    }
  }
  movie.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.STRING,
      },
      title: {
        type: DataTypes.STRING,
      },
      image: {
        type: DataTypes.STRING(512),
      },
      cover: {
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
        type: DataTypes.STRING,
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
    },
    {
      sequelize,
      timestamps: true,
      tableName: "movies",
      modelName: "movie",
    },
  )
  return movie
}
