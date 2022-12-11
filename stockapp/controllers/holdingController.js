const db = require('../config/DB');
const holdingModel = require('../models/holdingModel');

module.exports = {
    getHolding : function(user_id, cb) {
        holdingModel.getHolding(user_id, (rows) => {
            cb(rows);
        });
    },
}