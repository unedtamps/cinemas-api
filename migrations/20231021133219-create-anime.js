"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("animes", {
      id: {
        primaryKey: true,
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      genres: Sequelize.STRING(512),
      other_name: Sequelize.STRING(512),
      release_year: Sequelize.STRING(4),
      image: Sequelize.STRING,
      total_episode: Sequelize.INTEGER,
      description: Sequelize.TEXT,
      sub_or_dub: Sequelize.STRING(4),
      status: Sequelize.STRING(64),
      type: Sequelize.STRING(64),
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
    await queryInterface.dropTable("animes")
  },
}
