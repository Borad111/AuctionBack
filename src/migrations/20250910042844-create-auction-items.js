"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("auction_items", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      startingPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      currentPrice: {
        type: Sequelize.FLOAT,
        allowNull: true,
      },
      endTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      sellerId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: { model: "users", key: "id" },
        onDelete: "CASCADE",
      },
      categoryId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "categories", key: "id" },
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("auction_items");
  },
};
