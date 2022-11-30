var mysql = require("mysql");
require("dotenv").config();

var connection = mysql.createConnection({
    connectionLimit: 10,
    host: process.env.DB_HOST || '119.207.177.29',
    user: process.env.DB_USER || 'team12',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB || 'stockapp',
    port: process.env.DB_PORT || '3306',
});

connection.connect((err) => {
    console.log("try connect to DB...");
    if (err) throw err;
    else console.log("complete !");
});

module.exports = connection;