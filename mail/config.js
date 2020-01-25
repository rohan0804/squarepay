module.exports=function(mailOptions){
    nodemailer=require("nodemailer");
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "squarepay21@gmail.com",
        pass: 'squarepay12345'
    }
})

return function mail(mailOptions){
    transporter.sendMail(mailOptions,(err,info)=>{
        if(err) console.log(err)
         else{
             console.log(info.response)
         }
    })
}
}