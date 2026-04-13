const {Router}=require('express');
const admin = require('./admin');
const {courseModel, purchaseModel}=require('../db');
const { userMiddleware } = require('../middleware/user');

const courseRouter=Router();
  courseRouter.post("/purchase",userMiddleware,async (req,res)=>{
  const userId=req.userId;
  const courseId=req.body.courseId;
  const existsCourse=await courseModel.findById(courseId);
  if(!existsCourse){
    res.status(403).json({
      message:"course not exists"
    })
    return 
  }
  const alreadyPurchased = await purchaseModel.findOne({
    userId,
    courseId
  });

  if (alreadyPurchased) {
    return res.status(409).json({
      message: "Course already purchased"
    });
  }

  const course=await purchaseModel.create({
    userId,courseId
  })
  res.json({
    message:"course purchased successfully"
  })
}
)
courseRouter.get("/preview/:courseId",async(req,res)=>{
  const { courseId } = req.params;

  const course = await courseModel.findById(courseId);

  if (!course) {
    return res.status(404).json({
      message: "Course not found"
    });
  }

  res.json({
    course
  });
});


module.exports={
  courseRouter:courseRouter
}