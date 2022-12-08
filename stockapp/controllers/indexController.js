const db = require('../config/DB');
const mysql = require('mysql');
const constants = require('../lib/constants');

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

            if(rItems.length == 1) {
                console.log(rItems[0].stock_code);
                results.push({ stock_code: rItems[0].stock_code, stock_name: rItems[0].stock_name })
            }
            else if (rItems.length > 1) {
                for(var data of rItems) {
                    results.push({ stock_code: data[0].stock_code, stock_name: data[0].stock_name })
                }
            }
            cb(results);
        })
    },

    GetTrendingPosts : function(cb) {
        var sql = "SELECT dayhit.board_id, dayhit.post_id, posts.post_title FROM dayhit INNER JOIN posts " +
                  "ON dayhit.board_id = posts.board_id AND dayhit.post_id = posts.post_id " +
                  "WHERE hit_date = CURDATE() ORDER BY total_hit DESC LIMIT ?;";
        db.query(sql, [constants.MAX_TRENDING_POSTS], function(err, result) {
            if (err) throw err;
            console.log("인기 게시글 로딩 성공");
            console.log(result);
            cb(result);
        })
    }
}
