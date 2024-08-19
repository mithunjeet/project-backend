// import Comment from "../models/Comment.models";
import mongoose from "mongoose";
import Like from "../models/likes.model.js";
import DisLike from "../models/dislike.model.js";
import apiError from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
// import Tweet from "../models/tweet.model";


// const toogleLikeVideo = asyncHandler(async(req,res)=>{

// const {videoId} = req.params

// if(!videoId){

//     throw new apiError(400," videoId not found")

// }

// const videoLike =await Like.findOne({video : videoId})
// if(videoLike.likeBy === req.user._id){

//    await Like.findByIdAndDelete(videoLike._id)

//    req.status(200).json(200,{}, "like cancel")

// }

// const liked =await Like.create({

//     likeBy: req.user._id,
    
//      video:videoId

// })


// if(!await Like.findById(liked._id)){


//     throw new apiError(200, "not liked ")
// }

// res.status(200).json(new apiResponse(200, {}, "like successfully"))

// })

const toogleLikeComment = asyncHandler(async(req,res)=>{

const  {commentId} =  req.params

if(!commentId){

    throw new apiError(500, " commentid not found ")

}

const commentLike = await    Like.findOne({comment:commentId})


if(commentLike.likeBy === req.user._id){


   const deleteResponse  =  await Like.findByIdAndDelete(commentLike._id)
   
   res.status(200).json(new apiResponse(200,{},""))

}

const likeResponse = await Like.create({
    likeBy:req.user._id,

    comment : commentId 
})


if(!likeResponse){

    throw new apiError(500,"something went wrong while doing like ")

}

res.status(200).json(new apiResponse(200,{}, "liked successfully"))

})


const toogleLikeTweet = asyncHandler(async(req,res)=>{
const {TweetId}=req.params
if(!TweetId){

throw new apiError(500,"Tweetid not found ")

}

const TweetLike = await Like.findOne({Tweet:TweetId})

if(!TweetLike){
    throw new apiError(500,"Tweet not  found ")
}

if(TweetLike.likeBy === req.user._id){

   const resdelete = await Like.findByIdAndDelete(TweetLike._id)

   if(!resdelete){
    throw new apiError(500," delete :sucess")
   }


   return res.status(200).json("sucess")

}


const createRespose  = await Like.create({
    likeBy:req.user.Id,
    tweet:TweetId
})

if(!createRespose){
    throw new apiError(200, "liked not created ")

}

return res.status(200).json("sucess")


})


const toogleDislikeOnVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    if (!videoId) {
        throw new apiError(404, "No videoId found");
      }
    
      const userId = req.user._id;
      const existingDislike= await DisLike.findOne({
        dislikeby : userId,
        video: videoId,
      });
    
    
    if (!existingDislike) {

        const existingLike = await Like.findOneAndDelete({
            likeBy: userId,
            video: videoId,
        });
        
      const dislike = await DisLike.create({
            dislikeby: userId,
            video: videoId
      })
        
      return res.status(200).json(new apiResponse(200, dislike, "Like created successfully"));
    }

    else {
      
        await DisLike.findOneAndDelete({
            dislikeby : userId,
            video: videoId,
          });
      
          return res.status(200).json(new apiResponse(200, null, "dislike removed successfully"));

    }
    
})



const toogleLikeVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
  
    if (!videoId) {
      throw new apiError(404, "No videoId found");
    }
  
    const userId = req.user._id;
  
    const existingLike = await Like.findOne({
      likeBy: userId,
      video: videoId,
    });
  
    if (!existingLike) {
      const existingDislike = await DisLike.findOneAndDelete({
        video: videoId,
        dislikeby: userId,
      });
  
      const newLike = await Like.create({
        likeBy: userId,
        video: videoId,
      });
  
      return res.status(200).json(new apiResponse(200, newLike, "Like created successfully"));
    } else {
      await Like.findOneAndDelete({
        likeBy: userId,
        video: videoId,
      });
  
      return res.status(200).json(new apiResponse(200, null, "Like removed successfully"));
    }
  });
  


const getAllLikeOnvideo = asyncHandler(async (req,res) => {
    
    const { videoId } = req.params
    
    if (!videoId) {
        throw new apiError(404, "videId not found ")
        
    }
console.log(videoId)

 const data = await  Like.aggregate([{
        $match: {
            video: new mongoose.Types.ObjectId(videoId)
        }},
        {
         $group: {
            _id: null,
            totalLikes : { $sum : 1 }
        }}
    
    
 ])
    
 return res.status(200).json({message : "total likes on video", sucess :true ,doc : data[0]})


})

const allLikeVideoOfUSer = asyncHandler(async (req, res, next) => {

 try {
  const {_id} = req.body
  console.log(_id)
  
  if (!_id) { 

    throw new apiError(404, "username not found");

  }
  const likedVideos = await Like.aggregate([
    // {
    //   $match: {
    //     likeBy: new mongoose.Types.ObjectId(_id)
    //   },
    // },
    {
      $lookup: {
        from: "Video", 
        localField: "likeBy", 
        foreignField: "owner", 
        as: "videoDetails", 
      },
    },
    {
      $unwind: "$videoDetails", // Unwind the array to get individual video objects
    },
    {
      $project: {
        _id: 0, // Exclude the _id field
        videoDetails: 1, // Include the video details
      },
    },
  ]);

  return res.status(200).json({ sucess: true })
   
 } catch (error) {
  
   next(error)
 }
 


})

export {toogleLikeComment, toogleLikeTweet, toogleLikeVideo, toogleDislikeOnVideo,getAllLikeOnvideo,allLikeVideoOfUSer}