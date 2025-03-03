import BaseRepository from "./base.repository.js";
import models from "../models/index.js";
const { Product } = models;

export default class ProductRepository extends BaseRepository {
    constructor() {
        super(Product);
    };



}