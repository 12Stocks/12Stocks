var db = require("../config/DB");

module.exports = {
    getConclusionList : function(user_id, cb) {
        var sql = "SELECT * FROM trades WHERE seller_id = ? OR buyer_id = ?;";
        db.query(sql, [user_id, user_id], (err, rows, fields) => {
            if(err) throw err;
            cb(rows);
        });
    },

    getOrderByOid : function(offer_id, cb) {
        var sql = "SELECT * FROM offers WHERE offer_id = ?;";
        db.query(sql, offer_id, (err, row, fields) => {
            if(err) throw err;
            cb(row);
        })
    },

    getOrderByUid : function(user_id, cb) {
        var sql = "SELECT * FROM offers WHERE trader_id = ?;";
        db.query(sql, user_id, (err, rows, fields) => {
            if(err) throw err;
            cb(rows);
        })
    },

    getLimitOrder : async function(stock_code, quantity, buysell, price) {
        return new Promise(resolve => {
            var sql = "SELECT * FROM offers WHERE buysell = ? AND stock_code = ? AND price = ? ORDER BY DT ASC, quantity DESC;";
            db.query(sql, [!buysell, stock_code, price ], (err, rows, fields) => {
                if(err) throw err;
                console.log(`find ${rows.length} rows !`);
                resolve(rows);
            })
        });
    },

    getMarketOrder : async function(stock_code, quantity, buysell, price) {
        return new Promise(resolve => {
            if(!buysell == 0) {
                var sort = "DESC";
                var cmp = "<=";
            } else {
                var sort = "ASC";
                var cmp = ">=";
            }
            // console.log(`[시장가 주문]\n종목 : ${stock_code}\n수량 : ${quantity}\n현재가 : ${price}\nBS : ${buysell}`);
            var sql = `SELECT * FROM offers WHERE buysell = ? AND stock_code = ? AND price ${cmp} ? ORDER BY price ${sort}, DT ASC, quantity DESC;`;
            db.query(sql, [!buysell, stock_code, price], (err, rows, fields) => {
                if(err) throw err;
                // console.log(`find ${rows.length} rows !`);
                resolve(rows);
            });
        });
    },

    updateOrder : async function(offer_id, quantity, price) {
        var sql = 'UPDATE offers SET quantity = ?, price = ? WHERE offer_id = ?;';
        db.query(sql, [quantity, price, offer_id], (err, rows, fields) => {
            if(err) throw err;
        })
    },

    deleteOrder : async function(offer_id) {
        var sql = 'DELETE FROM offers WHERE offer_id = ?;';
        db.query(sql, offer_id, (err, rows, fields) => {
            if(err) throw err;
            // console.log(`offer ${offer_id} deleted by conclusion !`)
        })
    },

    conclusion : function(seller, buyer, stock_code, quantity, unit_price) {
        return new Promise(resolve => {
            var sql = 'INSERT INTO trades(seller_id, buyer_id, stock_code, quantity, unit_price) VALUES(?, ?, ?, ?, ?);';
            db.query(sql, [seller, buyer, stock_code, quantity, unit_price], (err, rows, fields) => {
                if(err) throw err;
                // console.log(`${stock_code} ${quantity}개 채결완료!`);
                resolve(quantity);
            })
        });
    },

    insertOrder : async function(userId, stock_code, quantity, buysell, price) {
        var sql = 'INSERT INTO offers(trader_id, stock_code, quantity, buysell, price) VALUES(?, ?, ?, ?, ?);';
        db.query(sql, [userId, stock_code, quantity, buysell, price], (err, rows, fields) => {
            if(err) throw err;
            // console.log(`[주문 정보]\n주문자 : ${userId},\n종목 : ${stock_code},\n수량 : ${quantity},\nBS : ${buysell},\n가격 : ${price}`);
        });
    },

    compareOrder : async function(mRow, order, cb) {
        return new Promise(async resolve => {
            if(order.buysell == 0) {
                var buyer = order.userId;
                var seller = mRow.trader_id;
            }
            else {
                var seller = order.userId;
                var buyer = mRow.trader_id;
            }

            if(mRow.quantity > order.quantity) {
                // console.log(`update ${mRow.quantity} => ${mRow.quantity - order.quantity}\nconclusion ${order.quantity} !`);
                this.updateOrder(mRow.offer_id, mRow.quantity - order.quantity, order.price);
                let conc = this.conclusion(seller, buyer, order.stock_code, order.quantity, mRow.price);
                resolve(await conc);
            } else {
                // console.log(`delete ${mRow.offer_id} conclusion ${mRow.quantity}`);
                this.deleteOrder(mRow.offer_id);
                let conc = this.conclusion(seller, buyer, order.stock_code, mRow.quantity, mRow.price)
                resolve(await conc);
            }
        })
    },

    getPriceList : async function(code, cb) {
        var buyList = [];
        var sellList = [];
        var sql = "select stock_code, sum(quantity) quantity, buysell, price from offers where stock_code = ? and buysell = 0 group by stock_code, price order by stock_code, price DESC;";
        var sql2 = "select stock_code, sum(quantity) quantity, buysell, price from offers where stock_code = ? and buysell = 1 group by stock_code, price order by stock_code, price DESC;";
        db.query(sql, code, (err, rows, fields) => {
            if (err) throw err;
            buyList = rows;
        })
        db.query(sql2, code, (err, rows, fields) => {
            if(err) throw err;
            sellList = rows;
            cb(buyList, sellList);
        })
    },
}