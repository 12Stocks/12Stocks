var userModel = require('../models/userModel');
var express = require("express");

exports.findAll=(req, res) => {
    userModel.findAll((users) => {
        console.log("find all users...");
        res.render('users', {users : users});
    });
}

exports.findById=(req, res) => {
    userModel.findById(req.params.user_id, (user) => {
        console.log("user : ", user);
        res.render('user_info', {user : user[0]});
    });
}