var express = require('express')
var router = express.Router();

router.get('/login', function (req, res) {
    // var fmsg = req.flash();
    // var feedback = '';
    // if(fmsg.error) {
    //     feedback = fmsg.error[0];
    // }

    let fmsg = req.flash()
    let msg = ''

    if (fmsg.message) {
        msg = fmsg.message
    }

    console.log(req.user);
    res.render('auth', { feedback: msg });
});

router.get('/logout', function (request, response) {
    // session이 삭제 된다. cb : session에 대한 삭제가 끝난 다음 호출
    request.logout(function (err) {
        if (err) {
            return next(err);
        }
        response.redirect("/");
    });
});

module.exports = router;