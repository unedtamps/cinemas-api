"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password:DataTypes.STRING,
      auth_type:DataTypes.STRING,
      key: DataTypes.STRING,
      expire_at: DataTypes.BIGINT,
      is_activated:DataTypes.BOOLEAN,
      is_premium: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "user",
    },
  )
  return user
}
