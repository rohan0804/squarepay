module.exports={
    signup:function(email,name,date){
        obj={}
        obj.from='squarepay21@gmail.com',
        obj.to=email,
        obj.subject=`Welcome ${name}`,
        obj.text=`
        Dear ${name},

        On ${date} , Your email ${email} was registered on our portal.
        We hope you to enjoy our menu harvested from different horizons of delacasies.

        from squarepay
        regards
        `

        return obj
    }
}