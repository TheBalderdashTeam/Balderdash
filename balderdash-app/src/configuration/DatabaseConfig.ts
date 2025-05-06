require('dotenv').config()

const config = {
    development: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        host: process.env.HOST,
        port: 3306,
        dialect: 'postgres',
        logging: false,
    },
    production: {
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        host: process.env.HOST,
        port: 3306,
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
            connectionTimeoutMillis: 5000,
            idleTimeoutMillis: 30000,
            requestTimeoutMillis: 15000,
        },
    },
}
module.exports = config
