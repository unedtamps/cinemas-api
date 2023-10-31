require('dotenv').config()
module.exports = {
  development: {
    username: process.env.USERNAME_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE_DB,
    host: process.env.HOST_DB,
    dialect: process.env.DIALECT_DB,
    port:process.env.PORT_DB,
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.USERNAME_DB,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE_DB,
    host: process.env.HOST_DB,
    dialect: process.env.DIALECT_DB,
    port:process.env.PORT_DB,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: true,
      },
    },
  },
}
