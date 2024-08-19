import { Router } from "express";
import { JWTverifyToken } from "../middlewares/jwtverify.middleware.js";
import { allLikeVideoOfUSer, getAllLikeOnvideo, toogleDislikeOnVideo, toogleLikeVideo } from "../controllers/like.controller.js";

export const likeRouter = Router();

likeRouter.route("/likeVideo/:videoId").post(JWTverifyToken, toogleLikeVideo)
likeRouter.route("/dislikeVideo/:videoId").post(JWTverifyToken, toogleDislikeOnVideo)
likeRouter.route("/getAllLikeOnVideo/:videoId").get(getAllLikeOnvideo)
likeRouter.route("/allLikeVideo").post(JWTverifyToken,allLikeVideoOfUSer)