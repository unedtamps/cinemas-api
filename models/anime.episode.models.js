"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class animeEpisode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.anime, {
        foreignKey: "anime_id",
      })
    }
  }
  animeEpisode.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.STRING,
      },
      quality: DataTypes.STRING,
      anime_id: DataTypes.STRING,
      episode_url: DataTypes.STRING(514),
    },
    {
      sequelize,
      modelName: "animeEpisode",
      tableName: "anime_episode",
      timestamps: false
    },
  )
  return animeEpisode
}
