var express = require('express');
var router = express.Router();
var auth = require('../lib/auth');
var crawling = require('../crawling/crawling');
var orderController = require("../controllers/orderController");
const db = require('../config/DB');

router.get('/search/auto_complete', function(req, res) {
    var sql = "SELECT stock_code, stock_name from stocks;";
    db.query(sql,  function (err, result) {
        if (err) throw err;
        var resultArr = [];
        for(var i =0; i < result.length; i++) {
            resultArr.push({ label: result[i].stock_code + ' [' + result[i].stock_name + '] ', value: result[i].stock_name });
            resultArr.push({ label: result[i].stock_name, value: result[i].stock_name });
        }
        res.send(resultArr);
    });
});

router.post('/search/open_order', function (req, res) {
    var trader_id = req.body.trader_id;
    var stock_code = req.body.stock_code;
    var quantity = req.body.quantity;
    var buysell = req.body.buysell;
    var price = req.body.price;

    orderController.FindOpenOrder(trader_id, stock_code, quantity, buysell, price, function(result) {
        if (result.length == 0) res.send({ result: undefined });
        else {
            console.log("미체결 주문 선택 성공");
            console.log(result[0]);
            res.send({ result: result[0] })
        }
    })
});

router.post('/search/:search_input', function (req, res) {
    var search_by_code = "SELECT stock_code, stock_name from stocks WHERE stock_code = ?";
    db.query(search_by_code, [req.params.search_input], function (err, results_by_code) {
        if (err) throw err;

        if (results_by_code.length == 0) {
            var search_by_name = "SELECT stock_code, stock_name from stocks WHERE stock_name = ?";
            db.query(search_by_name, [req.params.search_input], function(err, results_by_name) {
                if (err) throw err;

                if (results_by_name.length == 0) { // 결과 없음
                    console.log("검색 결과 없음");
                    res.send({ result: undefined })

                } else { // 이름으로 찾음
                    console.log("이름으로 찾음");
                    res.send({ result: results_by_name[0].stock_code });
                }
            })
        } else { // 코드로 찾음
            console.log("코드로 찾음");
            res.send({ result: results_by_code[0].stock_code });
        }
    });
});

router.get('/:item_code', function (req, res) {
    crawling.ItemPrice(req, res, function () {
        
        var tickSize = orderController.GetTickSize(req.itemInfo.now);
        var datas = { 
            itemInfo: req.itemInfo, 
            tickSize: tickSize,
        };
        
        if(auth.isOwner(req, res)) {
            orderController.GetOpenOrderList(req.user.user_id, function (openOrderList) {
                datas.openOrderList = openOrderList;
                datas.userId = req.user.user_id;
            });
            orderController.getConclusionList(req.user.user_id, function(conclusionList) {
                datas.conclusionList = conclusionList;
                res.render('order', datas);
            });
        }
    });
});

// buy : 0
router.post('/:item_code/buy_process', function (req, res) {
    var post = req.body;
    var buy_quantity = post.q;
    var buy_price = post.p;
    var option = post.type;
    if(option == "marOd") {
        orderController.marketOrder(req.user.user_id, req.params.item_code, buy_quantity, 0, buy_price, function (openOrderList) {
            res.send({ msg : "매수 주문 성공"});
        });
    } else {
        orderController.limitOrder(req.user.user_id, req.params.item_code, buy_quantity, 0, buy_price, function (openOrderList) {
            res.send({ msg: '매수 주문 성공'});
        });
    }
});

// sell : 1
router.post('/:item_code/sell_process', function (req, res) {
    try {
        var post = req.body;
        var sell_quantity = post.q;
        var sell_price = post.p;
        var option = post.type;

        if(option == "marOd") {
            orderController.marketOrder(req.user.user_id, req.params.item_code, sell_quantity, 1, sell_price, function (openOrderList) {
                res.send({ msg : "매도 주문 성공"});
            });
        } else {
            orderController.limitOrder(req.user.user_id, req.params.item_code, sell_quantity, 1, sell_price, function (openOrderList) {
                res.send({ msg: '매도 주문 성공'});
            });
        }
    } catch(err) {
        console.error(err);
    }
});

router.post('/:item_code/update_order', function (req, res) {
    try {
        var post = req.body;
        var q = post.q;
        var p = post.p;
        var offer_id = post.offer_id;

        orderController.updateOrder(offer_id, q, p, (result) => {
            res.send({msg : "정정 완료 !"});
        });
    } catch (err) {
        console.error(err);
    }
});

router.post('/:item_code/cancel_order', function (req, res) {
    try {
        var post = req.body;
        var id = post.offer_id;
        orderController.cancelOrder(id, () => {
            res.send({msg : "취소 완료 !"});
        });
    } catch (err) {
        console.error(err);
    }
});

router.get('/:item_code/open_orderlist', function(req, res) {
    try {
        orderController.GetOpenOrderList(req.user.user_id, function (openOrderList) {
            res.send({ msg: '미체결 내역 조회', openOrderList: openOrderList })
        });
    } catch (err) {
        console.error(err);
    }
});

router.get('/:item_code/open_conclusionList', function(req, res) {
    try {
        orderController.getConclusionList(req.user.user_id, function(conclusionList) {
            res.send({msg: '채결 내역 조회', conclusionList : conclusionList});
        });
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;