const db = require('../config/DB');

module.exports = {
    FindInWatchList: function (id, stock_code, watchlist_id, cb) {
        let sql = "SELECT * FROM watchlists WHERE user_id = ? AND watchlist_id = ? AND stock_code = ?";
        db.query(sql, [id, watchlist_id, stock_code], function (err, results) {
            if (err) throw err;
            console.log(results.length);
            if (results.length > 0) {
                console.log('내 관심목록에 있음');
                cb(true);
            } else {
                console.log('내 관심목록에 없음');
                cb(false);
            }
        })
    },
    AddToWatchList: function (id, stock_code, watchlist_id, cb) {
        let sql = "INSERT INTO watchlists (watchlist_id, user_id, stock_code) VALUES (?, ?, ?);";
        db.query(sql, [watchlist_id, id, stock_code], function (err) {
            if (err) throw err;
            console.log('내 관심목록에 추가되었습니다.');
            cb();
        });
    },
    FindAllWatchList: function(id, watchlist_id, cb) {
        let sql = "SELECT * FROM watchlists WHERE user_id = ? AND watchlist_id = ?";
        db.query(sql, [id, watchlist_id], function (err, watchlist) {
            if (err) throw err;
            console.log("관심목록 조회");
            console.log(watchlist);
            cb(watchlist);
        })
    },
    DeleteFromWatchList: function (id, stock_code, watchlist_id, cb) {
        let sql = "DELETE FROM watchlists WHERE user_id = ? AND stock_code = ? AND watchlist_id = ?";
        db.query(sql, [id, stock_code, watchlist_id], function (err) {
            if (err) throw err;
            console.log(`stock_code: ${stock_code}가 성공적으로 관심목록에서 제거됨`);
            cb();
        })
    }
}