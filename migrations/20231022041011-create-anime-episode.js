"use strict"


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("anime_episodes", {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      quality: {
        allowNull: false,
        type: Sequelize.ENUM("1080p", "default", "backup"),
        primaryKey: true
      },
      anime_id: {
        type: Sequelize.STRING,
        allowNull: false,
        // references: { model: "animes", key: "id" },
      },
      episode_url: Sequelize.STRING(514),
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("anime_episodes")
  },
}
