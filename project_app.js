const http=require('http');
const express=require('express');
var bodyparser=require('body-parser');
var fs=require('fs');
var path=require('path');
const session=require('express-session');
const mongodbstore=require('connect-mongodb-session');
// const expressLayout=require('express-ejs-layouts');
const nodemailer=require('nodemailer');
const sendgridtranspost=require('nodemailer-sendgrid-transport');

var app=express();
//app.set('views', __dirname + '/views');

app.use(session({secret:'my_secret',resave:false,saveUninitialized:false}))
app.set('view engine', 'ejs');

var port=7000;
const errorcontroller=require('./controller/error');
//import the database
const mongo=require('./models/formdb');
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//makes a folder static avail. to the server
app.use(express.static('public'));
app.use(express.static("views"));
//use
//app.use(expressLayout);

//use form_route.js
const formroute=require('./project_routes/form_route');
app.use(formroute);

//for sending the 404 error page
app.use(errorcontroller.get404error);

var server=app.listen(port,()=>{
    console.log("node server is running! at port"+port);
}); 