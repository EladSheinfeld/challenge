'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      from: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      recipients: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(() => queryInterface.addIndex('Messages',{
      name: 'MESSAGES_HASH',
      method: 'BTREE',
      fields: ['hash', {attribute: 'createdAt', collate: 'en_US', order: 'DESC', length: 5}]
    }));
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Messages').then(() => queryInterface.removeIndex('Messages', 'MESSAGES_RECIPIENTS'));
  }
};
