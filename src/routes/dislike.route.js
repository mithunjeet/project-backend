import { Router } from "express";
import { JWTverifyToken } from "../middlewares/jwtverify.middleware.js";
import { allDislikeOnVideo, toogleDislikeOnVideo } from "../controllers/dislike.controller.js";
export const DislikeRouter = Router()

DislikeRouter.route("/dislikeOnVideo/:videoId").post(JWTverifyToken, toogleDislikeOnVideo)
DislikeRouter.route("/getAlldislikeOnVideo/:videoId").get(allDislikeOnVideo)
