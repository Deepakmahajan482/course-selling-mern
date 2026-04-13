const jwt=require('jsonwebtoken')

function userMiddleware(req,res,next){
  const token=req.headers.token;
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY_USER);

    req.userId = decoded.id;
    next();

  } catch (err) {
    return res.status(403).json({
      message: "Invalid or expired token"
    });
  }
}

module.exports={
  userMiddleware
}