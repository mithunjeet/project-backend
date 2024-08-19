import mongoose from "mongoose";
import  Jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { Video } from "./video.model.js";

// yadi kisi bhi field ko searchable bana ho to  index ko true kar da
const userSchema = new mongoose.Schema({

username:{
type:String,
required:true,
unique:true,
lowercase:true,
index:true,
trim : true

},

fullname:{
type:String,
lowercase:true,

required:true,
index:true
},

email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true
},

password:{
    type:String,
   
   
    required:true
 
},

avatar:{
    type:String,
    // required:true
},

coverimage:{
    type:String,
    // required:false
},





watchHistory:[{ type:mongoose.Schema.Types.ObjectId, ref: "Video"}],

refreshtoken:{
    type:String
}

},{timestamps: true})


userSchema.pre("save" , async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
  
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password)
}



// hum schema mai jetna chaha methods inject kar sakata hai

//  userSchema.methods.isPasswordCorrect = async function(password){


//  return await bcrypt.compare(password,this.password)

// }




// jwt ek bearer token hai 
// beartoken sa matlab sa matlab hai jeska  pass bhi  token   hoga uska hum data bhej denga


 userSchema.methods.generateAccesssToken = function(){
 return Jwt.sign({

_id:this._id,
// email:this.email,
// username:this.username,
// fullname:this.fullname

},

process.env.ACCESS_TOKEN_SECRET,

{expiresIn:process.env.ACCESS_TOKEN_EXPIRY}

)
 }


 userSchema.methods.generateRefreshToken = function(){
  
 return  Jwt.sign({
 _id:this._id,

},

process.env.REFRESH_TOKEN_SECRET ,
{
 expiresIn:process.env.REFRESH_TOKEN_EXPIRY

}
  
  )


 }






const User= mongoose.model("User",userSchema)

export { User}


