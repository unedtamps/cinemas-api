"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class apiKey extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  apiKey.init(
    {
      key: {
        primaryKey: true,
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      is_premium: {
        type: DataTypes.BOOLEAN,
      },
      is_activated: {
        type: DataTypes.BOOLEAN,
      },
      expire_at: {
        type: DataTypes.BIGINT,
      },
    },
    {
      sequelize,
      modelName: "apiKey",
      tableName: "api_keys",
    },
  )
  return apiKey
}
