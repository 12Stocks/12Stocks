var express = require('express');
var router = express.Router();
var auth = require('../lib/auth');
const db = require('../config/DB');

router.get('/:item_code', function(req, res) {
    var code = req.params.item_code;
    var itemInfo = {
        STK : code,
    };
    var gsql = "SELECT stock_name FROM stocks WHERE stock_code = ?;";
    db.query(gsql, code, (err, row, fields) => {
        itemInfo.NAME = row[0].stock_name;
    })

    var sql = "SELECT * FROM offers where stock_code = ? AND trader_id = ?;";
    db.query(sql, [code, req.user.user_id], (err, rows, fields) => {
        if(err) throw err;
        res.render('orderlist', {list : rows, itemInfo : itemInfo});
    })
});

module.exports = router;