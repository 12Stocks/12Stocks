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
        var q = quantity;
        var datas = {userId, stock_code, quantity, buysell, price};
        await orderModel.getOrder(stock_code, quantity, buysell, price, async (matched) => {
            matched.forEach(async (elm, i) => {
                await orderModel.compareOrder(elm, datas, () => {
                    console.log(`idx : ${i}`);
                });
            });
            cb();
        //     for(let i = 0; i < matched.length; i++) {
                // if(buysell == 0) {
                //     datas = [matched[i].trader_id, userId, stock_code, q, price];
                // }
                // else {
                //     datas = [userId, matched[i].trader_id, stock_code, q, price];
                // }
        //         console.log(`idx : ${i} remain : ${q}`);

        //         if(matched[i].quantity > q) {
        //             await orderModel.updateOrder(matched[i].offer_id, q, async (result) => {
        //                 await orderModel.conclusion(datas);
        //                 console.log(`offer_id ${result.offer_id} updated ${matched[i].quantity} => ${matched[i].quantity - q} by conclusion !`);
        //                 q = 0;
        //             });
        //             break;
        //         }
        //         else if(matched[i].quantity == q) {
        //             await orderModel.deleteOrder(matched[i].offer_id, async (result) => {
        //                 await orderModel.conclusion(datas);
        //                 console.log(`offer_id ${matched[i].offer_id} deleted by conclusion !`);
        //                 q = 0;
        //             });
        //             break;
        //         }
        //         else {
        //             await orderModel.deleteOrder(matched[i].offer_id, async (result) => {
        //                 await orderModel.conclusion(datas);
        //                 console.log(`offer_id ${matched[i].offer_id} deleted by conclusion !`);
        //                 q -= matched[i].quantity;
        //             });
        //         }
        //     }
        // }).then(() => {
        //     if(q > 0) {
        //         orderModel.insertOrder(userId, stock_code, q, buysell, price);
        //         console.log(`주문자 : ${userId},\n종목 : ${stock_code},\n가격 : ${price},\n수량 : ${q}\n${((buysell == 0) ? "구매" : "판매")} 주문 완료 !`);
        //     }
        //     cb();
        });
    },

    GetOrderList : function() {
        
    },

    Conclusion : function() {
        
    }
}