"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // reservePrice add karna
    await queryInterface.addColumn("auction_items", "reservePrice", {
      type: Sequelize.FLOAT,
      allowNull: true,
    });

    // status add karna
    await queryInterface.addColumn("auction_items", "status", {
      type: Sequelize.ENUM("ACTIVE", "ENDED", "CANCELLED"),
      allowNull: false,
      defaultValue: "ACTIVE",
    });

    // startTime add karna
    await queryInterface.addColumn("auction_items", "startTime", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("NOW()"),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("auction_items", "reservePrice");
    await queryInterface.removeColumn("auction_items", "status");
    await queryInterface.removeColumn("auction_items", "startTime");
  },
};
