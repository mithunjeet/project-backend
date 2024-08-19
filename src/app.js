import  express, {urlencoded } from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import { errorhandler } from "./middlewares/errorhandler.middleware.js";
export const app =  express();


app.use(cors({

   origin: "*",
   Credential: true


}))

app.use( express.json({

    limit:"1000kb"
    

}))


app.use(express.urlencoded({
    limit:"1000kb",
    extended:true
}))


app.use(cookieParser())


app.use(express.static("public"))


// routes import

import { userRouter } from "./routes/user.route.js";
import { videoRouter } from "./routes/video.route.js";
import{ PlayListRouter} from "./routes/playlist.route.js";
import commentRouter from "./routes/comment.route.js";
import { likeRouter } from "./routes/like.route.js";
import { DislikeRouter } from "./routes/dislike.route.js";
import { channelRouter } from "./routes/channel.route.js";
import { tweetRouter } from "./routes/tweet.route.js";
// import { videoRouter } from "./routes/video.route.js";

// route decelaration 
// router ko lana ka leya middleware lana hoga 

app.use("/users", userRouter)
app.use("/video", videoRouter)
app.use("/playlist",PlayListRouter)
app.use("/comment", commentRouter)
app.use("/like", likeRouter)
app.use("/dislike", DislikeRouter)
app.use("/channel", channelRouter)
app.use("/tweet", tweetRouter)
app.use(errorhandler)
// https://localhost:3000/users/register