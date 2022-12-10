const db = require("../config/DB");

module.exports = {
    getHolding : function(user_id, cb) {
        var sql = "select H.*, S.stock_name, P.price from holding H, stocks S, today_prices P where user_id = ? and H.stock_code = S.stock_code AND H.stock_code = P.stock_code;";

        db.query(sql, user_id, (err, rows, fields) => {
            if(err) throw err;
            cb(rows);
        });
    }
}