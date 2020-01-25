const mongoose=require('mongoose');;
var schema=mongoose.Schema;
var menuschema=new schema({
 price:Number,
 imgpath:String,
 itemname:String,
 type:String,
 isavail:Boolean,
});
var menu=mongoose.model('menu',menuschema);
module.exports={
    menu
}