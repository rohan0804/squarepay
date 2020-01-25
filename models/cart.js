const mongoose=require('mongoose');;
var schema=mongoose.Schema;

var cartschema={
    user:{
        type:mongoose.Schema.Types.ObjectId,ref:'create_account_collection',
        required:true
    },
    date:String,
    cart:[],
    orderid:Number,
    total:Number,
    approaved:Boolean
}
var cart=mongoose.model('cartschema',cartschema);

module.exports={cart}