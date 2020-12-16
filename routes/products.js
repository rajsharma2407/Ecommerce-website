var express = require('express');
var router = express.Router();
var Product = require('../models/product');

router.get('/',(req,res)=>{
    Product.find({},(err,p)=>{
        if(err)
        console.log(err)
    res.render('products',{
        product:p
        
    });

    })
});


router.get('/:category',(req,res)=>{
    Product.find({category:req.params.category},(err,pro)=>{
        if(err) console.log(err)
    res.render('products',{
        product :pro
    });

    })
});

module.exports= router;