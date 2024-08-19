// import { Router } from "express"
// import { JWTverifyToken } from "../middlewares/jwtverify.middleware.js"
// // import { uploadVideo } from "../controllers/video.controllers.js"
// import { upload } from "../middlewares/multer.js"

// const videoRouter=Router()


// // videoRouter.route("/uploadVideo").post(upload.fields([{name:"thumbnail",maxCount:1},{name:"videofile",maxCount:1}]), JWTverifyToken ,uploadVideo)

// export {videoRouter}
import { UpdateVideo, getAllVideos, getSearchVideo ,videoThatTheUserHasUploaded , UploadVideo,getAllVideoOfUser, videoTooglePublishedUnpublished, deleteVideo, getAllVideoOfUserByName} from "../controllers/video.controller.js";


import { Router } from "express";

import { upload } from "../middlewares/multer.js";
import { JWTverifyToken } from "../middlewares/jwtverify.middleware.js";

const videoRouter=Router()
videoRouter.route("/uploadvideo/:id").post(  upload.fields([
    { 
        name:"thumbnail",
        maxCount:1
    }
    
    ,{
     name:"videofile",
     maxCount:1

    }
]) ,JWTverifyToken , UploadVideo)






videoRouter.route("/UpdateVideo").post(  upload.fields([
    { 
        name:"thumbnail",
        maxCount:1
    }
    
    ,{
     name:"videofile",
     maxCount:1

    }
]) ,JWTverifyToken , UpdateVideo)


videoRouter.route("/allvideo/search?").get(getAllVideos)
videoRouter.route("/userUploadVideo/:playlistId").get(JWTverifyToken , videoThatTheUserHasUploaded)
videoRouter.route("/serchvideo/:search").get(JWTverifyToken, getSearchVideo)
videoRouter.route("/getAllVideoOfUSer").get(JWTverifyToken , getAllVideoOfUser)
videoRouter.route("/videoPublishedOrUnpublished/:videoId").patch(JWTverifyToken, videoTooglePublishedUnpublished)
videoRouter.route("/deleteVideo/:videoId").get(JWTverifyToken, deleteVideo)
videoRouter.route("/getAllVideoByName").post( getAllVideoOfUserByName)
export {videoRouter}