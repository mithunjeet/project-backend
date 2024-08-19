import mongoose from "mongoose";
import DisLike from "../models/dislike.model.js";
import Like from "../models/likes.model.js";
import apiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";


const toogleDislikeOnVideo = asyncHandler(async (req, res) => {
    
    const { videoId } = req.params
    console.log("hiiiiiiiiiiiiiiiiiiii",videoId)
    if (!videoId) {
       
        throw new apiError(404, "videoId not found")
    
    }
    
//    const dislike = await DisLike.aggregate([{
//         $match: {
//             dislikeby: new mongoose.Types.ObjectId(req.user._id),
//              video:new mongoose.Types.ObjectId(videoId)
//      }
//    }])
    
//     if (dislike.length === 0) {
        
//    const likeresponse=     await Like.aggregate([{
//             $match: {
//                 likeBy: new mongoose.Types.ObjectId(req.user._id),
//                 video:new mongoose.Types.ObjectId(videoId)
//            }
//         }])
        
//         if (likeresponse.length !== 0) {
          
//       const ressponse=    await Like.find({likeBy: req.user._id, video:videoId})
            
        
//     const deleteResponse = await Like.findByIdAndDelete(ressponse._id)
//      console.log("delete response ", deleteResponse)
            
//         }


//     const dislike =    await DisLike.create({
//             dislikeby: req.user._id,
//             video:videoId
//         })
        

//         return res.status(200).json(new apiResponse(200, dislike,"dislike created successfully "))

    //     }
    

    const likeonvideo = await Like.findOne({
        $and: [
            { video: videoId },
            { likeBy: req.user._id }
        ]
    })
    console.log("liked on video ", likeonvideo)
    if (likeonvideo) {
        const deleteRespnse = await Like.findByIdAndDelete(likeonvideo._id)
        console.log("delete response of video", deleteRespnse)
    }


    

    const dislike= await  DisLike.aggregate([{
     $match: {
         dislikeby: new mongoose.Types.ObjectId(req.user._id),
         video:new mongoose.Types.ObjectId(videoId)
     }
 }])
    
    console.log("dislikefindlength",dislike)
    
    if (dislike.length === 0) {
        
     const dislikecrated=  await DisLike.create({
            dislikeby: req.user._id,
            video:videoId
        })

        return res.status(200).json(new apiResponse(200,dislikecrated,"dislike created  successfully" ))
    }
   
})
    


const allDislikeOnVideo = asyncHandler(async (req, res) => {
    
    const { videoId } = req.params
    if (!videoId) {
        throw new apiError(404, "videoId not found")
    }

 const response = await  DisLike.aggregate([{
        $match: {
            video: new mongoose.Types.ObjectId(videoId),
 
        }
    },
    {
        $group: {
            _id: null,
            count: { $sum: 1 }
        }
    }
])



return res.status(200).json(new apiResponse(200,response, "dislike count fetched sucessFully"))
    
})

export {toogleDislikeOnVideo,allDislikeOnVideo}