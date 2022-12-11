var mysql = require("mysql");
const db = require('../config/DB');
const orderModel = require('../models/orderModel');

module.exports = {
    GetTickSize : function getTickSize(price) {
        var p = parseInt(price.replace(/,/g, ''));
        if (p.length < 4) return 1;
        if (1000 <= p && p < 5000) return 5;
        if (5000 <= p && p < 10000) return 10;
        if (10000 <= p && p < 50000) return 50;
        if (50000 <= p && p < 100000) return 100;
        if (100000 <= p && p < 500000) return 500;
        if (500000 <= p) return 1000;
    },

    marketOrder : async function(userId, stock_code, quantity, buysell, price, cb) {
        var order = {userId, stock_code, quantity, buysell, price};
        let matched = await orderModel.getMarketOrder(stock_code, quantity, buysell, price);
        var remain;

        for(let i = 0; i < matched.length; i++) {
            await orderModel.compareOrder(matched[i], order)
            .then((conc) => {
                order.quantity -= conc;
            });
            console.log(`idx : ${i}, remain : ${order.quantity}`);
            if(order.quantity == 0) break;
        }

        if(order.quantity > 0) {
            console.log(`채결 후 잔량 : ${order.quantity}\n자동취소`);
        }
        cb();
    },

    // buy : 0, sell : 1
    limitOrder : async function(userId, stock_code, quantity, buysell, price, cb) {
        var order = {userId, stock_code, quantity, buysell, price};
        let matched = await orderModel.getLimitOrder(stock_code, quantity, buysell, price);
        var remain;

        for(let i = 0; i < matched.length; i++) {
            await orderModel.compareOrder(matched[i], order)
            .then((conc) => {
                order.quantity -= conc;
            });
            console.log(`idx : ${i}, remain : ${order.quantity}`);
            if(order.quantity == 0) break;
        }
        
        if(order.quantity > 0) {
            console.log(`채결 후 잔량 : ${order.quantity}`);
            orderModel.insertOrder(userId, stock_code, order.quantity, buysell, price);
        }
        cb();
    },

    GetOpenOrderList: function (userId, cb) {
        orderModel.getOrderByUid(userId, (rows) => {
            cb(rows);
        })
    },

    getConclusionList: function(userId, cb) {
        orderModel.getConclusionList(userId, (conclusionList) => {
            cb(conclusionList);
        })
    },

    FindOpenOrder: function (trader_id, stock_code, quantity, buysell, price, cb) {
        var sql = "SELECT * FROM offers WHERE trader_id =? AND stock_code = ? AND quantity = ? " +
            "AND buysell = ? AND price = ?;"
        db.query(sql, [trader_id, stock_code, quantity, buysell, price], function (err, result) {
            if (err) throw err;
            cb(result);
        });
    },

    updateOrder : function (offer_id, quantity, price, cb) {
        orderModel.updateOrder(offer_id, quantity, price);
        orderModel.getOrderByOid(offer_id, (row) => {
            cb(row[0]);
        })
    },

    cancelOrder : function (offer_id, cb) {
        orderModel.deleteOrder(offer_id);
        cb();
    },

    getPriceList : function (code, cb) {
        orderModel.getPriceList(code, (bl, sl) => {
            cb(bl, sl);
        })
    }
}