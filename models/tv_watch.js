"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class tvWatch extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.tv, {
        foreignKey: "tv_id",
      })
    }
  }
  tvWatch.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.STRING
      },
      title:{
        type: DataTypes.STRING,
      },
      watch_url:{
        type:DataTypes.STRING(512),
      },
      tv_id:{
        type: DataTypes.STRING
      },
      quality:{
        type: DataTypes.STRING
      },
    },
    {
      sequelize,
      modelName: "tvWatch",
      tableName: "tv_watches",
      timestamps: false
    },
  )
  return tvWatch
}
