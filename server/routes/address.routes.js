import express from "express";
import {authMiddleware} from "../middlewares/auth.middleware.js";
import apiLimiter from "../middlewares/ratelimit.middleware.js";
import {addressController} from "../controller/index.js";

const router = express.Router();
router.use(authMiddleware());
router.use(apiLimiter);


router.post("/", addressController.createUserAddress);


export default router;