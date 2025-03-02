import express from 'express';
import {authMiddleware} from "../middlewares/auth.middleware.js";
import apiLimiter from "../middlewares/ratelimit.middleware.js";
import {userController} from "../controller/index.js";
import {validateBody} from "../validations/index.js";
import {userValidation} from "../validations/index.js";

const router = express.Router();
router.use(authMiddleware())
router.use(apiLimiter);

router.route("/me")
    .get(userController.getProfile)
    .patch(
        validateBody(userValidation.updateUserSchema),
        userController.updateProfile)

router.post("/me/deactivate", userController.deactivateAccount);
export default router;