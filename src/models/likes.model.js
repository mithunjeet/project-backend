import mongoose from "mongoose";

const likeSchema=new mongoose.Schema({
likeBy:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
},
video:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Video"
},

comment:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Comment"
},



},{timestamps:true})


const Like=mongoose.model("Like", likeSchema)

export default Like