const db = require("../config/DB");

module.exports = {
    getHolding : function(user_id, cb) {
        var sql = "select H.*, S.stock_name from holding H, stocks S where user_id = ? and H.stock_code = S.stock_code;";

        db.query(sql, user_id, (err, rows, fields) => {
            if(err) throw err;
            cb(rows);
        });
    }
}