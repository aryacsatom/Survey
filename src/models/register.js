const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const Login=require('../models/login')

const registerSchema=mongoose.Schema({
    aadhaar: {
        type: Number,
        unique: true,
        required: [true, 'Aadhaar number is required']
    },
    name:{
        type:String,
        required:true,
        required: [true, 'Aadhaar number is required']
    },
    birth: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    occupation: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    sex: {
        type: String,
        required: true
    },
    marital: {
        type: String,
        required: true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

registerSchema.statics.findByCredentials=async (aadhaar,password)=>{
    const user=await Login.findOne({aadhaar})

    if(!user){
        throw "Unable to login"   
    }

    const isMatch=await bcrypt.compare(password,user.password)

    if(!isMatch){
       throw 'Unable to Login'
    }
    const userProfile=await Register.findOne({aadhaar})
    return userProfile
}

registerSchema.methods.generateAuthToken=async function(){

    const user=this
    const token=jwt.sign({_id:user.id.toString()},'illuminatiwillrevive')

    user.tokens=user.tokens.concat({token})

    await user.save()
    return token
}

const Register = mongoose.model('registers', registerSchema)

module.exports = Register
