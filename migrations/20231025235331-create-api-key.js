"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("api_keys", {
      key: {
        type: Sequelize.STRING,
        primaryKey: true,
        autoIncrement: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_premium: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      expire_at: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      is_activated: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        onUpdate: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("api_keys")
  },
}
