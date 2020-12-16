
var mongoose =require('mongoose')

var categoriesSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        
    }   
});
var categories = module.exports = mongoose.model('Categories',categoriesSchema);