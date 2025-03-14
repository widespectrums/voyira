import User from "../../features/user/models/user.model.js";
import Address from "../../features/user/models/address.model.js";
import Category from "../../features/product/models/category.model.js";
import Brand from "../../features/product/models/brand.model.js";
import Image from "../../features/product/models/image.model.js";
import Product from "../../features/product/models/product.model.js";
import ProductCategories from "../../features/product/models/product-categories.model.js";
import ProductTags from "../../features/product/models/product-tags.model.js";
import Tag from "../../features/product/models/tag.model.js";
import Color from "../../features/product/models/color.model.js";
import Size from "../../features/product/models/size.model.js";
import ProductSizes from "../../features/product/models/product-sizes.model.js";
import ProductColors from "../../features/product/models/product-colors.model.js";
import Cart from "../../features/cart/models/cart.model.js";
import CartItem from "../../features/cart/models/cartItem.model.js";
import ShippingMethod from "../../features/cart/models/shippingMethod.model.js";

const models = {
    User,
    Address,
    Category,
    Brand,
    Image,
    Product,
    ProductCategories,
    ProductTags,
    Tag,
    Color,
    Size,
    ProductSizes,
    ProductColors,
    Cart,
    CartItem,
    ShippingMethod,
};

export const initializeAssociations = () => {
    Object.keys(models).forEach(modelName => {
        if (models[modelName].associate) {
            models[modelName].associate(models);
        }
    });

    console.log("Model ilişkileri başarıyla kuruldu");
};

export const getModel = (modelName) => {
    return models[modelName];
};

export default models;
