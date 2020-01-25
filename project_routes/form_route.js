const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const notifier = require('node-notifier');
const session=require('express-session');
const nodemailer=require('nodemailer');
const isauth=require('../middleware/isauth')
const adminauth=require('../middleware/admin')
const data=require('./menu');
const razorpay=require('razorpay');
const crypto=require('crypto');
const  create_account_collection=mongoose.model('create_account_collection');
menu = require("../models/menumodel").menu;
const cart=require("../models/cart").cart;
const rp=new razorpay({
  key_id:"rzp_test_JipGHxHUCexYFB",
  key_secret:"3F6vbhBKSSzYhZVRl4xOmEVJ"
})

menuobject={}
menu.find({type:'drinks'},(err,data)=>{
  menuobject.drinks=data;
 });
 menu.find({type:'combos'},(err,data)=>{
  menuobject.combos=data;
 });
menu.find({type:'fastfood'},(err,data)=>{
  menuobject.fastfood=data;
 });
 menu.find({type:'snacks'},(err,data)=>{
  menuobject.snacks=data;
 });
// const bcrypt = require('bcrypt');
// app.set('view engine', 'ejs');

router.get('/',(req,res)=>{
     res.render('homepage',{
     str:"Recharge With Ease!"
     });
  });

   router.get('/signup',(req,res)=>{
    res.render('signup',{
     str:"Recharge With Ease!",
     error:'0',
     email:req.body.email
   });
  });

   router.get('/homepage',(req,res)=>{
    res.render('homepage',{
      str:"Recharge With Ease!"
    }); 
   });
router.get('/about',(req,res)=>{
  res.render('about',{
    str:"About Square pay"
  });
 });

 router.get('/contact',(req,res)=>{
  res.render('contact');
 });
 router.get('/admin/contact',(req,res)=>{
  res.redirect('/contact');
 });
 router.get('/admin/about',(req,res)=>{
  res.redirect('/about');
 });
 router.get('/delete',(req,res)=>{
   req.session.destroy();
  res.render('homepage',{
    str:"Recharge With Ease!"
  });
 });

 router.get('/dashboard',(req,res)=>{
   rzpord={}
   console.log(req.session.data.sqc.balance)
   console.log(req.session.data)
  rp.orders.create({amount:100,currency:"INR",receipt:"1"},(err,order)=>{
  rzpord.razorpay_orders=order   
  })

  res.render('dashboard',{
    str:'welcome'+ ' ' +req.session.data.username,
    data:req.session.data,
    drinks:menuobject.drinks,
    combos:menuobject.combos,
    snacks:menuobject.snacks,
    fastfood:menuobject.fastfood,
    id:rzpord.razorpay_orders
  });
 });
 router.get('/signin',(req,res)=>{
   //console.log(req.session.isloggedin);
   //console.log(req.session);
   if(req.session.isloggedin){
    console.log(req.session.isloggedin);
    res.redirect('/dashboard');
  }
  else{
      res.render('signin',{
      str:"Recharge With Ease!",
    });
  }
}); 
  

 router.get('/admin',(req,res)=>{
   if(req.session.adminname){
     res.redirect('adminpanel');
   }
   else{
    res.render('admin',{
      str:'Admin page'
    })
   }
 });
 router.get('/admin/adminpanel',adminauth,(req,res)=>{
  res.render('adminpanel',{
    str:'Admin panal'
  });
});

router.post('/postresetpassword',(req,res,next)=>{
crypto.randomBytes(32,(err,buffer)=>{
  if(err){
    console.log(err);
    return res.redirect('/reset');
  }
  const token=buffer.toString('hex'); 
  create_account_collection.findOne({email:req.body.email})
  .then(user=>{
    if(!user){
      console.log('not account with that email');
      return res.redirect('/reset');
    } 
    user.resettoken=token;
    user.resetTokenExpiration=Date.now()+3600000;
    return user.save();
  })
  .then(result=>{
    date=new Date();
    total=date.getFullYear()+"/"+date.getMonth()+"/"+date.getDate()
    mailopts=require("../mail/resettemplate").signup(req.body.email,total,token);
    send=require('../mail/config')();
    send(mailopts);
    res.redirect('/');
  })
  .catch(err=>{
    if(err){
      console.log(err);
    }
  })
})
});
router.get('/reset',adminauth,(req,res)=>{
  res.render('reset',{
    str:'reset password'
  });
});

router.get('/reset/:token',(req,res,next)=>{
  console.log(req.params.token);
  const token=req.params.token;
  create_account_collection.findOne({resettoken:token,resetTokenExpiration:{$gt: Date.now()}})
  .then(user=>{
    console.log(user._id);
    res.render('new-password',{
      str:'update your password',
      userId:user._id.toString(),
    });
  })
  .catch(err=>{
    if(err){
     console.log(err)
    }
  })
})

router.get('/sqpanel',(req,res,next)=>{
  res.render('sqpanel',{
    str:'square one panel',  
    drinks:menuobject.drinks,
    combos:menuobject.combos,
    snacks:menuobject.snacks,
    fastfood:menuobject.fastfood,
  });
})
router.post('/addnewitem',(req,res,next)=>{
    itemname=req.body.itemname;
    price=req.body.price;
    option=req.body.options;
    imageurl=req.body.image;
    console.log(req.body);
    path="/images/menu/"+option+"/"+imageurl;
    var obj={
      price:price,
      itemname:itemname,
      imgpath:path,
      type:option,
      isavail:true
  }
   new menu(obj).save()//save the item into the database
   res.end()
});
router.post('/postnewpassword',(req,res,next)=>{
  console.log(req.body);
  create_account_collection.findByIdAndUpdate({_id:req.body.userId},{$set:{password:req.body.password}},(err,data)=>{
  if(err){
    console.log(err);
  }
  else{
    console.log('password reset successfully!!');
    res.redirect('/signin');
  }
  });
})
router.post('/dashboard',(req,res)=>{
     insertrecord(req,res); 
     console.log(req.body);
});

router.post('/fetchall',(req,res)=>{
  user=mongoose.model('create_account_collection');
  val=req.body.val;
  page=req.body.page;
  search=req.body.search;
  //console.log(search);
  opt={
  limit:val,
  page:page
  }
  if(search){
    var regexp=new RegExp(search,'i');
    searching={$or:[{username:regexp},{email:regexp}]}
  }
  else{
    searching={};
  }
  // console.log(searching);
  //console.log(opt);
  user.paginate(searching,opt,(err,data)=>{
    //console.log(data);
    res.send(data);
  })
});
//post req for delete a record fro the admin panel
router.post("/deleteRec",(req,res)=>{
  id=req.body.id
  create_account_collection.findOneAndRemove({_id:id},(err,docs)=>{
    docs.remove();
    res.send("success");
  })
});
 //post req for update a record fro the admin panel
 router.post("/updateRec",(req,res)=>{
   id=req.body.id;
  create_account_collection.findByIdAndUpdate(id,{username:req.body.username,email:req.body.email,mobileno:req.body.mobileno},{new:true},(err,docs)=>{
    if(err){
      console.log(err);
    }
    else{
      console.log(docs);
      res.send(docs);
    }
  })
});

router.post('/admin/adminpanel',(req,res)=>{
  req.session.adminname=req.body.username;
  if(req.body.username=='rohan' && req.body.password=='1710992573'){
  res.render('adminpanel',{
    str:'Admin panal'
  });
}
else{
  console.log('lol!!');
}
});
router.post('/genid',(req,res)=>{
  card=Math.floor(10000 + Math.random() *90000);
   id=req.body.id;
   console.log(id);
    create_account_collection.findByIdAndUpdate({_id:id},{$set:{isapplied:'1',"sqc.id":card}},(err,data)=>{
    req.session.data.isapplied='1';
    sqc={}
    sqc.id=card
    req.session.data.sqc=sqc // req.session.data.sqc.id=card;
    res.send('your new card is isseud '+card +'recharge to order');
  })
})
router.post('/updateavail',(req,res)=>{
  id=req.body.id;
  //console.log(id);
  menu.findOne({_id:id},(err,data)=>{
    if(data.isavail==true){
      data.isavail=false
      console.log('change to false');
    }
    else{
      data.isavail=true
      console.log('change to true');
    }
    data.save();
  })
});
router.post('/aftersignin',(req,res,next)=>{
  //set the cookie using setheader!
  //res.setHeader('Set-Cookie','loggedin=true;HttpOnly')
   req.session.isloggedin=true;
   req.session.username=req.body.existinguser;
   console.log(req.body);
   var uname=req.body.existinguser;
   var passw=req.body.pass;
   create_account_collection.findOne({username:uname,password:passw},function(err,docs){
    if(docs){
      req.session.data=docs;
      req.session.email=docs.email;
      console.log("user present into the database");
      res.redirect('/dashboard');
    }
    else{ 
      console.log("user not present into the database");
      console.log('pls eter correct usename and password!');
      res.redirect('/signin');
      //next();  
    }
   });  
});

router.post("/successpayment",(req,res)=>{
  no=Number(req.body.amt);
  console.log(no);
  rp.payments.capture(req.body.razorpay_payment_id,100)
  create_account_collection.findOneAndUpdate({_id:req.body.iduser},
      {$inc:{'sqc.balance':Number(req.body.amt)}},(err,res)=>{
       mailOpts=require("../mail/rechargetemplate").recharge(
           res.email,res.username,new Date().toLocaleString(),req.body.amt,res.sqc.balance,res.sqc.id
       )
       mail=require("../mail/config")()
       mail(mailOpts)
      })
      req.session.data.sqc.balance+=Number(req.body.amt)
 res.redirect("/dashboard");
})
router.post('/paybill',(req,res)=>{
  orderid=Math.floor(100000 + Math.random() * 900000);
  var date=new Date();
  today=date.getFullYear+'/'+date.getMonth+"/"+date.getDate+"/"+date.getHours+"/"+date.getMinutes;
 car2=JSON.parse((req.body.cart));
 id=req.body.id;
 total=req.body.total;
 console.log(cart,id,total);
 create_account_collection.findById(id,(err,user)=>{
  user.sqc.balance-=total;
  user.save();
 });
  new cart({
  user:id,
  date:today,
  cart:car2,
  approaved:false,
  orderid:orderid,
  total:total
  }).save();
})
//fucntions
var temp;
var insertrecord=(req,res)=>{
    var user=new create_account_collection();
    user.username=req.body.username;
    user.email=req.body.email;
    user.password=req.body.password;
    // bcrypt.genSalt(10,)
    user.mobileno=req.body.mobileno;
    user.gender=req.body.gender;
    user.isapplied='0';
    user.sqc={}
    const {username,email,password,mobileno,gender} = req.body;
    create_account_collection.find({username : user.username}, function (err, docs){
       if(docs.length){
         console.log('username already exist!!'); 
         res.redirect('/signup');
        }
       else{
        user.save((err)=>{
          req.session.data=user
             if(!err)
            {
              var date=new Date()
              total=date.getTime()+"-"+date.getFullYear()+"/"+date.getMonth()+"/"+date.getDate()
                console.log("record inserted successfully");
              mailOpts=require("../mail/templates").signup(email,username,total)
              sender=require("../mail/config")()
              sender(mailOpts);
                if(req.path=='/dashboard'){
                  res.redirect('dashboard')
                }
                else{
                  res.redirect('/adminpanel');
                }
                //for get the path of the req....
                console.log(req.path);
                console.log(req.url);
            }
            else{
                console.log("error="+err);
            }
            });
       }
    });
}

module.exports=router;