import apiError from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Comment from "../models/Comment.models.js";
import { apiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";


const addCommentToVideo = asyncHandler(async(req,res)=>{


    const {content , videoId, owner}= req.body
    console.log(content)
    console.log(videoId)
    console.log(owner)

  
  

    if(!content){
        throw new apiError(404,"content not found ")
    }

   const commentResponse = await Comment.create({
        content:content,
        owner : owner,
        video : videoId
    })


  const comment = await Comment.findById(commentResponse._id)

    if (!comment) {
        
          throw new apiError(500, 'comment not added ')
  }

    res.status(200).json(new  apiResponse(200, comment , "updateSucessfully"))

})


const deleteCommentOnVideo = asyncHandler(async(req,res)=>{

    const { commentId } = req.params
    
    // console.log("delete comment id", commentId)

const comment = await Comment.aggregate(
    [{
            $match: {
    _id: new mongoose.Types.ObjectId(commentId),
        
    owner: new mongoose.Types.ObjectId(req.user._id)
        }
    }])
    


 if(!comment){

    throw new apiError(200, "comment not found ")

    }

    console.log("hii",comment[0].owner)
    console.log("hii", req.user._id)
    console.log( new mongoose.Types.ObjectId(comment[0].owner))
    const id1 = comment[0].owner;
    const id2 = req.user._id;

    if (id1.equals(id2) ) {
        
        console.log("oooooooooooooooo")
        const deleteResponse = await Comment.findByIdAndDelete(commentId)

       
     return   res.status(200).json(new apiResponse(200, {} ,"deleted succesfully"))
        
}

    
 return  res.status(401).json({ message: "you are  not authorised for this request", success: false})


})


const updataComment= asyncHandler(async(req,res)=>{

    const {commentId} = req.params
    const {newContent}=req.body
    if(!newContent){
        
        throw new apiError(404,"content not found ")

    }

 const   updateComment = await  Comment.findByIdAndUpdate(

        commentId,{
            $set:{
            content:newContent

            }},
        {
            new :true
        })


        res.status(200).json(200,{},"success")



})

const getAllcommentOnVideo = asyncHandler(async(req,res)=>{


    
    const { videoId}  = req.params

    console.log("hiiiiiiiiiiiiiiiiiiii", videoId )
    // const {page=1, limit=10}=req.query
      
 const data=await Comment.aggregate([{
    $match:{
        video: new mongoose.Types.ObjectId(videoId)
    }
 },
     {
        $lookup:{
            from:"users",
            localField:"owner",
            foreignField:"_id",
            as:'users'
        }
    }
])

// const options={
//     page : parseInt(page, 10),
//     limit:parseInt(limit, 10)
// }


// const segregateData = Comment.aggregatePaginate(data, options)
 
console.log(data)

res.status(200).json(new apiResponse(200,data, "success"))


    

})






export {addCommentToVideo , deleteCommentOnVideo , updataComment , getAllcommentOnVideo}