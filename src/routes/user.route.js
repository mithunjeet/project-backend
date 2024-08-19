import { Router } from "express";
import { User } from "../models/user.model.js";
import  {loginUser, registerUser, LoggedOut, changePassword, changeAvatar, changeCoverImage, changeAccountDetails, getUSerChannelDetails, userWatchHistory, userExistOrNot } from "../controllers/user.controller.js";
import  {upload}  from "../middlewares/multer.js";
import { JWTverifyToken } from "../middlewares/jwtverify.middleware.js";


const userRouter = Router()




userRouter.route("/getUser").post(JWTverifyToken,async(req,res)=>{

try {
 
const  {email} = req.body
console.log("data in route" , email)
const response  = await User.find({email:email})

if(response.length ==0){
    return res.json({
        user:false
    })
}


 return res.json({user: true})



} catch (error) {
    
}



})


// userRouter.route("/login").post(async(req,res)=>{

// const {email, password} = req.body
// console.log(email)

// if(!email ){
 
// return res.json({
//     user:false,
//     message:"email not found to retrive the user" 
// })

// } 
// else{
//     const data = await User.find({email:email})

//     console.log("dtaaaaaaaaaaaaaaaaaaa", data)

// if(data.length > 0){
// //    console.log("fetch data")
//     return res.json( {
//         user:true, 
//         data:data
//     })
    
// }
// else{
   
//     return  res.json({
//         user :false,
//         message:"user not exit"
//     })
// }

// }
// })












userRouter.route("/register").post( 
  upload.fields([
    { 
        name:"avatar",
        maxCount:1
    }
    
    ,{
     name:"coverimage",
     maxCount:1

    }
])

    ,registerUser)


    userRouter.route("/login").post(loginUser)
    userRouter.route("/updatepassword").patch(JWTverifyToken , changePassword)
    userRouter.route("/updateAvatar").patch(JWTverifyToken,upload.single('avatar'),changeAvatar)
    userRouter.route("/coverImage").patch( JWTverifyToken,upload.single('coverimage'), changeCoverImage)
    userRouter.route("/updateAccountDetails").patch(JWTverifyToken,changeAccountDetails)
    userRouter.route("/loggedOut").post(JWTverifyToken,LoggedOut)
    userRouter.route("/c/:username").get(JWTverifyToken,getUSerChannelDetails)

    userRouter.route("/watchHistory").get(JWTverifyToken , userWatchHistory)
    userRouter.route("/getChannelDetailsOfuser/:username").get(JWTverifyToken,  getUSerChannelDetails)
    userRouter.route("/userExit").post( userExistOrNot )
export {userRouter}


