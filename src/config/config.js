module.exports = {
  development: {
    username: "root",
    password: "@Xprofess0r123",
    database: "flight_search_db",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  test: {
    username: "root",
    password: "@Xprofess0r123",
    database: "flight_search_db_test",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: process.env.MYSQLUSER,
    password: process.env.MYSQLPASSWORD,
    database: process.env.MYSQLDATABASE,
    host: process.env.MYSQLHOST,
    port: parseInt(process.env.MYSQLPORT) || 3306,
    dialect: "mysql"
  }
};