'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('auction_items', 'deletedAt', {
      type: Sequelize.DATE,
      allowNull: true, // ✅ Soft delete ke liye allowNull true hona chahiye
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('auction_items', 'deletedAt');
  }
};