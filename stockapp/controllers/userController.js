var userModel = require('../models/userModel');
var auth = require('../lib/auth');
var express = require("express");
const db = require('../config/DB');

exports.findAll = (req, res) => {
    userModel.findAll((users) => {
        console.log("find all users...");
        res.render('users', { users: users, userId: req.user.user_id, });
    });
}
exports.findById = (req, res) => {
    userModel.findById(req.params.user_id, (user) => {
        console.log("user : ", user);
        if (auth.isOwner(req, res)) {
            res.render('user_info', { userId: req.user.user_id, user: user[0] });
        } else {
            res.render('user_info', { user: user[0] });
        }
    });
}

exports.Allview = (req, res) => {
    userModel.findAll((users) => {
        console.log("find all users...");
        res.render('admin_panel', { users: users });
    });
}

// check user if user is admin allow  admin panel

exports.find_own = (req, res) => {
    userModel.find_own(req.params.user_id, (user) => {
        console.log("user : ", user);
        userModel.Allview((users) => {
            if (req.params.user_id === 'admin') {
                res.render('admin_panel', { userId: req.params.user_id, users: users });
            } else
            if (auth.isOwner(req, res)) {
                res.render('user_form', { userId: req.params.user_id, user: user[0] });
            } else {
                res.render('user_form', { user: user[0] });
            }
        });
    });
}


exports.edit = (req, res) => {
    // User the connection
    db.query('SELECT * FROM users WHERE user_id = ?', [req.params.user_id], (err, rows) => {
        if (auth.isOwner(req, res)) {
            res.render('user_edit', { userId: req.user.user_id, rows, alert: "" });
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

        if (auth.isOwner(req, res)) {
            // User the connection
            db.query('SELECT * FROM users WHERE user_id = ?', [req.params.user_id], (err, rows) => {
                if (auth.isOwner(req, res)) {
                    res.render('user_edit', { userId: req.user.user_id, rows, alert: "has been updated successfully." });
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

exports.form = (req, res) => {
    db.query('SELECT * FROM users WHERE user_id = ?', [req.params.user_id], (err, rows) => {
        if (auth.isOwner(req, res)) {
            res.render('user_add', { userId: req.user.user_id, rows, title: "" });
        } else {
            console.log(err);
        }
        console.log('The data from user table: \n', rows);
    });
}


// admin add new user
exports.create = (req, res) => {
    const { user_id, user_name, user_email, user_pw, user_age, user_auth, reg_date, } = req.body;
    // User the connection
    db.query("INSERT INTO users (user_id, user_pw, user_email, user_name, user_age, user_auth, reg_date) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP);", [user_id, user_pw, user_email, user_name, user_age, user_auth, reg_date], (err, rows) => {
        if (auth.isOwner(req, res)) {
            res.render('user_add', { userId: req.user.user_id, rows, title: 'User added successfully.' });
        } else {
            res.redirect('/');
        }
        console.log('The data from user table: \n', rows);
    });
}

// admin change Users info
exports.admin_edit = (req, res) => {

    // User the connection
    db.query('SELECT * FROM users WHERE user_id = ?', [req.params.user_id], (err, rows) => {
        if (auth.isOwner(req, res)) {
            res.render('users_admin', { userId: req.user.user_id, rows, alert: "" });
        } else {
            console.log(err);
        }
        console.log('The data from user table: \n', rows);
    });

}




// admin Update Users info
exports.admin_update = (req, res) => {
    const { user_name, user_email, user_age, user_auth, user_pw, } = req.body;
    // User the connection
    db.query('UPDATE users SET user_name = ?, user_email = ?, user_age = ?, user_auth = ?, user_pw = ? WHERE user_id = ?', [user_name, user_email, user_age, user_auth, user_pw, req.params.user_id], (err, rows) => {
        if (auth.isOwner(req, res)) {
            // User the connection
            db.query('SELECT * FROM users WHERE user_id = ?', [req.params.user_id], (err, rows) => {
                if (auth.isOwner(req, res)) {
                    res.render('users_admin', { userId: req.user.user_id, rows, alert: "has been updated successfully." });
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

// Delete User
exports.delete = (req, res) => {
    db.query('SELECT * FROM users WHERE user_id = ?', [req.params.user_id], (err, rows) => {
        db.query('DELETE FROM users WHERE user_id = ?', [req.params.id], (err, rows) => {
            if (!err) {
                res.redirect('/');
            } else {
                console.log(err);
            }
            console.log('The data from user table: \n', rows);
        });
    });
}