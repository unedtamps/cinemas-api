"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tv_watches", {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      watch_url: {
        allowNull: false,
        type: Sequelize.STRING(512),
      },
      tv_id: {
        allowNull: false,
        references: {
          model: "tvs",
          key: "id",
        },
        type: Sequelize.STRING,
      },
      quality: {
        allowNull: false,
        type: Sequelize.ENUM("1080p", "auto"),
        primaryKey: true,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tv_watches")
  },
}
