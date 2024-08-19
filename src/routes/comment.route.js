import { Router, json } from "express";
import { addCommentToVideo,updataComment, deleteCommentOnVideo, getAllcommentOnVideo } from "../controllers/comment.controller.js";
import { JWTverifyToken } from "../middlewares/jwtverify.middleware.js";
const  commentRouter=Router()

commentRouter.route("/doComment").post(JWTverifyToken , addCommentToVideo )
commentRouter.route("/getAllComment/:videoId").get( getAllcommentOnVideo)
commentRouter.route("/deleteComment/:commentId").post(JWTverifyToken , deleteCommentOnVideo)

 
commentRouter.route("/getUserId").get(async(_,res)=>{

   try {
       
   
    console.log(data)
  
    console.log("hiiiiiiiiiiiiiiiiii")
     res.send(data) 
    
   } catch (error) {
    console.log("error occured while fetching the cookie", error)
    
   }

})

export default commentRouter