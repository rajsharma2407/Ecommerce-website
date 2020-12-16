var express = require("express");
var router = express.Router();
var fs = require("fs-extra");
var mkdirp = require("mkdirp");
var resizeImg = require("resize-img");
const Categories = require("../models/categories");
// Get page model
var Product = require("../models/product");

//
// Get product index

//
router.get("/", (req, res) => {
  var count =0;
  Product.count((err, c) => {
    if (err) console.log(err);
    count = c;
  });
  Product.find({})
    .sort({ sorting: 1 })
    .exec((err, products) => {
      if (err) console.log(err);

      res.render("admin/products", {
        products: products,
        count: count,
      });
    });
});

//
// Get page index
//
router.get("/add-product", (req, res) => {
  var title = "";
  var desc = "";
  var price = "";
  var image = "";
  Categories.find({}, (err, categories) => {
    if (err) console.log(err);
    res.render("admin/add_product", {
      title: title,
      desc: desc,
      price: price,
      categories: categories,
      image: image,
    });
  });
});

// Post add Product

router.post("/add-product", (req, res) => {
  // console.log(typeof(req.files.image))
  if (req.files != null) 
  var imageFile = req.files.image.name;
  else var imageFile = "";
  req.checkBody("title", "Title must have a value").notEmpty();
  req.checkBody("desc", "Description must have a value").notEmpty();
  req.checkBody("price", "Price must have a value").isDecimal();
  req.checkBody("image", "you must upload an image").isImage(imageFile);

  var title = req.body.title;
  var slug = req.body.title.replace(/\s+/g, "-").toLowerCase();
  var desc = req.body.desc;
  var price = req.body.price;
  var category = req.body.category;
  var errors = req.validationErrors();
  if (errors) {
    Categories.find({}, (err, categories) => {
      if (err) console.log(err);
      res.render("admin/add_product", {
        title: title,
        desc: desc,
        price: price,
        categories: categories,
        category:category,
        image: imageFile,
      });
    });
  } else {
    Product.findOne({ slug: slug }, (err, product) => {
      if (err) console.log(err);
      if (product) {
        req.flash("danger", "Product Title exists choose another");
        Categories.find({}, (err, categories) => {
          if (err) console.log(err);
          res.render("admin/add_product", {
            title: title,
            desc: desc,
            price: price,
            categories: categories,
            category:category,
            image: imageFile,
          });
        });
      } else {
        var price2 = parseFloat(price).toFixed(2);
        var product = new Product({
          title: title,
          slug: slug,
          desc: desc,
          price: price2,
          category: category,
          image: imageFile,
          sorting: 100,
        });
        product.save((err) => {
          if (err) return console.log(err);

          mkdirp("public/product_images/" + product._id).then((err) =>
            console.log(err)
          );

          mkdirp(
            "public/product_images/" + product._id + "/gallery"
          ).then((err) => console.log(err));

          mkdirp(
            "public/product_images/" + product._id + "/gallery/thumbs"
          ).then((err) => {
            console.log(err);
            if (imageFile != "") {
              var productImage = req.files.image;

              var path =
                "public/product_images/" + product._id + "/" + imageFile;

              productImage.mv(path, (err) => {
                return console.log(err);
              });
            }
          });
          req.flash("success", "Product added!");
          res.redirect("/admin/products");
        });
      }
    });
    }
});

//
// Get Edit product
//
router.get("/edit-product/:id", (req, res) => {
  Product.findOne({ _id: req.params.id }, (err, product) => {
    if (err) console.log(err);
    // console.log('image:',product.image)
    Categories.find({}, (err, categories) => {
      if (err) console.log(err);
      res.render("admin/edit_product", {
        title: product.title,
        id:product._id,
        desc: product.desc,
        category:product.category,
        price: product.price,
        categories:categories,
        image: product.image,
        slug:product.slug
      });
    });
  });
});

// Post edit product

router.post("/edit-product/:id", (req, res) => {
  req.checkBody("title", "Title must have a value").notEmpty();
  req.checkBody("price", "price must have a value").isDecimal();
  req.checkBody("desc", "desc must have a value").notEmpty();

  if (req.files != null) 
  var imageFile = req.files.image.name;
  else var imageFile = "";

  var productImage = imageFile;
  var title = req.body.title;
  var slug = req.body.title.replace(/\s+/g, "-").toLowerCase();
  var desc = req.body.desc;
  var id = req.params.id;
  var price = req.body.price;
  var image = imageFile;
  var category = req.body.category;
  var errors = req.validationErrors();
  if (errors) {
    Categories.find({}, (err, categories) => {
      if (err) console.log(err);
      res.render("admin/edit_product", {
        errors: errors,
        title: title,
        slug: slug,
        desc:desc,
        price:price,
        category:category,
        id: id,
        categories:categories,
        image:image
      });
    });
    
  } else {
    Product.findOne({ slug:slug, _id: { $ne: id } }, (err, product) => {
      if(err) console.log(err)
      if (product) {
        req.flash("danger", "Product title exists choose another");
        Categories.find({}, (err, categories) => {
          if (err) console.log(err);
          res.render("admin/edit_product", {
            title: title,
            slug: slug,
            desc:desc,
            price:price,
            image:image,
            id: _id,
            categories:categories,
            category:category
          });
        });
       
        console.log("first else");
      } else {
        console.log(id);
        Product.findById(id, (err, product) => {
          if (err) console.log(err);
          product.title = title;
          product.slug = slug;
          product.price = price;
          product.image = image;
          product.category = category,
          product.desc =desc;
          product.save((err) => {
            if (err) console.log(err);
            if (imageFile != "") {
              var productImage = req.files.image;
              var path = "public/product_images/" + product._id + "/" + imageFile;
              productImage.mv(path, (err) => {
                return console.log(err);
              });
            }
            req.flash("success", "Product saved");
            res.redirect("/admin/products");
          });
        });
      }
    });
  }
});

// Get Delete Page
//
router.get("/delete-product/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id, (err) => {
    if (err) console.log(err);
    req.flash("success", "Product Deleted"); 
    res.redirect("/admin/products");
  });
});

module.exports = router;
