"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class anime extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.animeEpisode)
    }
  }
  anime.init(
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      title: DataTypes.STRING,
      genres: DataTypes.STRING(512),
      release_year: DataTypes.STRING(4),
      image: DataTypes.STRING,
      total_episode: DataTypes.INTEGER,
      description: DataTypes.TEXT,
      sub_or_dub: DataTypes.STRING(4),
      status: DataTypes.STRING(20),
      type: DataTypes.STRING(20),
    },
    {
      sequelize,
      modelName: 'anime',
      tableName: 'anime',
    },
  )
  return anime
}
