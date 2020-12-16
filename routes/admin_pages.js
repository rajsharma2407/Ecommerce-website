var express = require('express');
var router = express.Router();

// Get page model
var Page = require('../models/page');

// 
// Get page index

// 
router.get('/',(req,res)=>{
        Page.find({}).sort({sorting:1}).exec((err,pages)=>{
            res.render('admin/pages',{
                pages:pages
            })
        })
});


// 
// Get page index
// 
router.get('/add-page',(req,res)=>{
    var title   ="";
    var slug   ="";
    var content   ="";
    res.render('admin/add_page',{
        title:title,
        slug:slug,
        content:content
    });
})

// Post add page

router.post('/add-page',(req,res)=>{
    req.checkBody('title','Title must have a value').notEmpty();
    req.checkBody('content','Content must have a value').notEmpty();
    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
    if(slug == '') slug = title.replace(/\s+/g,'-').toLowerCase();
    var content = req.body.content;
    var errors = req.validationErrors();
    if(errors)
    {
    res.render('admin/add_page',{
        errors:errors,
        title:title,
        slug:slug,
        content:content
    });
}else{
    Page.findOne({slug:slug},(err,page)=>{
        if(page){
        req.flash('danger','Page slug exists choose another');  
        res.render('admin/add_page',{
            title:title,
            slug:slug,
            content:content
        });
        // console.log('first else')
    }else{
        console.log('sec else')

        var page = new Page({
            title:title,
            slug:slug,
            content:content,
            sorting:100
        });
        page.save((err)=>{
            if(err) console.log(err);

            req.flash('success','Page is added');
            res.redirect('/admin/pages');
        });

    }
    });
}   
});

// sort pages
    function sortPages(ids,callback){
        var count = 0;        
    for(var i=0;i<ids.length;i++)
    {
        var id = ids[i];
        count++;
    (function(count){
        Page.findById(id, (err,page)=>{
            page.sorting = count;
            page.save((err)=>{
                if (err) console.log(err);
                ++count;
                if(count>ids.length)
                    callback();
            })
        })
    })(count);
    }


    }

//post reorder page

router.post('/reorder-pages',(req,res)=>{
    var ids = req.body['id[]'];
    sortPages(ids,function(){
        
Page.find({}).sort({sorting:1}).exec((err,page)=>{
    if(err) console.log(err)
      req.app.locals.pages = page;
})
    })
});

router.post('/edit-page/',(req,res)=>{
    res.redirect('/admin/pages')
    req.flash('danger',"can't edit the page")
})

// 
// Get Edit page
// 
router.get('/edit-page/:slug',(req,res)=>{
    Page.findOne({slug:req.params.slug},(err,page)=>{
        if(err) console.log(err);    
        res.render('admin/edit_page',{
            title:page.title,
            slug:page.slug,
            content:page.content,
            id:page._id
    });
        });
});


// Post edit page

router.post('/edit-page/:slug',(req,res)=>{
    req.checkBody('title','Title must have a value').notEmpty();
    req.checkBody('content','Content must have a value').notEmpty();
    var title = req.body.title;
    var slug = req.body.slug.replace(/\s+/g,'-').toLowerCase();
    if(slug == '') slug = title.replace(/\s+/g,'-').toLowerCase();
    var content = req.body.content;
    var id = req.body.id;

    var errors = req.validationErrors();
    if(errors)
    {
    res.render('admin/edit_page',{
        errors:errors,
        title:title,
        slug:slug,
        content:content,
        id:id
    });
}else{
    Page.findOne({slug:slug, _id:{'$ne':id}},(err,page)=>{
        if(page){
        req.flash('danger','Page slug exists choose another');  
        res.render('admin/edit_page',{
            title:title,
            slug:slug,
            content:content,
            id:id
        });
        console.log('first else')
    }else{
        console.log('sec else')
        Page.findById(id,(err,page)=>{

if(err) console.log(err);
page.title = title;
page.slug = slug ;
page.content = content;

        page.save((err)=>{
            if(err) console.log(err);
            req.flash('success','Page is saved');
            res.redirect('/admin/pages/edit-page/'+page.slug);

        });
    });

    }
    });
}
});

// Get Delete Page
// 
router.get('/delete-page/:id',(req,res)=>{
    Page.findByIdAndRemove(req.params.id,(err)=>{
        if(err) console.log(err)

        req.flash('success','page Deleted');
        res.redirect('/admin/pages');
    })
})

module.exports= router;