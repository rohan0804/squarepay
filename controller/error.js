const express=require('express');
const app=express();

exports.get404error=app.use((req,res)=>{
    res.status(404).send("<h1>page not found!</h1>");
});