const express=require('express');
const Router=express.Router;
const {userModel,purchaseModel,courseModel} = require('../db')
//or  const {Router}=require('express');
const {z}=require('zod');
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const userRouter=Router();
const {userMiddleware}=require('./middleware/user')

  userRouter.post("/signup",async (req,res)=>{
  const userSchema=z.object({
    email:z.string().email(),
    password:z.string().min(6),
    firstName:z.string(),
    lastName:z.string()
  })
  const result=userSchema.safeParse(req.body);
  if(!result.success){
    res.status(403).json({
      message:result
    })
    return 
  }

  const {email,password,firstName,lastName}=result.data;
  const emailExists=await userModel.findOne({email});
  if(emailExists){
    res.status(403).json({
      message:"user created already"
    })
    return 
  }
   const pass=await bcrypt.hash(password,10);
   const user=await userModel.create({
    email,password:pass,firstName,lastName
   })
   res.json({
    message:"user created"
   })

  })

  userRouter.post("/signin",async (req,res)=>{
    const userSchema=z.object({
    email:z.string().email(),
    password:z.string().min(6),
  })
  const result=userSchema.safeParse(req.body);
  if(!result.success){
    res.status(403).json({
      message:result
    })
    return 
  }

  const {email,password}=result.data;
  const emailExists=await userModel.findOne({email});
  const passwordComparing=await bcrypt.compare(password,emailExists.password);
  if(!passwordComparing){
    res.status(403).json({
      message:"you are not the original user"
    })
    return 
  }
  const token=jwt.sign({id:emailExists._id},process.env.SECRET_KEY_USER)
  res.json({
    message:"user logined",
    token:token
  })
  })

  userRouter.get("/purchase",userMiddleware,async (req,res)=>{
    const userId=req.userId;
    const courses=await purchaseModel.find({userId});
    if(courses.length==0){
      res.status(403).json({
        message:"there is no course you buy"
      })
      return
    }
    res.json({
      courses:courses
    })
  }
)


module.exports={
  userRouter:userRouter
}