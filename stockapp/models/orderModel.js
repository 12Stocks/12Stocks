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
            cb();
        })
    },

    deleteOrder : async function(offer_id, cb) {
        var sql = 'DELETE FROM offers WHERE offer_id = ?;';
        db.query(sql, offer_id, (err, rows, fields) => {
            if(err) throw err;
            console.log(`offer ${offer_id} deleted by conclusion !`)
            cb();
        })
    },

    conclusion : async function(seller, buyer, stock_code, quantity, unit_price, cb) {
        var sql = 'INSERT INTO trades(seller_id, buyer_id, stock_code, quantity, unit_price) VALUES(?, ?, ?, ?, ?);';
        db.query(sql, [seller, buyer, stock_code, quantity, unit_price], (err, rows, fields) => {
            if(err) throw err;
            console.log(`${stock_code} ${quantity}개 채결완료!`);
            cb();
        })
    },

    insertOrder : async function(userId, stock_code, quantity, buysell, price) {
        var sql = 'INSERT INTO offers(trader_id, stock_code, quantity, buysell, price) VALUES(?, ?, ?, ?, ?);';
        db.query(sql, [userId, stock_code, quantity, buysell, price], (err, rows, fields) => {
            if(err) throw err;
            console.log(`주문 정보 :\n주문자 : ${userId},\n종목 : ${stock_code},\n수량 : ${quantity},\nBS : ${buysell},\n가격 : ${price}`);
        });
    },

    compareOrder : async function(mRow, order, cb) {
        console.log(order);
        if(mRow.buysell == 0) {
            var buyer = mRow.trader_id;
            var seller = order.userId;
        }
        else {
            var seller = mRow.trader_id;
            var buyer = order.userId;
        }

        if(mRow.quantity > order.quantity) {
            await this.updateOrder(mRow.offer_id, order.quantity, () => {
                console.log(`offer ${mRow.offer_id} updated by conclusion !\nquantity : ${mRow.quantity} => ${mRow.quantity-order.quantity}`);
                this.conclusion(seller, buyer, order.stock_code, order.quantity, order.price, () => {
                    cb(0);
                });
            })
        }
        else if(mRow.quantity == order.quantity) {
            await this.deleteOrder(mRow.offer_id, () => {
                this.conclusion(seller, buyer, order.stock_code, order.quantity, order.price, () => {
                    cb(0);
                });
            })
        }
        else {
            console.log(mRow);
            await this.deleteOrder(mRow.offer_id, () => {
                this.conclusion(seller, buyer, order.stock_code, mRow.quantity, order.price, () => {
                    cb(order.quantity - mRow.quantity);
                });
            })
        }
    },
}