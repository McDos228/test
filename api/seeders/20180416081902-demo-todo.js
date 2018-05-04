'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('todos', [{
        title: 'New test task',
        status: false,
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE
      }], {});
  },

  down: (queryInterface, Sequelize) => {
     return queryInterface.bulkDelete('todos', null, {});
  }
};
