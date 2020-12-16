var express = require('express');
var router = express.Router();
var User = require('../models/users');

router.get('/',(req,res)=>{
    var userId = req.session.name;
    console.log(req.session.id)
    res.render('login')
});


router.post('/',(req,res)=>{
    // console.log(req.body.username)
    // console.log(req.body.password)
    var user = req.body.username;
    var pass = req.body.password;
    User.findOne({username:user,password:pass},(err,users)=>{
        req.flash('success',`Logged in as ${user} `)
        req.app.locals.login=user;
        res.redirect('/');
    })
});

module.exports= router;