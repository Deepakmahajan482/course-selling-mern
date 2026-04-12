const express=require('express');
const Router=express.Router;
const {userModel} = require('../db')
//or  const {Router}=require('express');

const userRouter=Router();

  userRouter.post("/signup",(req,res)=>{
    res.json({
      message:"signup endpoint"
    })
  })

  userRouter.post("/signin",(req,res)=>{
    res.json({
      message:"signin endpoint"
    })
  })

  userRouter.get("/purchase",(req,res)=>{
    res.json({
      message:"sign up endpoint"
    })
  }
)


module.exports={
  userRouter:userRouter
}