const express=require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const app=express();
app.use(express.json())
const {userRouterter}=require('./routes/user')
const {courseRouter}=require('./routes/course')
const {adminRouter}=require("./routes/admin")

app.use("/user",userRouter);
app.use("/course",courseRouter);
app.use("/admin",adminRouter);



async function connectDb(){
await mongoose.connect(process.env.url);
console.log("db connect")
app.listen(process.env.PORT,()=>{
  console.log("server is running")
});
}
connectDb()




