var express = require('express')
var router = express.Router();
var auth = require('../lib/auth');

router.get('/', function (req, res) {
    if (auth.isOwner(req, res)) {
        res.render('portfolios', { userId: req.user.user_id });
    }
    else {
        res.render('portfolios');
    }
});

module.exports = router;