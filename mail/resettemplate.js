module.exports={
    signup:function(email,date,token){
        obj={}
        obj.from='squarepay21@gmail.com',
        obj.to=email,
        obj.subject=`Welcome for password reset`,
        obj.html=`
        <p>Dear,<p><br>

       <p> On ${date},</p>

        <p>you requested a password reset</p>

        <p>click this <a href="http://localhost:7000/reset/${token}"> link </a> to set a new password</p>
        <br>
        <p>from squarepay</p>
        <br>
        <p>regards</p>
        `

        return obj
    }
}