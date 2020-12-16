var express = require('express');
var router = express.Router();
var User = require('../models/users');

router.get('/',(req,res)=>{
   
    res.render('register',{
        user:"",
        email:"",
        pass:"",
        confirm:"",
    });

});


router.post('/',(req,res)=>{
    console.log(JSON.stringify(req.body)) 
    req.checkBody("username", "Username must have a value").notEmpty();
    req.checkBody("email", "Email must have a value").notEmpty();
    req.checkBody("password", "Password must have a value").notEmpty();
    req.checkBody("confirm", "Password should be same").equals(req.body.password);
    var user = req.body.username;
    var email = req.body.email;
    var pass = req.body.password;
    var confirm = req.body.confirm;
    var errors = req.validationErrors();
    if (errors) {

        res.render("register", {
        errors:errors,
        user:user,
        pass:pass,
        email:email,
        confirm:confirm
        });
    }
    else{
    var slug = user.replace(/\s+/g,'-').toLowerCase();
        User.findOne({slug:slug},(err,users)=>{
            if(users)
            {
            req.flash('danger','Username exists please choose another');
            res.render("register", {
                user:user,
                pass:pass,
                email:email,
                confirm:confirm
                });
            }else{
                var users = new User({
                    username:user,
                    email:email,
                    password:pass,
                    slug:slug
                    });
                    users.save((err)=>{
                        if (err) console.log(err);
                        res.redirect('/login');
                    });
            }
        });
      
    }
});

module.exports= router;