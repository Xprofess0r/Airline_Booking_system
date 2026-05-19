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
    // If MYSQL_PUBLIC_URL exists, use it. Otherwise fall back to the internal MYSQL_URL
    use_env_variable: process.env.MYSQL_PUBLIC_URL ? "MYSQL_PUBLIC_URL" : "MYSQL_URL",
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 60000 // Gives the container 60 seconds to establish a stable connection
    }
  }
};