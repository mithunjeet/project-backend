import {v2 as cloudinary} from "cloudinary"

// import { response } from "express"

import fs from "fs"
 
// fs kya hai ? fs ek file system jo node js  ka under milta hai  


cloudinary.config({

    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env. CLOUDINARY_API_SECRET

})


export const cloudinaryUpload =  async function(localpath){

    try {
        if(localpath){

        const response =await  cloudinary.uploader.upload(localpath,{
            resource_type:"auto"
        }) 

        console.log("FILE HAS UPLOADED SUCCESSFULLY ON CLOUDINARY :" +" URL "+ response.url) 
        
        return response 

        }
        else{

            console.log("LOCAL PATH NOT EXIT TO UPLOAD THE FILE ON THE CLOUDINARY !! ")

        }
        
    } catch (error) {
     // remove the locally saved tempory file 
     
     fs.unlinkSync(localpath)
     console.log(" ERRROR :" +error)
     throw error   


        
    }

}
