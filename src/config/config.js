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
    // 1. We manually check for the URLs and assign them directly to the 'url' property
    url: process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL,
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 60000
    }
  }
};