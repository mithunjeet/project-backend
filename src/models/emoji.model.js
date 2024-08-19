import mongoose from "mongoose";

const emojiSchema = new mongoose.Schema({

owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref :"User"
    } ,
     emoji: {
      type: String || " ",
    }, 
     
    tweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"Tweet"
    },

name:{
    type: String,
    require : true
}},
    { timestamps: true })

export  const Emoji = mongoose.model("Emoji", emojiSchema);
