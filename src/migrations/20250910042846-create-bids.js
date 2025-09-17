"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bids", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      auctionItemId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "auction_items", key: "id" },
        onDelete: "CASCADE",
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: { model: "users", key: "id" },
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
    await queryInterface.dropTable("bids");
  },
};
