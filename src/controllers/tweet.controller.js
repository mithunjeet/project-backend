
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import Tweet from "../models/tweet.model.js";
import { cloudinaryUpload } from "../utils/cloudinary.upload.js";
import apiError from "../utils/apiError.js";

import { User } from "../models/user.model.js";
const doTweet = asyncHandler(async (req, res) => {
    
   const { content } = req.body
     
//    console.log(content)

   const videoFileLOcalPath = req.files?.videoFile?.[0]?.path
   const imageFileLocalFilePath = req.files?.imageFile?.[0]?.path
    
    // console.log(videoFile)
    // console.log(imageFile)

 if (!videoFileLOcalPath && !imageFileLocalFilePath) {
 const response =  await  Tweet.create({
            owner: req.user._id,
            videoFile: "",
            imageFile: "",
           content:content
  })
return res.status(200).json({message:"tweeted succesfully", sucess :true, data : response})        

 }
 
    if (!videoFileLOcalPath && imageFileLocalFilePath) {
        const cloudinaryResponse = await cloudinaryUpload(imageFileLocalFilePath);
      const response =  await  Tweet.create({
               owner: req.user._id,
               videoFile: "",
               imageFile: cloudinaryResponse?.url,
              content:content
     })
   return res.status(200).json({message:"tweeted succesfully", sucess :true, data : response})        
   
    }

    if (videoFileLOcalPath && !imageFileLocalFilePath) {
        const cloudinaryResponse = await cloudinaryUpload(videoFileLOcalPath);
      const response =  await  Tweet.create({
               owner: req.user._id,
               videoFile: "",
               imageFile: cloudinaryResponse?.url,
              content:content
     })
   return res.status(200).json({message:"tweeted succesfully", sucess :true, data : response})        
   
    }

    if (videoFileLOcalPath && imageFileLocalFilePath) {
        const cloudinaryResponseOfVideoFile = await cloudinaryUpload(videoFileLOcalPath);
        const cloudinaryResponseOfImageFile = await cloudinaryUpload(imageFileLocalFilePath);
      const response =  await  Tweet.create({
               owner: req.user._id,
               videoFile:cloudinaryResponseOfVideoFile?.url ,
               imageFile: cloudinaryResponseOfImageFile?.url,
              content:content
     })
    
    return res.status(200).json({ message: "tweeted succesfully", sucess: true, data: response })        
   
    }

})

const getAllTweetOfUser = asyncHandler(async (req, res) => {
     
    let pipeline = [];
    pipeline.push({ $sort: { createdAt: 1 } } , {$match:{owner : req.user._id}})
    const data = await Tweet.aggregate(pipeline)
    if (!data) {
        
    throw new apiError(400, "sorry we are unavaible to find tweet");
}

    return res.status(200).json({ message: "got the  tweet ", sucess: true, data });

})

// const updateTweet = asyncHandler(async(req,res)=>{

// const { tweetId } = req.params
// if(!tweetId){
//     throw new apiError(500, "not found tweeet id ")

// }

// const { content }= req.body

// if(!content){

//     throw new apiError(404, "updataContent not found  ")

// }

// })


const tweetOfTheUserForChannel = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  console.log(userId);
  if (!userId) {
    throw new apiError(400, "User ID not found to find tweet");
  }

  const userTweets = await User.aggregate([
    {
      $match: {
        _id: new  mongoose.Types.ObjectId(userId)
      }
    },
    {
      $lookup: {
        from: "tweets",
        foreignField: "owner",
        localField: "_id",
        as: "allTweets"
      }
    }
  ]);

  if (userTweets) {
    return res.status(200).json({
      message: "Got all tweets of user",
      success: true,
      data: userTweets[0].allTweets
    });
  }

  throw new apiError(500, "Something went wrong during the tweet fetch");
});




export {doTweet,getAllTweetOfUser, tweetOfTheUserForChannel }