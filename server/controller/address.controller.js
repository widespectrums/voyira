import BaseController from "./base.controller.js";

export default class AddressController extends BaseController {
    constructor(service) {
        super(service);
    }

    createUserAddress = async (req, res, next) => {
        try {
            const address = await this.service.createUserAddress(
                req.auth.userId,
                req.body
            );
            this.handleResponse(res, address, 201);
        } catch (error) {
            next(error);
        }
    };
}