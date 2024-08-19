import mongoose  from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
// import Playlist from "./playlist.model";
// import { User } from "./user.model";
const videoSchema=new mongoose.Schema({

owner:{
    type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    
},

videofile:{

type:String , // url of local path 
required:true

},

thumbnail:{
 type: String ,
 required:true
},


title:{
    type:String,
    required:[true,"title of video is required "],
    lowercase:[true,"please write in lowercase"],
    required:true
     
},
description:{
    type:String,
    required:[true,"description of video is required "],
    lowercase:true
     
},

duration:{

    type:Number , //from cloudinary
    // required:true 
},

views:{
     type:Number,
    default:0
},


ispublished:{
type:Boolean, // publicly available hai ya nahi 
default : true

},

playlist: {
  
    type : mongoose.Schema.Types.ObjectId,
    ref:"Playlist"
}


},{timestamps:true})

// very very important 
videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video",videoSchema)