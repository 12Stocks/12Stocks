const db = require('../config/DB');
const mysql = require('mysql');

module.exports = { 
    GetRecentItems : function(recentItemArr, cb) {
        var sql = "";
        for (var i = 0; i < recentItemArr.length; i++) {
            var sub_sql = "SELECT stock_code, stock_name from stocks WHERE stock_code = ?; ";
            sql += mysql.format(sub_sql, recentItemArr[i]);
        }

        db.query(sql, function(err, rItems) {
            if (err) throw err;
            var results = [];

            for(var data of rItems) {
                console.log(data[0].stock_code);
                results.push({stock_code : data[0].stock_code, stock_name : data[0].stock_name})
            }

            cb(results);
        })
    },

    GetTrendingPosts : function() {
        var sql = "SELECT * FROM dayhit "
    }
}
