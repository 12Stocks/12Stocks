var mysql = require("mysql");
const db = require('../config/DB');

module.exports = {
    GetTickSize : function getTickSize(price) {
        var p = parseInt(price.replace(/,/g, ''));
        if (p.length < 4) return 1;
        if (1000 <= p && p < 5000) return 5;
        if (5000 <= p && p < 10000) return 10;
        if (10000 <= p && p < 50000) return 50;
        if (50000 <= p && p < 100000) return 100;
        if (100000 <= p && p < 500000) return 500;
        if (500000 <= p) return 1000;
    },

    // buy : 0, sell : 1
    Order : function(userId, stock_code, quantity, buysell, price, cb) {
        var sql = "INSERT INTO offers (trader_id, stock_code, quantity, buysell, price, DT)"
            + " VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP);";

        db.query(sql, [userId, stock_code, quantity, buysell, price], function (err) {
            if (err) throw err;
            console.log("주문 완료");
            cb(); 
        });
    },

    GetOpenOrderList: function (userId, cb) {
        var sql = "SELECT * FROM offers WHERE trader_id = ?;";
        db.query(sql, [userId], function (err, results) {
            if (err) throw err;
            console.log("미체결 내역 조회");
            cb(results);
        });
    }
}