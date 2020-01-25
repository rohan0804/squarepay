const mongoose=require('mongoose');
require('./createaccountmodel');
require('./menumodel');
require('./cart')
mongoose.connect('mongodb://localhost:27017/squarepayDB',{useNewUrlParser:true},(err)=>{
    if(!err){
        console.log('mongodb connected successfully!!'); 
    }
    else{console.log('error in making a mongodb connectoin!'+err);}
});
