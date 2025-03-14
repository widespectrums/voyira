import express from "express";
import {authMiddleware} from "../../../core/milddlewares/auth.middleware.js";
import apiLimiter from "../../../core/milddlewares/ratelimit.middleware.js";
import {validateBody, validateParams} from "../../../core/validations/validator.js";
import * as addressValidation from "../../../core/validations/schemas/address.schema.js";
import * as baseValidation from "../../../core/validations/schemas/base.schema.js";
import AddressController from "../controllers/address.controller.js";

const addressController = new AddressController();
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
