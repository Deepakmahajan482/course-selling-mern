const {Router}=require('express');
const adminRouter=Router();
const {adminModel}=require('../db')
adminRouter.post("/signup",(req,res)=>{
  res.json({
   
  })
})

adminRouter.post("/signin",(req,res)=>{
  res.json({
    message:"admin signin endpoint"
  })
})

adminRouter.post("/course",(req,res)=>{
  res.json({
    messgae:"course endpint"
  })
})

adminRouter.put("/course",(req,res)=>{
  res.json({
    message:"put course endpoint"
  })
})

module.exports={
  adminRouter:adminRouter
}