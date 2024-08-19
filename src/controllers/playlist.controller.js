import apiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Playlist from "../models/playlist.model.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";


const createPlayList = asyncHandler(async(req,res)=>{

    const {description, name} = req.body
    console.log(req.body)

    if(!description && !name){
        throw new apiError(200, "description and name is required ")
    }
  
const playlist = await Playlist.create({
    name,
    description,
    owner:req.user._id
})

res.status(200).json(new apiResponse(200, playlist, "playlist created "))



})

const getPlaylist = asyncHandler(async (req, res) => {

    const response = await Playlist.find({ owner: req.user._id })
    
    if (!response) {
        throw new apiError( 500, "playlist not found please create playlist first")
    }

    
 const playlist= await  Playlist.aggregate([
      {
          $match: {
          owner :new  mongoose.Types.ObjectId(req.user._id)
          }
      },
      {
          $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "owner",
            as:'document'
          }
      }
      
 ])
    
    
    
  
return res.status(200).json(new apiResponse(200,playlist, 'playlist fetched successfully' ))


})


const getAllVideoOfPlaylist = asyncHandler(async (req, res) => {
    
    const { id } = req.params
    // const response = await Playlist.aggregate([{
      
    //     $match: {
    //         playlist: new mongoose.Types.ObjectId(id)

    //     }
    // },
        
    //     {
    //         $lookup:{
    //             from: "videos",
    //             localField: "_id",
    //             foreignField: "playlist",
    //             as:"document",
    //             // pipeline: [
    //             //     {
                       
    //             //     }
    //             // ]
    //     }} ])

    const response =await Video.aggregate([
        {
            $match: {
                playlist: new mongoose.Types.ObjectId(id)
                
            }
        },
        
        {   $lookup: {
                from: "users", 
                localField: "owner", 
                foreignField: "_id",
                as:"document"
            }
        }
  ])


    if (!response) {
      res.status(200).json(new apiResponse(200, {} ,"no video found in the playlist  please create playlist and then upload some  video "))
}

    return res.status(200).json(new apiResponse(200, { response }, "video fetch successfully in the playlist"))
    

})





// const getAllVideoOfUser = asyncHandler(async(req,res)=>{

// const allvideo = await Playlist.aggregate([

//     {$match:{owner:new mongoose.Types.ObjectId(req.user._id)}},
//      {$lookup:{
//         from:"playlists",
//         localField:"videos",
//         foreignField:"owner",
//         as:"document"

//     }}
// ,   {
//     $lookup: {
//         from: "users",
//         localField: "owner",
//         foreignField: "_id",
//         as: "owner",
//     }
// },

// ])


// console.log(allvideo.document)
// res.status(200).json(new apiResponse (200, allvideo, "success"))


// })


const getAllVideoOfUser = asyncHandler(async(req,res)=>{


const {playlistId}=req.params
// console.log(req.params)
console.log(playlistId)
console.log(typeof(req.params))
    const playlists = await Playlist.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        },


        {
            $lookup: {
                from: "videos",
                localField: "videos",
                foreignField: "_id",
                as: "document",
            }
        },

        
        // {
        //     $match: {
        //         "videos.isPublished": true
        //     }
        // },
        // {
        //     $lookup: {
        //         from: "users",
        //         localField: "owner",
        //         foreignField: "_id",
        //         as: "owner",
        //     }
        // },
        // {
        //     $addFields: {
        //         totalVideos: {
        //             $size: "$videos"
        //         },
        //         totalViews: {
        //             $sum: "$videos.views"
        //         },
        //         owner: {
        //             $first: "$owner"
        //         }
        //     }
        // },


        // {
        //     $project: {
        //         name: 1,
        //         description: 1,
        //         createdAt: 1,
        //         updatedAt: 1,
        //         totalVideos: 1,
        //         totalViews: 1,

        //         videos: {
        //             _id: 1,
        //             videoFile: 1,
        //             thumbnail: 1,
        //             title: 1,
        //             description: 1,
        //             duration: 1,
        //             createdAt: 1,
        //             views: 1
        //         },
        //         owner: {
        //             username: 1,
        //             fullname: 1,
        //             avatar:1
        //         }
        //     }
        // }
        
    ])

    // const video= await Video.find(req.user._id)

    console.log(playlists)
    res.status(200).json(new apiResponse(200,playlists,"sucess"))
})


export {  createPlayList, getAllVideoOfUser, getPlaylist, getAllVideoOfPlaylist}
