const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Collection = sequelize.define('Collection', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Collection;