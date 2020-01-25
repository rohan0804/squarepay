const mongoose=require('mongoose');;
const mongoosePaginate = require('mongoose-paginate-v2');
var schema=mongoose.Schema;

var formschema= new schema({
   username:{
       type:String,
       required:true
   },
   email:{
       type:String,
       required:true
   },
   resettoken:String,
   resetTokenExpiration:Date,
   password:{
       type:String,
       required:true,
   },
   mobileno:{
       type:Number
   },
   gender:{
       type:String
   },
   isapplied:String,
   sqc:{
       id:Number,
       balance:Number
   }
});
formschema.plugin(mongoosePaginate);
var create_account_collection=mongoose.model('create_account_collection',formschema);