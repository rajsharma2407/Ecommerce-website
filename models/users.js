
var mongoose =require('mongoose')

var userSchema = mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true 
    },
    password:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true
    }
});
var user = module.exports = mongoose.model('User',userSchema);