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

    getUserAddresses = async (req, res, next) => {
        try {
            const addresses = await this.service.getUserAddresses(req.auth.userId);
            this.handleResponse(res, addresses);
        } catch (error) {
            next(error);
        }
    };

    updateUserAddress = async (req, res, next) => {
       try {
           const updatedAddress = await this.service.updateUserAddress(
               req.params.addressId,
               req.auth.userId,
               req.body
           );
           this.handleResponse(res, updatedAddress);
       } catch (error) {
           next(error);
       }
    };

    deleteUserAddress = async (req, res, next) => {
        try {
            await this.service.deleteUserAddress(
                req.params.addressId,
                req.auth.userId,
            );
            this.handleResponse(res, null, 204);
        } catch (error) {
            next(error);
        }
    };
}