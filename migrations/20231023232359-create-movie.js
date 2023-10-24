"use strict"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("movies", {
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
      image: {
        allowNull: true,
        type: Sequelize.STRING(512),
      },
      cover: {
        allowNull: true,
        type: Sequelize.STRING(512),
      },
      release_date: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      description: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      genres: {
        allowNull: true,
        type: Sequelize.STRING(512),
      },
      cast: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      production: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      country: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      duration: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      rating: {
        allowNull: true,
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable("movies")
  },
}
