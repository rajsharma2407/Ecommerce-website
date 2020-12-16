const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
var config = require('./config/database');
var session = require('express-session');
var expressValidator = require('express-validator');
var fileUpload = require('express-fileupload');
var Page = require('./models/page');
var User = require('./models/users');
var reg = require('./routes/register');

Page.find({}).sort({sorting:1}).exec((err,page)=>{
    if(err) console.log(err)
    app.locals.pages = page;
})


//connect to db
mongoose.connect(config.database);
var db = mongoose.connection;
db.on('error',console.error.bind(console, 'connection:error'));
db.once('open',()=>{
    console.log('created');
})

app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));

app.locals.errors = null;
app.locals.raj = 'CmsShoppingCart';

//Express file upload middleware
app.use(fileUpload());

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// //express session middleware
app.use(session({
    secret:'keyboard cat',
    resave:true,
    saveUninitialized:true,
    cookie:{
        maxAge:72000
    }
}))
// express validator middleware

app.use(expressValidator({
    errorFormatter : (param, msg, value)=>{
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;
        while(namespace.length){
            formParam+='['+namespace.shift()+']';
        }
        return {
            param:formParam,
            msg : msg,
            value:value
        };
    },
    customValidators:{
    isImage : function(value,filename){
        var extension = (path.extname(filename)).toLowerCase();
        switch(extension){
            case '.jpg':
                return '.jpg';

            case '.jpeg':
                return '.jpeg';

            case '.png':
                return '.png';
            case '':
                return '.jpg';
            default :
                return false;
        }
    }
}
}));
app.locals.login = 'login';
// express messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

var pages = require('./routes/pages.js');
var logg = require('./routes/login.js');
var products = require('./routes/products.js');
var adminPages = require('./routes/admin_pages.js');
var adminCategories = require('./routes/admin_categories.js');
var adminProducts = require('./routes/admin_products.js');

app.use('/products',products);
app.use('/register',reg);
app.use('/login',logg); 
app.use('/admin/pages',adminPages);
app.use('/admin/categories',adminCategories);
app.use('/admin/products',adminProducts);
app.use('/',pages); 
app.listen(8000,console.log('service started at port 8000'));       