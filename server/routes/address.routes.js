import express from "express";
import {authMiddleware} from "../middlewares/auth.middleware.js";
import apiLimiter from "../middlewares/ratelimit.middleware.js";
import {addressController} from "../controller/index.js";

const router = express.Router();
router.use(authMiddleware());
router.use(apiLimiter);


router.post("/", addressController.createUserAddress);
router.get("/", addressController.getUserAddresses);
router.patch("/:addressId", addressController.updateUserAddress);
router.delete("/:addressId", addressController.deleteUserAddress);

export default router;