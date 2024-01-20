"use strict"

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("movie_watches", {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      watch_url: {
        allowNull: false,
        type: Sequelize.STRING(512),
      },
      title: {
        allowNull: true,
        type: Sequelize.STRING(512),
      },
      movie_id: {
        allowNull: false,
        references: {
          model: "movies",
          key: "id",
        },
        type: Sequelize.STRING,
      },
      quality: {
        allowNull: false,
        type: Sequelize.ENUM("1080", "auto"),
        primaryKey: true,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("movie_watches")
  },
}
