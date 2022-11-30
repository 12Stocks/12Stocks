var db = require("../config/DB");

module.exports = {
    getOrder : async function(stock_code, quantity, buysell, price, cb) {
        return new Promise(resolve => {
            var sql = "SELECT * FROM offers WHERE buysell = ? AND stock_code = ? AND price = ? ORDER BY quantity DESC, DT ASC;";
            db.query(sql, [!buysell, stock_code, price ], (err, rows, fields) => {
                if(err) throw err;
                console.log(`find ${rows.length} rows !`);
                resolve(rows);
            })
        });
    },

    updateOrder : async function(offer_id, quantity) {
        var sql = 'UPDATE offers SET quantity = quantity - ? WHERE offer_id = ?;';
        db.query(sql, [quantity, offer_id], (err, rows, fields) => {
            if(err) throw err;
        })
    },

    deleteOrder : async function(offer_id) {
        var sql = 'DELETE FROM offers WHERE offer_id = ?;';
        db.query(sql, offer_id, (err, rows, fields) => {
            if(err) throw err;
            console.log(`offer ${offer_id} deleted by conclusion !`)
        })
    },

    conclusion : function(seller, buyer, stock_code, quantity, unit_price) {
        return new Promise(resolve => {
            var sql = 'INSERT INTO trades(seller_id, buyer_id, stock_code, quantity, unit_price) VALUES(?, ?, ?, ?, ?);';
            db.query(sql, [seller, buyer, stock_code, quantity, unit_price], (err, rows, fields) => {
                if(err) throw err;
                console.log(`${stock_code} ${quantity}개 채결완료!`);
                resolve(quantity);
            })
        });
    },

    insertOrder : async function(userId, stock_code, quantity, buysell, price) {
        var sql = 'INSERT INTO offers(trader_id, stock_code, quantity, buysell, price) VALUES(?, ?, ?, ?, ?);';
        db.query(sql, [userId, stock_code, quantity, buysell, price], (err, rows, fields) => {
            if(err) throw err;
            console.log(`[주문 정보]\n주문자 : ${userId},\n종목 : ${stock_code},\n수량 : ${quantity},\nBS : ${buysell},\n가격 : ${price}`);
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
                console.log(`update ${mRow.quantity} => ${mRow.quantity - order.quantity}\nconclusion ${order.quantity} !`);
                this.updateOrder(mRow.offer_id, order.quantity);
                let conc = this.conclusion(seller, buyer, order.stock_code, order.quantity, order.price);
                resolve(await conc);
            } else {
                console.log(`delete ${mRow.offer_id} conclusion ${mRow.quantity}`);
                this.deleteOrder(mRow.offer_id);
                let conc = this.conclusion(seller, buyer, order.stock_code, mRow.quantity, order.price)
                resolve(await conc);
            }
        })
    },
}