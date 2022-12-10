var express = require('express');
var router = express.Router();
var auth = require('../lib/auth');
var holdingController = require("../controllers/holdingController");
var cookie = require('cookie');

router.get('/', function(req, res) {
    if (auth.isOwner(req, res)) {
        holdingController.getHolding(req.user.user_id, (rows) => {
            res.render('holding', {userId : req.user.user_id, holdings : rows});
        });
    }
    else {
        res.redirect('/auth/loginRequired');
    }
});

module.exports = router;