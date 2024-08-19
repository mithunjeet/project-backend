import mongoose from "mongoose";

const dislikeSchema = new mongoose.Schema({

    dislikeby: {
    type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    
    },
    video: {
      type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    },
    comment: {
      type:mongoose.Schema.Types.ObjectId,
        ref:"Comment"
    }


}, { timestamps: true })


const DisLike = mongoose.model("DisLike", dislikeSchema)

export default DisLike