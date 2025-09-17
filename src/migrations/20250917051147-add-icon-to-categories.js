'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('categories', 'icon', {
      type: Sequelize.STRING(50),
      allowNull: true, 
      defaultValue: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('categories', 'icon');
  }
};
