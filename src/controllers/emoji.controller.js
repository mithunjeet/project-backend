import mongoose from "mongoose"
import { Emoji } from "../models/emoji.model.js"
import apiError from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import Tweet from "../models/tweet.model.js"

const reactionOnTweet = asyncHandler(async (req, res) => {
    const { name , emoji } = req.body
    const { tweetId } = req.params
    
    if (!name) {

     throw new apiError(404, "name not found")
    }

    if (!emoji) {

    throw new apiError(404, "emoji not found")
    
    }
    if (!tweetId) {
        
        throw new apiError(404, "tweet id not found")
        
    }

  const reactionExist  =  await   Emoji.findOne({
        $or: [{ owner: req.user._id }, {tweet : new mongoose.Types.ObjectId(tweetid)} ]
    })    
    
    if (!reactionExist) {
        const createEmoji = await Emoji.create({
            tweet: tweetId,
            owner: req.user._id,
            name: name,
            emoji:emoji
            
        })
        
        return res.status(200).json({message : "emoji reacted successfully " , sucess:true , data : createEmoji })
    }

    const emojiupdated =  await Emoji.findByIdAndUpdate( reactionExist._id , {
        $set: {
        name: name,
        emoji: emoji}},
        {new :true})

    
    return  res.status(200).json({
        message: "emoji update succesfully",
        sucess: true,
        data : emojiupdated
    })

    
}) 

const getallEmojiOnTweet = asyncHandler(async (req, res) => {
    
    const { tweetId } = req.params
    
    if (!tweetId) {
        throw new apiError(404, "no tweetId found")
    }

  const doc = await Tweet.aggregate([{
      $match: {
        _id : new mongoose.Types.ObjectId(tweetId)  
      }
    },
    {
       $lookup: {
          from: "emojis",
          foreignField: "tweet",
          localField: "_id",
           as :"allemojiontweets" 
          }
      },
      {
      $addFields: {
            countAllEmoji :{
            $size :"$allemojiontweets"   
            }  
          }
      }
  ])
    
    return res.status(200).json({message : " Emoji fetched sucessfully" , sucess: true, data : doc})

})

export { reactionOnTweet ,  getallEmojiOnTweet}