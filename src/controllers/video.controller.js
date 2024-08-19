import { asyncHandler } from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { cloudinaryUpload } from "../utils/cloudinary.upload.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";
import Playlist from "../models/playlist.model.js";

import { User } from "../models/user.model.js";
const getAllVideos=asyncHandler(async(req,res)=>{

const {page = 1, limit = 2, query, sortType, sortBy } = req.query

console.log(req.query)
let pipeline = [];



if(query){
    pipeline.push( {
        $search: {
          index: "videoSearch",
          text: {
            query:query,
            path: ["title" , "description"]
          }
        }
      })
}


if(query){

    pipeline.push(  {
        $search: {
          index: "videoSearch", // optional unless you named your index something other than "default"
          text: {
          query: query,
          path: "title"
          
          }
        }
      })
}

if(sortBy && sortType){

    pipeline.push({
    
        $sort:{
            
            [sortBy]: sortType === "asc"? 1:-1
        }

    })}
    else{

        

         pipeline.push({$sort:{createdAt : 1}}, {$match:{ispublished:true}})



    } 



    const videoDocumentAfterAggregate = await Video.aggregate(pipeline)
      
     const option={
        page:parseInt(page ,10), 
        limit:parseInt(limit, 10)

    }

    const allvideo = await Video.aggregatePaginate(videoDocumentAfterAggregate, option)
    console.log("jay shree ram ")
    console.log(allvideo)
   
return res.status(200).json(new apiResponse( 200 , allvideo, " fetch successfully "))





})

const getSearchVideo = asyncHandler(async (req, res) => {
    
    const { search } = req.params
    console.log(search);
    let pipeline = [];
    
    const user = await User.findOne({
        username: search
     })

if(!user){

    pipeline.push(
        [
            {
              $search: {
                index: "searchVideo",
                text: {
                  query: `${search}`,
                  path: {
                    wildcard: "*"
                  }
                }
              }
            },
            {
                $match: {
                ispublished : true
            }}
          ]
    )

    const data = await  Video.aggregate(pipeline)
    console.log("search video data" + data) 
    return  res.json(data)

}
else {

       const userChannelDetails = await User.aggregate([
        {
             $match: {
            username : search }
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
    

    }
    
}) 


const UploadVideo = asyncHandler(async (req,res)=>{

const { id } = req.params
console.log(id)
const {title, description}=req.body
if(title?.trim()==="" && description?.trim()===""){
    throw new apiError(404," all fields are required")
}
    


console.log(req.body)
 
const localPathOFThumbnail=req.files?.thumbnail[0]?.path
const  localPathOFVideoFile=req.files?.videofile[0]?.path

if( !localPathOFThumbnail ){
    throw new apiError(404, "local path of thumbnail not found ")
}

if(!localPathOFVideoFile){

 throw new apiError(404," local path of videoFile not Found ")


}

const thumbnailresponseofCludinary = await cloudinaryUpload(localPathOFThumbnail)
const videoFileresponseofCludinary = await cloudinaryUpload(localPathOFVideoFile)

if(!thumbnailresponseofCludinary){
    throw new apiError(500," error occured during the upload on cloudinary of thumbnail")
}
if(!videoFileresponseofCludinary){
 
    throw new apiError(500," error occured during the upload  cloudinary of videoFille")
}
console.log("hiiiiiiiiiiiii")


const VideoCreateResponse = await Video.create({
thumbnail:thumbnailresponseofCludinary.url,
videofile:videoFileresponseofCludinary.url,
description:description,
title:title,
owner:req.user._id,
playlist:id
    
})

console.log(VideoCreateResponse)

// const playlist  = await Playlist.findOne({owner : new mongoose.Types.ObjectId(req.user._id)})
// // console.log(response)

// if(!playlist){

//     throw new apiError(500,"not getting  the playlist of the user")


// }

//  playlist.videos.push(VideoCreateResponse._id)

 
//  await playlist.save()





if(!VideoCreateResponse){

    throw new apiError(500," something went wrong when creating Video Document")

}

    
    
res.status(200).json(new apiResponse(200, VideoCreateResponse, "succesfully"))

})




const UpdateVideo =  asyncHandler(async (req,res)=>{

 
    const {videoId}=req.params
    const {title, description}=req.body
    if(title?.trim()==="" && description?.trim()===""){
        throw new apiError(404," all fields are required")
    
    }


    console.log(req.body)
     
    const localPathOFThumbnail=req.files?.thumbnail[0]?.path
    const  localPathOFVideoFile=req.files?.videofile[0]?.path
    
    if( !localPathOFThumbnail ){
        throw new apiError(404, "local path of thumbnail not found ")
    }
    
    if(!localPathOFVideoFile){
    
     throw new apiError(404," local path of videoFile not Found ")
    
    
    }
    
    const thumbnailresponseofCludinary = await cloudinaryUpload(localPathOFThumbnail)
    const videoFileresponseofCludinary = await cloudinaryUpload(localPathOFVideoFile)
    
    if(!thumbnailresponseofCludinary){
        throw new apiError(500," error occured during the upload on cloudinary of thumbnail")
    }
    if(!videoFileresponseofCludinary){
     
        throw new apiError(500," error occured during the upload  cloudinary of videoFille")
    }
    console.log("hiiiiiiiiiiiii")


    
    
 const updateVideoResonse =  await  Video.findByIdAndUpdate(videoId,{$set:{

    title:"title",
    description:"description", 
    thumbnail:thumbnailresponseofCludinary.url,
    videofile:videoFileresponseofCludinary.url
}})


if(!updateVideoResonse){
    throw new apiError(500, " update failed")
}

})

// const videoThatUserHasUploaded = asyncHandler(async(req,res)=>{

//   const AllVideoThatUserHasUploaded= await  User.aggregate([{$match:{
//         _id:new mongoose.Types.ObjectId(req.user._id)
//     } },{
//         $lookup:{
//             from:"videos",
//             localField:"_id",
//             foreignField:"owner",
//             as:"alldocument",


//             pipeline:[{
//                 $lookup:{
//                     from:"users",
//                     foreignField:"_id",
//                     localField:"owner",
//                     as:"owner",
//                     pipeline:[
//                         {
//                             $project:{
//                                 username:1,
//                                 fullname:1
//                             }
                            
                            
//                         },{
//                             $addFields:{
//                                 owner:{
//                                     first:"$alldocument"
//                                 }
//                             }
//                         }
                        
//                     ]
                
//                 }
//             }],
            
            
//         }
//     },

// ])

// console.log(AllVideoThatUserHasUploaded)

// return res.json(200, AllVideoThatUserHasUploaded, "video fetched sucessFully")

// })


const videoThatTheUserHasUploaded = asyncHandler(async(req,res)=>{

 const {playlistId} = req.params
 console.log(playlistId)

 if(!playlistId){
    throw new apiError(400,"we dont find playlist _id")
 }
   const allvideo= await Playlist.aggregate([{

        $match: {
            _id: new mongoose.Types.ObjectId(playlistId)
        }
    },

    {
        $lookup:{
            from:"videos",
            localField:"videos",
            foreignField:"_id",
            as:"document",
         

        }
    },
   
    


])

console.log(allvideo)


if(!allvideo){
    throw new apiError(200,"document not found")
}

res.status(200).json(new apiResponse(200,allvideo,'video fetched successfully' ))


})


const getAllVideoOfUser = asyncHandler(async (req, res) => {
    
 const allVideo = await  Video.aggregate([{
        $match: {
            owner:new mongoose.Types.ObjectId(req.user._id)
        }
    }, {
        $lookup: {
            from: "users", 
            localField: "owner",
            foreignField: "_id",
            as:"document"
        }
     }])
    
    return res.status(200).json(new apiResponse(200, allVideo ,"all video of user fetched successfully"))

})

const videoTooglePublishedUnpublished = asyncHandler(async(req, res) => {
    
    const {videoId} = req.params
    // const {status}=req.body
    if (!videoId) {
        throw new apiError(404,"videoId not found ")
    }
    // if (!status) {

    // throw new apiError(200, "status of video not found")
    // }

    const video= await Video.findOne({_id : videoId})
    let status = video.ispublished;
   const responseofUpdate=await Video.findOneAndUpdate({_id:videoId}, {$set:{ispublished:!status}, new: true })

    
    return res.status(200).json(new apiResponse(200, responseofUpdate, "update successfully"))

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if (!videoId) {
        throw new apiError(404, "videoId not Found")
    }

    const deleteRespnse = await Video.findOneAndDelete({ $or : [{_id : videoId }, {owner : req.user._id }] })
    
    if (deleteRespnse) {
        return res.status(200).json({message : "video deleted ", sucess:true, data: deleteRespnse  })
    }

        
})

const getAllVideoOfUserByName = asyncHandler(async (req, res, next) => {
    try {
        const { username } = req.body
        console.log("hii from  getAllVideoOfUserByName"  + username)
        if (!username) {
            throw new apiError(404, "username not found to get the video of that user")
        } 
   
        const AllVideo = await User.aggregate([{
            $match: {
                username : username
            }},
            {
                $lookup: {
                    from: "videos",
                    foreignField: "owner",
                    localField: "_id",
                    as :"allVideoOfTheUser"
                }
            },
           
          
        ])
        
        
        return res.status(200).json({message : "video found sucessfully", sucess : true , data : AllVideo[0]?.allVideoOfTheUser})
        
    } catch (error) {
        next(error)
    }
})

export {UploadVideo,UpdateVideo,getAllVideos,videoThatTheUserHasUploaded ,getSearchVideo,getAllVideoOfUser,videoTooglePublishedUnpublished, deleteVideo, getAllVideoOfUserByName}
