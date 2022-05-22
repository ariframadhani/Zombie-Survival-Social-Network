const {Sequelize} = require('sequelize');
const Env = require('../../config/Env.json');
const path = require('path');

let sequelize;

exports.initSequelize = () => {
    const mysqlConfig = Env.mysql ? Env.mysql : null;
    if (!mysqlConfig || !mysqlConfig.host) {
        console.warn('No MySQL Configured')
        return;
    }
    const options = {
        database: mysqlConfig.database,
        define: {
            freezeTableName: true
        },
        dialect: 'mysql',
        host: mysqlConfig.host ? mysqlConfig.host : '127.0.0.1',
        port: mysqlConfig.port ? mysqlConfig.port : '3306',
        username: mysqlConfig.username,
        password: mysqlConfig.password,
        models: null,
        timezone: '+07:00',
        logging: false
    };
    sequelize = new Sequelize(options);
}

exports.sequelizeInstance = () => {
    return sequelize;
}
exports.rawQuery = (query, options) => {
    return sequelize.query(query, options);
}
