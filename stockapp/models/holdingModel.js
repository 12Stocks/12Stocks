const db = require("../config/DB");

module.exports = {
    getHolding : function(user_id, cb) {
        var sql = "SELECT * FROM holding WHERE user_id = ?;";

        db.query(sql, user_id, (err, rows, fields) => {
            if(err) throw err;
            cb(rows);
        });
    }
}