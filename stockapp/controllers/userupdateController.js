const db = require('../config/DB');
var auth = require('../lib/auth');

exports.view = (req, res) => {
    // User the connection
    db.query('SELECT * FROM users ', (err, rows) => {
        // When done with the connection, release it
        if (!err) {
            let removedUser = req.query.removed;
            res.render('user_edit', { rows, removedUser });
        } else {
            console.log(err);
        }
        console.log('The data from user table: \n', rows);
    });
}

// Find User by Search
exports.find = (req, res) => {
    let searchTerm = req.body.search;
    // User the connection
    db.query("Select user_name, user_age, user_email, date_format(reg_date, '%Y.%m.%d') reg_date from users where user_id = ?", ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, rows) => {
        if (!err) {
            res.render('index', { rows });
        } else {
            console.log(err);
        }
        console.log('The data from user table: \n', rows);
    });
}
exports.form = (req, res) => {
    res.render('user_edit');
}

exports.edit = (req, res) => {
    // User the connection
    db.query('SELECT * FROM users WHERE user_id = ?', [req.params.user_id], (err, rows) => {
        if (!err) {
            res.render('user_edit', { rows, alert: "" });
        } else {
            console.log(err);
        }
        console.log('The data from user table: \n', rows);
    });
}


// Update User
exports.update = (req, res) => {
    const { user_name, user_email, user_pw, } = req.body;
    // User the connection
    db.query('UPDATE users SET user_name = ?, user_email = ?, user_pw = ? WHERE user_id = ?', [user_name, user_email, user_pw, req.params.user_id], (err, rows) => {

        if (!err) {
            // User the connection
            db.query('SELECT * FROM users WHERE user_id = ?', [req.params.user_id], (err, rows) => {
                if (!err) {
                    res.render('user_edit', { rows, alert: "has been updated successfully." });
                } else {
                    console.log(err);
                }
                console.log('The data from user table: \n', rows);
            });

        } else {
            console.log(err);
        }
        console.log('The data from user table: \n', rows);
    });
};

// View Users
exports.viewall = (req, res) => {

    // User the connection
    connection.query('SELECT * FROM users WHERE user_id = ?', [req.params.id], (err, rows) => {
        if (!err) {
            res.render('user_edit', { rows });
        } else {
            console.log(err);
        }
        console.log('The data from user table: \n', rows);
    });

}