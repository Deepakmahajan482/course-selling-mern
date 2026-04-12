const {Router}=require('express');
const admin = require('./admin');
const {courseModel}=require('../db')

const courseRouter=Router();
  courseRouter.post("/purchase",(req,res)=>{
  res.json({
    message:"signup endpoint"
  })
}
)
courseRouter.get("/preview",(req,res)=>{
  res.json({
    messgae:"signup endpoint"
  })  
});


module.exports={
  courseRouter:courseRouter
}