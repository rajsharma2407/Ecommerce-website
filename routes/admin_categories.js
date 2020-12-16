var express = require('express');
var router = express.Router();

// Get page model
var Categories = require('../models/categories');

// 
// Get page index

// 
router.get('/',(req,res)=>{
    Categories.find({}).exec((err,categories)=>{
        if(err) console.log(err)
        res.render('admin/categories',{
            categories:categories
        })
    })
});


// 
// Get categories 
// 
router.get('/add-categories',(req,res)=>{
    var title="";
    res.render('admin/add_categories',{
            title:title
    });
})

// Post add page

router.post('/add-categories',(req,res)=>{
    req.checkBody('title','Title must have a value').notEmpty();;
    var title = req.body.title;
    var slug = title.replace(/\s+/g,'-').toLowerCase();

    var errors = req.validationErrors();
    if(errors)
    {
    res.render('admin/add_categories',{
        errors:errors,
        title:title
    });
}else{
    Categories.findOne({slug:slug},(err,cat)=>{
        if(cat){
        req.flash('danger','Category slug exists choose another');  
        res.render('admin/add_categories',{
            title:title
        });
        // console.log('first else')
    }else{
        console.log('sec else')

        var cat = new Categories({
            title:title,
            slug:slug
        });
        cat.save((err)=>{
            if(err) console.log(err);

            req.flash('success','Category added');
            res.redirect('/admin/categories');
        });

    }
    });
}
});

// router.post('/edit-category/',(req,res)=>{
//     res.redirect('/admin/pages')
//     req.flash('danger',"can't edit the page")
// })

// 
// Get Edit page
// 
router.get('/edit-categories/:id',(req,res)=>{
    Categories.findById(req.params.id,(err,cat)=>{
        if(err) console.log(err);    
        res.render('admin/edit_categories',{
            title:cat.title,
            id:cat._id
    });
        });
});


// Post edit page

router.post('/edit-categories/:id',(req,res)=>{
    req.checkBody('title','Title must have a value').notEmpty();
    var title = req.body.title;
    var slug = req.body.title.replace(/\s+/g,'-').toLowerCase();
    var id = req.body.id;

    var errors = req.validationErrors();
    if(errors)
    {
    res.render('admin/edit_categories',{
        errors:errors,
        title:title,
        id:id
    });
}else{
    Categories.findOne({title:title, _id:{'$ne':id}},(err,cat)=>{
        if(cat){
        req.flash('danger','Page title exists choose another');  
        res.render('admin/edit_categories',{
            title:title,
            id:id
        });
        console.log('first else')
    }else{
        console.log('sec else')
        Categories.findById(id,(err,cat)=>{

if(err) console.log(err);
cat.title = title;

        cat.save((err)=>{
            if(err) console.log(err);
            req.flash('success','category saved');
            res.redirect('/admin/categories/edit-categories/'+cat.id);

        });
    });

    }
    });
}
});

// Get Delete Page
// 
router.get('/delete-categories/:id',(req,res)=>{
    Categories.findByIdAndRemove(req.params.id,(err)=>{
        if(err) console.log(err)

        req.flash('success','page Deleted');
        res.redirect('/admin/categories');
    })
})

module.exports= router;