import { Router } from "express";
// import { JWTverifyToken } from "../middlewares/jwtverify.middleware.js";
import { JWTverifyToken } from "../middlewares/jwtverify.middleware.js";
import { getAllCreatedChannle, subscribedChannel } from "../controllers/channel.controller.js";
export const channelRouter = Router();

channelRouter.route("/subscibe/:_id").post(JWTverifyToken, subscribedChannel)
channelRouter.route("/getAllUser").get(getAllCreatedChannle)