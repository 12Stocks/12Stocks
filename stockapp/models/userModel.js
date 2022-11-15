var db = require("../config/DB");

exports.findAll = (cb) => {
    db.query("Select * from Users", (err, users, fields) => {
        if(err) throw err;
        cb(users);
    });
}

exports.findById = (id, cb) => {
    db.query("Select user_name, user_age, user_email, date_format(user_regdate, '%Y.%m.%d') reg_date from Users where user_id = ?", id, (err, user) => {
        if(err) throw err;
        cb(user);
    });
}