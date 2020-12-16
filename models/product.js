
var mongoose =require('mongoose')

var ProductSchema = mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    slug:{
        type:String,
    },
    desc:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },  
    price:{
        type:Number,
        required:true
    },
    image:{
        type:String,
    },
    sorting:{
        type:Number,  
    }   
});
var product = module.exports = mongoose.model('Product',ProductSchema);