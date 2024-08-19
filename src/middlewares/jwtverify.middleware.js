import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import  Jwt  from "jsonwebtoken";



 const JWTverifyToken = asyncHandler(async(req, _, next) => {
 
    try {
    
        const token = req.cookies?.refreshToken 
        || req.header("Authorization")?.replace("Bearer ", "")
        console.log("hiiiiiiiiii", req.header("Authorization")?.replace("Bearer ", "")) 

        if (!token) {
            throw new apiError(401, "Unauthorized request")
        }
        console.log(token)
    
        const decodedToken = Jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshtoken")
    
        if (!user) {
            
            throw new apiError(401, "Invalid Access Token")
        }

    
        req.user = user;
        
     
        next()
        
    } catch (error) {

        throw new apiError(401, error?.message || "Invalid access token")
    }
    
})

export {JWTverifyToken}


