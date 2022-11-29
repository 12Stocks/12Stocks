var db = require("../config/DB");

module.exports = {
    getOrder : async function(stock_code, quantity, buysell, price, cb) {
        var sql = "SELECT * FROM offers WHERE buysell = ? AND stock_code = ? AND price = ? ORDER BY quantity DESC, DT DESC;";
        db.query(sql, [!buysell, stock_code, price ], (err, rows, fields) => {
            if(err) throw err;
            console.log(`find ${rows.length} rows !`);
            cb(rows);
        })
    },

    updateOrder : async function(offer_id, quantity, cb) {
        var sql = 'UPDATE offers SET quantity = quantity - ? WHERE offer_id = ?;';
        db.query(sql, [quantity, offer_id], (err, rows, fields) => {
            if(err) throw err;
            cb({offer_id, quantity});
        })
    },

    deleteOrder : async function(offer_id, cb) {
        var sql = 'DELETE FROM offers WHERE offer_id = ?;';
        db.query(sql, offer_id, (err, rows, fields) => {
            if(err) throw err;
            cb(offer_id);
        })
    },

    conclusion : async function(datas) {
        var sql = 'INSERT INTO trades(seller_id, buyer_id, stock_code, quantity, unit_price) VALUES(?, ?, ?, ?, ?);';
        db.query(sql, datas, (err, rows, fields) => {
            if(err) throw err;
            console.log(`${datas[2]} ${datas[3]}개 채결완료!`);
        })
    },

    insertOrder : async function(userId, stock_code, quantity, buysell, price) {
        var sql = 'INSERT INTO offers(trader_id, stock_code, quantity, buysell, price) VALUES(?, ?, ?, ?, ?);';
        db.query(sql, [userId, stock_code, quantity, buysell, price], (err, rows, fields) => {
            if(err) throw err;
            console.log(rows);
        });
    },

    compareOrder : async function(mRow, datas, cb) {
        if(mRow.buysell == 0) {
            const buyer = mRow;
            const seller = datas;
        }
        if(mRow.quantity > datas.quantity) {
        }
        cb();
    },
}