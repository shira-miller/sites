const jwt=require("jsonwebtoken");
exports.auth=async(req,res,next)=>{
    const token=req.header("x-api-key");
    if(!token) return res.status(401).send("Access denied. No token provided.");
    try{
        const tokenData=jwt.verify(token,"jwtPrivateKey");
        req.tokenData=tokenData;
        next();
    }catch(err){
        res.status(400).json({message:"Invalid token."});
    }
}
