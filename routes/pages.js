var express = require('express');
var router = express.Router();
var Page = require('../models/page');

router.get('/',(req,res)=>{
    Page.findOne({slug:'home'},(err,page)=>{
        req.session.name='geeks';
        console.log(req.session.id)
    res.render('index',{
        title:'home',
        content:page.content
    });

    })
});


router.get('/:slug',(req,res)=>{
    // console.log(req.params.slug)
    Page.findOne({slug:req.params.slug},(err,page)=>{
        if(err) console.log(err)
      if(page)
      {
    res.render('index',{
        title:page.title,
        content:page.content
    });
    }

    })
});

module.exports= router;