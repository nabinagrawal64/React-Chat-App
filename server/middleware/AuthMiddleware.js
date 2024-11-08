const jwt = require("jsonwebtoken");

exports.verifyToken = (req,res,next) => {
    const token = req.cookies.jwt
    if(!token){
        return res.status(401).json({
            success: false,
            message: "No token provided, access denied"
        })
    }
    jwt.verify(token,process.env.JWT_SECRET, async(err,payload) => {
        if(err){
            return res.status(403).json({
                success: false,
                message: "Token is invalid, access denied"
            })
        }    
        req.userId = payload.userId;
        next();
    })
}



