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

    // buy : 0, sell : 1
    Order : async function(userId, stock_code, quantity, buysell, price, cb) {
        var order = {userId, stock_code, quantity, quantity, price};
        await orderModel.getOrder(stock_code, quantity, buysell, price, async (matched) => {
            for(let i = 0; i < matched.length; i++) {
                if(order.quantity == 0) break;
                await orderModel.compareOrder(matched[i], order, (remain) => {
                    order.quantity = remain;
                    console.log(`idx : ${i}\t remain : ${order.quantity}`);
                });
            }
            if(order.quantity > 0) {
                await orderModel.insertOrder(userId, stock_code, order.quantity, buysell, order.price);
            }
            cb();
        });
    },

    GetOrderList : function() {
        
    },
}