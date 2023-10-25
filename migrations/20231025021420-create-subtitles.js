"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("subtitles", {
      url_sub: {
        type: Sequelize.STRING(1024),
      },
      lang: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      episode_id: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("subtitles")
  },
}
