import express from 'express';
import {authMiddleware} from "../middlewares/auth.middleware.js";
import apiLimiter from "../middlewares/ratelimit.middleware.js";
import {userController} from "../controller/index.js";

const router = express.Router();
router.use(authMiddleware())
router.use(apiLimiter);

router.route("/me")
    .get(userController.getProfile)
    .patch(userController.updateProfile)

export default router;