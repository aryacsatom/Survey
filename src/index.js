const express=require('express')
require('./db/mongoose')

const Register=require('./models/IndividualUser')
const Login=require('./models/login')

const userRouter=require('./routes/user')
const uploadRouter=require('./routes/uploadRouter')
const familyRouter=require('./routes/User1')
const surveyRouter=require('./routes/Survey')

const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const logger = require('morgan')

const app=express()
const PORT=process.env.PORT ||3000

app.use(express.json())
app.use(logger())
app.use(userRouter)
app.use(uploadRouter)
app.use(familyRouter)
app.use(surveyRouter)

app.listen(PORT,()=>{
    console.log("server is up at port", PORT)
})

