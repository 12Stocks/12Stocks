const db = require('../config/DB');

module.exports = {
    // 로그인이 되어있는 경우에만 허용할 때 사용
    isOwner: function (req, res) {
        if (req.user) {
            return true;
        }
        else {
            return false;
        }
    },

    isAdmin: function(req, res, cb) {
        // TODO 
    }
}