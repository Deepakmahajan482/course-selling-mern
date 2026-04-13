const {Router}=require('express');
const adminRouter=Router();
const {adminModel, courseModel}=require('../db')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt');
const {z}=require('zod');
const { adminMiddleware } = require('../middleware/admin');

// bcrypt,zod,jsonwebtoken

//signup
adminRouter.post("/signup",async (req,res)=>{
 const adminSchema=z.object({
  email:z.string().email(),
  password:z.string().min(6),
  firstName:z.string(),
  lastName:z.string()
 })
 const result=adminSchema.safeParse(req.body);
 if(!result.success){
  res.status(403).json({
    message:result
  })
  return
 }
const email=req.body.email;
const emailExitst=await adminModel.findOne({
  email:email
});
if(emailExitst){
  res.status(403).json({
    message:"account created already"
  })
  return 
}
 const password=req.body.password;
 const pass=await bcrypt.hash(password,10);
 const firstName=req.body.firstName;
 const lastName=req.body.lastName;
 const admin=await adminModel.create({
  email,password:pass,firstName,lastName
 })
 res.json({
  message:"admin created"
 })
})



//signin
adminRouter.post("/signin",async (req,res)=>{
 const adminSchema=z.object({
     email:z.string().email(),
     password:z.string().min(6),
   })
   const result=adminSchema.safeParse(req.body);
   if(!result.success){
     res.status(403).json({
       message:result
     })
     return 
   }
 
   const {email,password}=result.data;
   const emailExists=await adminModel.findOne({email});
   if(!emailExists){
    res.status(403).json({
      message:"please create the account first"
    })
    return
   }
   const passwordComparing=await bcrypt.compare(password,emailExists.password);
   if(!passwordComparing){
     res.status(403).json({
       message:"you are not the original user"
     })
     return 
   }
   const token=jwt.sign({id:emailExists._id},process.env.SECRET_KEY_ADMIN)
   res.json({
     message:"admin logined",
     token:token
   })
})

adminRouter.post("/course",adminMiddleware,async (req,res)=>{
 const title=req.body.title;
 const description=req.body.description;
 const price=req.body.price;
 const imageUrl=req.body.imageUrl;
 const creatorId=req.adminId;
 const course=await courseModel.create({
  title,description,price,imageUrl,creatorId
 })
 res.json({
  message:"course added successfully"
 })
})


adminRouter.put("/course",adminMiddleware,async(req,res)=>{
  const adminId=req.adminId;
  const {title,description,price,imageUrl,courseId}=req.body;
  const course=await courseModel.updateOne({
    _id:courseId,
    creatorId:adminId
  },{
    title:title,
    description:description,
    imageUrl:imageUrl,
    price:price
  })

  if (course.matchedCount === 0) {
    return res.status(404).json({
      message: "Course not found or not allowed"
    });
  }

  res.json({
    message: "Course updated"
  });

})

adminRouter.get("/course/bulk",adminMiddleware,async(req,res)=>{
  const adminId=req.adminId;
  const course=await courseModel.find({creatorId:adminId})
  if(course.length==0){
    res.status(403).json({
      message:"there is no courses"
    })
    return 
  }
  res.json({
    courses:course
  })
})

module.exports={
  adminRouter:adminRouter
}