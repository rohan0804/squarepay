module.exports={
    recharge:function(email,name,date,amt,balance,sqid){
        amt=Number(amt);
        balance=Number(balance);
        obj={}
        obj.from='squarepay21@gmail.com',
        obj.to=email,
        obj.subject=`Welcome ${name}`,
        obj.text=`
        Dear ${name},

        On ${date} , Your email ${email} was registered on our portal.
        and recharge of rupees ${amt} is done. your current balane is${(balance+amt)}
        and your card is is${sqid}

        from squarepay
        regards
        `

        return obj
    }
}