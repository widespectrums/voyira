import express from "express";
import {authMiddleware} from "../../middlewares/auth.middleware.js";
import apiLimiter from "../../middlewares/ratelimit.middleware.js";
import {addressController} from "../../controller/index.js";
import {validateBody, validateParams} from "../../validations/index.js";
import {addressValidation} from "../../validations/index.js";
import {baseValidation}  from "../../validations/index.js"


const router = express.Router();
router.use(authMiddleware());
router.use(apiLimiter);

router.post("/",
    validateBody(addressValidation.createAddressSchema),
    addressController.createUserAddress);

router.patch("/:addressId",
    validateParams(baseValidation.idSchema),
    validateBody(addressValidation.updateAddressSchema),
    addressController.updateUserAddress);

router.delete("/:addressId",
    validateParams(baseValidation.idSchema),
    addressController.deleteUserAddress);

router.get("/", addressController.getUserAddresses);



export default router;