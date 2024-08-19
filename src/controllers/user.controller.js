import { asyncHandler } from "../utils/asyncHandler.js";

import apiError from "../utils/apiError.js";

import  {User}  from "../models/user.model.js";

import { cloudinaryUpload } from "../utils/cloudinary.upload.js";

import { apiResponse } from "../utils/apiResponse.js";

import  Jwt  from "jsonwebtoken";

import  option  from "../utils/option.js";
import { json } from "express";
import { Subscription } from "../models/subscription.model.js";
import mongoose from "mongoose";



const generateAccessAndRefreshToken = async (userid) => {   

    const user = await User.findById(userid)
     

    const accessToken = await  user.generateAccesssToken ()
    const refreshToken =  user.generateRefreshToken()
    
    console.log(" GENERATING ACCESS TOKEN " + accessToken)
    console.log(" GENERATING REFRESH  TOKEN " + refreshToken)
    
    // if( !accessToken  && !refreshToken){
    
    //     throw new apiError(500 ," something went wrong while generating the refresh and access token ")
    
    
    // }
    
    
    user.refreshtoken = refreshToken
    
     await user.save({validateBeforeSave : false})
    
     return { accessToken, refreshToken}
    






}





 const registerUser = asyncHandler(
  async (req , res)=>{
   
    //   get details from user the users
    // check if field is right or not  
    // validate it is logged in or not via username email
   // check for avatar
   // upload on cloudinary, avatar
   // create user object - create entry in db
   // remove password and refresh token field from response 
   // check for user creation 
   // return res
  
const { fullname, username ,email,password} = req.body

console.log(req.body)
console.log(fullname)


// if(fullname.trim() === ""){

// throw new apiError(404," fullname is required")
// }


// if(username.trim() === ""){

//     throw new apiError(404," username is required")
//     }


    
// if(password.trim() === ""){

// throw new apiError(404," password is required")
   
// }


// if(email.trim() === ""){

// throw new apiError(404," email is required")


// }

if([username,fullname,email,password].some((field)=>field?.trim()==="")
){
  
    throw new apiError(404,"all fields are  required please check properly ")

}


const UserExist=await User.findOne({

   $or:[{email},{username}] 
})

if(UserExist){

    res.status(200).json({
        success:false ,
        message:" user exit with this name and password "
    })

    throw new apiError(404,"user exit with this username or email")

   
}



const avatarLocalPath = req.files?.avatar?.[0]?.path
const coverImageLocalPath=  req.files?.coverimage?.[0]?.path

 // console.log("REQ.FILES" + req.files?.coverimage[0].path)
console.log(req.files)

const CoverImageResponse = await cloudinaryUpload(coverImageLocalPath)


if(!avatarLocalPath){
    throw new apiError(404,"avatar local path does not found ")
}

const avatarResponse = await cloudinaryUpload(avatarLocalPath)

console.log(" avatar respoonse on cloudinary !!!"+ avatarResponse.url)




// console.log(" hiiiiiiiiiiiiiiiiii")




// User.create([{email},{password},{fullname},{username},{avatar:avatarResponse.url},{ coverimage:CoverImageResponse.url}])


const user = await User.create({
    fullname,
    avatar: avatarResponse.url,
    coverimage: CoverImageResponse?.url || "",
    email, 
    password,
    username: username.toLowerCase()
})

const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)

if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering the user")
}

return res.status(201).json(
    new apiResponse(200, createdUser, "User registered Successfully")
)




// console.log("USERINFORMATIONAFTERCREATION"+USERINFORMATIONAFTERCREATION)



// console.log("username"+"         "+ USERINFORMATIONAFTERCREATION.username)



 })



  
 const loginUser = asyncHandler ( async (  req , res, next)=>{


try {
    // login via email or username 
// validate it field is given or not 
//get password check whether it is  right or not 
// make access and refres token 


  const { email , password}  = req.body

  console.log( req.body)
  console.log(email)
  
  if( !email) {

  
    throw new apiError(404 ,  "  email are required for login  ")


  }


     const user = await User.findOne({
         email
      })

if(!user){
 

   throw  new  apiError( 404 ,  "user  doesnt exit  please check email and password")
    

}



  // check password is correct or not 

  const passwordcorrect = await user.isPasswordCorrect(password)

  if(!passwordcorrect){
    
    // res.status(404).json({
     
    //  message:" password is incorrect"  
     
    
    // })
    throw new apiError(404,'invalid password please enter correct password')

}

const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

const userAfterAddingRefreshToken = await User.findById( user._id).select(" -password -refreshtoken")



// here i am going  to send /set  cookie   

const option={
    httpOnly: true,
    secure:true
}


// console.log("jay bholanath", res.cookie("accessToken", accessToken,option))

return res
.cookie("accessToken", accessToken,option)
.cookie("refreshToken",refreshToken,option)
.json(new apiResponse(200, { userAfterAddingRefreshToken,accessToken, refreshToken


}, " login succesfully" ))
} catch (error) {
    next(error)
}

})



const LoggedOut = asyncHandler (async( req,res)=>{

// const {refreshtoken } = req.cookie

// console.log(req.cookie?.accessToken)


// console.log("REFRESH TOKEN :!!" +refreshtoken)

const LoggedOut = await User.findByIdAndUpdate(req.user._id, 
{$set:{refreshtoken:undefined}},
{new:true}).select(" _password _refreshtoken")

// const option={
//     httpOnly: true,
//     secure:false
// }


//  return res.status(200)

// .clearCookie("refreshToken", option)

// .clearCookie("accessToken" , option)

return res.json(new apiResponse(200,  {}  ,  "user loggedout succesfully"))


})

// here if access token is expired  then we refresh  access token so that session can extend  and  user without login do their  work


const RefreshAccessToken  = asyncHandler(async (req,res) =>{


    const  incomingAccessToken = req.cookie?.accessToken 
    console.log("bhola nath " ,incomingAccessToken)

    if(!incomingAccessToken){

        throw new apiError(404 ," invalid request to RefreshAccessToken ")

    }

    const decodedToken = Jwt.verify(incomingAccessToken, process.env.ACCESS_TOKEN_SECRET)
  
    if( !decodedToken){

   throw new apiError(404," invalid token ")

    }

const user = User.findById(decodedToken._id)




const {accessToken,refreshToken}=generateAccessAndRefreshToken(user._id)

res
.cookie("refreshToken" ,refreshToken , option)
.cookie("accessToken", accessToken,option)
.json(new apiResponse(200 ,{}," session expanded "))










})




const changePassword = asyncHandler(async (req,res)=>{
 
    const { Password, newPassword, confirmNewPassword } = req.body


console.log("req.body" + req.body)

if(!(Password && newPassword)){

    throw new apiError(404,"please  enter oldpassword and new password ")
}

if(newPassword !== confirmNewPassword){

    throw new apiError(404,"newPassword and confirmNewPassword are not same ")


}

// if we i inject middleware  jwtverify token in the route of change password then i get access of req.user

console.log("REQ.USER"+ req.user)

// const updateResponse= await User.findByIdAndUpdate(req.user._id,
//  {$set:{password : newPassword}}  
// ,
// {
//     new :true
// }

// ).select("_refreshtoken _password ")



const user= await User.findById(req.user._id)

user.password = newPassword


 user.save({validateBeforeSave:false})
 


const updateResponse= await User.findById(user._id).select(" _password _email _refreshtoken _avatar _coverimage")



console.log(" updateResponse " + updateResponse)

res.status(200).json(
    new apiResponse(200, updateResponse,"password Update sucessfully ")
)






})



const changeAvatar =asyncHandler(async(req,res) => { 


const user = await User.findById(req.user._id)


const localPathAvatar = req.file?.path

console.log("Avatar loacl path " + req.file?.path)

if(!localPathAvatar){
    throw new apiError(404," avatar localpath not found " )

}

const avatarResponse = await cloudinaryUpload(localPathAvatar)

if(!avatarResponse){
    throw new apiError(404," avatar has not uploaded not cloudinary")
}

    user.avatar = avatarResponse.url
    
await user.save({validateBeforeSave:false})


res.status(200)

.json(new apiResponse(200,{}, " avatar uploaded sucessfully"))





})

const changeCoverImage = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    
    const localPathCoverImage = req.file
    
  console.log( 'HIIIII', req.file)
    if (!localPathCoverImage) { 
        throw new apiError(404, "CoverImage local path not found");
    }
    
    const coverImageResponse = await cloudinaryUpload(localPathCoverImage?.path);

    if (!coverImageResponse) {
        throw new apiError(404, "Cover image has not uploaded to cloudinary");
    }
    
    user.coverimage = coverImageResponse.url;
    await user.save({ validateBeforeSave: false });
    

    res.status(200).json(new apiResponse(200, {}, "Cover image has been uploaded successfully"));
});


  

    
const changeAccountDetails = asyncHandler(async(req,res)=>{

    const {email, fullname} =req.body
    console.log(req.body)
        
    if(!email && !fullname){

    throw new apiError(404,"please enter that you want to change the  field ")}
 
    
    if (email && !fullname) {

    const  responseAfterUpdate = await User.findByIdAndUpdate(req.user._id,
    {$set:{email:email}},
     { new :true}).select(" _password  _avatar _coverimage")
    
    console.log(responseAfterUpdate)
    res.status(200).json(new apiResponse(200, responseAfterUpdate, "updateSucessfully"))

    }

    if(!email && fullname){
     const   responseAfterUpdate = await User.findByIdAndUpdate(req.user._id,
       {$set:{fullname}},
        { new :true}).select("_password _refreshtoken") 
        // console.log("jeeeeeeeeeeeeee")
        console.log(responseAfterUpdate)
        res.status(200).json(new apiResponse(200, responseAfterUpdate, "updateSucessfully"))
   
   }

   if(email && fullname){

   const responseAfterUpdate = await User.findByIdAndUpdate(req.user._id,
        {$set:{fullname, email:email}},
         { new : true}).select("_password _refreshtoken") 
        //  console.log("jeeeeeeeeeeeeee")
         console.log(responseAfterUpdate)
         res.status(200).json(new  apiResponse(200, responseAfterUpdate, "updateSucessfully"))

   } })





const getUSerChannelDetails = asyncHandler(async( req,res)=>{

const {username} = req.params

console.log("hiiiiiiiiiiii"+ username)

    if(!username){
        throw new apiError(404," username is not found")
   }


    const userChannelDetails = await User.aggregate([
    {
         $match: {
        username : username }
    },


    { $lookup:{

        from:"subscriptions",
        localField: "_id",
        foreignField: "channel",
        as:"subscribers"

     }},
    
    
     {
        $lookup:{
         from:"subscriptions",

         foreignField:"subscriber",

         localField:"_id",
         
         as:"channelThatUSerHasSubcribed"
        }
     },

     
     {
        $addFields:{
         totalSubscriberOfTheUser:{
            $size : "$subscribers"
         },
         TotalChannelThatUserHasSubscribed:{
            $size:"$channelThatUSerHasSubcribed"
             },
         
         isSubscribed:{
         $cond:{
            if:{$in : [req.user._id ,"$subscribers.subscriber" ] },
            then:true,
            else:false

         }}
     

        }},
     
     {$project:{
      username:1,
      fullname:1,
      avatar:1,
      coverimage:1,
      TotalChannelThatUserHasSubscribed:1,
      totalSubscriberOfTheUser:1,
      email:1,
      isSubscribed:1         
    }}


])

 console.log("TRYING TO FIND  USER CHANNEL DETAILS" + "  "+ userChannelDetails)

if(!userChannelDetails.length){

    throw new apiError(404,"UserDetails not found ")

}

res
.status(200)
.json(userChannelDetails[0])


})

// const userChannelDetails = asyncHandler(async (req, res) => {
    
//     const { username } = req.params
//     if (!username) {
//         throw new apiError(404," username is not found")
//     }

//     User.aggregate([
//         {
//             $match: {
//                 username :username
//             }
//         },

//         {
//             $lookup: {
//                 from: "subscriptions",
//                 foreignField: "channel",
//                 localField: "_id",
//                 as :"subscribers"
//             }
//         },
//         {
//             $lookup: {
//                 from: "subscriptions",
//                 foreignField: "subscriber",
//                 localField: "_id",
//                 as :"channelThatUSerHasSubscibed"
//             }
//         },
//         {
//             $addFields: {
//                 toatalSubsciberOfUser: {
//                   $size: "$subscribers"
//                 },
                
//                 totalchannelthatUserHasSubscribed: {
//                     $size:"$channelThatUSerHasSubscibed"
//                 },
                
//                 issubscibed: {
//                     $cond: {
//                         if: { $in: [req.user._id, "$subscribers.subscriber"] },
//                         then: true,
//                         else: false
//                     }
//                 }
//             }
//         },
//         {
//             $project: {
//                 username: 1,
//                 coverimage: 1, 
//                 avatar: 1,
//                 email: 1,
//                 totalSubscriberOfTheUser: 1,
//                 totalchannelthatUserHasSubscribed: 1,
//                 issubscibed: 1
                
//         }}
                    
        
    
//     ])
// })




// some test on mongodb

// const test = asyncHandler( async(req,res)=>{
//     const {username}=req.params
//     if(!username){
//         throw new apiError(404," usernot found")
//     }

//     const Document = await User.aggregate([{
//         $match:{ username:username },
//         },
//         {
//             $lookup:{
//                 from:"subscriptions",
//                 localField:"_id",
//                 foreignField:"channel",
//                 as:"subcriber"
//             }
//         },
       
        
        
    
//     ])

//     res.json(Document)


// })

// const watchHistory=asyncHandler (async(req , res)=>{
    

//  const userWatchHistory = await User.aggregate([
//     {$match:{ _id:new mongoose.Types.ObjectId(req.user._id) }},
//     { $lookup:{
//         from:"videos",
//         localField:"watchhistory",
//         foreignField:"_id",
//          as:" watchHistory",
//          pipeline:[
//             {
//                 $lookup:{
//                     from:"users",
//                     localField:"owner",
//                     foreignField:" _id",
//                     as:" owner"
//                 }
//             }
//          ]
//     }}

//   ])


// console.log(userWatchHistory)



//   if(!userWatchHistory){
//       throw new apiError(500," something went wrong while finding the watch history")   
//     }

//  res.json(userWatchHistory)



// })


const userWatchHistory = asyncHandler( async(req,res)=>{
   
   const watcHistory = await User.aggregate[
    {$match:{_id:new mongoose.Types.ObjectId(req.user._id)}},
    {$lookup:{
    from:"videos",
    localField:"watchHistory",
    foreignField:"_id",
    as:"document",
    pipeline:[{
        $lookup:{

            from:"users",
            localField:"owner",
            foreignField:"_id",
             as:"owner"

        }}]
    

   }}
]

console.log(watcHistory)

return res.status(200).json(new apiResponse(200, watcHistory, "success"))

})



const userExistOrNot = asyncHandler(async (req, res, next) => {
    
try {
    const { username } = req.body
    console.log(username)
    if (!username) {
        throw  new apiError(404, "user not given ")
    }

    const UserExist = await User.findOne({ username: username })
    if (!UserExist) {
        throw new apiError(404 , "channel doest exist ") 
    }
    

const  doc  =  await User.aggregate([{
   
    $match: {
     _id : new mongoose.Types.ObjectId(UserExist?._id)   
    }},
    {
        $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as:"subscriberCount"
        }
    
    },
    {
        $addFields: {
            totalSubscriberOfTheUser: {
            $size : "$subscriberCount"
            }
        }
    }, {
        $project: {
            username: 1, 
            avatar: 1,
            totalSubscriberOfTheUser : 1,
            _id : 1
        }
    }
])


 return res.status(200).json({status :200, message: " sucessFully fetch the channel", channel : doc})

} catch (error) {
    next(error)
}
})


export {registerUser, loginUser , LoggedOut,changePassword,changeAvatar,changeCoverImage,changeAccountDetails,getUSerChannelDetails,userWatchHistory,userExistOrNot}









 




    
