const jwt=require('jsonwebtoken')
const Register=require('../models/IndividualUser')

const auth=async (req,res,next)=>{
    try{
        const token=req.header('Authorization').replace('Bearer','')//extract the token from the request
        const decoded=jwt.verify(token,'illuminatiwillrevive')//then verify the token signatue
        const user=await Register.findOne({_id:decoded._id,'tokens.token':token})//then find the user 
      
        if(!user)
        {
            throw "Authentication Error"
        }
        req.user=user
        req.token=token
        next()
    }catch(e){
        res.status(401).send({error:'Authentication Error'})
    }
        
}

module.exports=auth