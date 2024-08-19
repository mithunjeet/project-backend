

import { Router } from "express";
import {createPlayList, getPlaylist}from "../controllers/playlist.controller.js";
import { JWTverifyToken } from "../middlewares/jwtverify.middleware.js";
import { getAllVideoOfUser } from "../controllers/playlist.controller.js";
import { getAllVideoOfPlaylist } from "../controllers/playlist.controller.js";
const PlayListRouter = Router();


PlayListRouter.route("/createplaylist").post(JWTverifyToken , createPlayList)
PlayListRouter.route("/getallvideoofuser/:playlistId").get(JWTverifyToken,getAllVideoOfUser)
PlayListRouter.route("/getPlaylist").get(JWTverifyToken, getPlaylist)
PlayListRouter.route("/allVideoOfPlaylist/:id").get(JWTverifyToken , getAllVideoOfPlaylist)
export {PlayListRouter}

