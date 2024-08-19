import { Router } from "express";
import { JWTverifyToken } from "../middlewares/jwtverify.middleware.js";
import { upload } from "../middlewares/multer.js";
import { doTweet, getAllTweetOfUser, tweetOfTheUserForChannel} from "../controllers/tweet.controller.js";
import { reactionOnTweet } from "../controllers/emoji.controller.js";



export const tweetRouter = Router()

tweetRouter.route("/doTweet").post(JWTverifyToken, upload.fields([{ name: "videoFile", maxCount: 1 }, { name: "imageFile", maxCount: 1 }]), doTweet)
tweetRouter.route("/getAllTweet").get(JWTverifyToken, getAllTweetOfUser);
tweetRouter.route("/fetchTweetForChannel/:userId").get(tweetOfTheUserForChannel)
tweetRouter.route("/reactOnEmoji/:tweetId").post(JWTverifyToken, reactionOnTweet)

