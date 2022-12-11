const db = require("../config/DB");

module.exports = {
    getHolding : function(user_id, cb) {
        var sql = "select H.*, T.STK_NAME, T.NOW from holding H, today_prices T where H.user_id = ? and H.stock_code = T.stock_code;";

        db.query(sql, user_id, (err, rows, fields) => {
            if(err) throw err;
            cb(rows);
        });
    }
}