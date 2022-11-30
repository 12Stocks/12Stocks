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
})


router.post('/search/open_order', function (req, res) {
    var trader_id = req.body.trader_id;
    var stock_code = req.body.stock_code;
    var quantity = req.body.quantity;
    var buysell = req.body.buysell;
    var price = req.body.price;
    var sql = "SELECT * FROM offers WHERE trader_id =? AND stock_code = ? AND quantity = ? " +
              "AND buysell = ? AND price = ?;"
    db.query(sql, [trader_id, stock_code, quantity, buysell, price], function(err, result) {
        if (err) throw err;

        if (result.length == 0) res.send({result: undefined});
        else {
            console.log("미체결 주문 선택 성공");
            console.log(result[0]);
            res.send({ result : result[0] })
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
                    res.redirect('/order/found/' + results_by_name[0].stock_code);
                }
            })
        } else { // 코드로 찾음
            console.log("코드로 찾음");
            res.redirect('/order/found/' + results_by_code[0].stock_code);
        }
    });
});

router.get('/found/:item_code', function (req, res) {
    res.send({ result: req.params.item_code });
});

router.get('/:item_code', function (req, res) {
    crawling.ItemPrice(req, res, function () {
        
        var tickSize = orderController.GetTickSize(req.itemInfo.now);
        var datas = { 
                itemInfo: req.itemInfo, 
                tickSize: tickSize,
            };
        
        orderController.GetOpenOrderList(req.user.user_id, function (openOrderList) {
            datas.openOrderList = openOrderList;

            // TODO : refactor all the other codes like this
            if (auth.isOwner(req, res)) {
                datas.userId = req.user.user_id;
                res.render('order', datas);
            }
            else {
                res.redirect('/auth/loginRequired');
            }
        });
    });
});

// buy : 0
router.post('/:item_code/buy_process', function (req, res) {
    var post = req.body;
    var buy_quantity = post.bq;
    var buy_price = post.bp;
    orderController.Order(req.user.user_id, req.params.item_code, buy_quantity, 0, buy_price, function (openOrderList) {
        res.send({ msg: '매수 주문 성공'});
    });
});

// sell : 1
router.post('/:item_code/sell_process', function (req, res) {
    var post = req.body;
    var sell_quantity = post.sq;
    var sell_price = post.sp;
    orderController.Order(req.user.user_id, req.params.item_code, sell_quantity, 1, sell_price, function (openOrderList) {
        res.send({ msg: '매도 주문 성공'});
    });
});

router.get('/:item_code/open_orderlist', function(req, res) {
    orderController.GetOpenOrderList(req.user.user_id, function (openOrderList) {
        res.send({ msg: '미체결 내역 조회', openOrderList: openOrderList })
    });
});

module.exports = router;