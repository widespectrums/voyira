import express from 'express';
import {authMiddleware} from "../../../core/milddlewares/auth.middleware.js";
import apiLimiter from "../../../core/milddlewares/ratelimit.middleware.js";
import {validateBody} from "../../../core/validations/validator.js";
import * as userValidation from "../../../core/validations/schemas/user.schema.js";
import UserController from "../controllers/user.controller.js";

const userController = new UserController();
const router = express.Router();
router.use(authMiddleware());
router.use(apiLimiter);

router.route("/me")
    .get(userController.getProfile)
    .patch(
        validateBody(userValidation.updateUserSchema),
        userController.updateProfile);

router.post("/me/deactivate", userController.deactivateAccount);

export default router;
