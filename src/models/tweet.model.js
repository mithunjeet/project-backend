import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema({

    content:{
        type:String,
       
        toLowerCase:true
    },

    owner: {

        type:mongoose.Schema.Types.ObjectId,
        ref:"User"

    },

    imageFile:{

    type : String || "" 
    
    },

    videoFile: {
        
        type: String || "" 
    }




},{timestamps: true})

const Tweet=mongoose.model("Tweet",tweetSchema)

export default Tweet