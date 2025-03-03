import Address from "./address.model.js";
import User from "./user.model.js";
import Category from "./category.model.js";
import Brand from "./brand.model.js";
import Image from "./image.model.js";
import Product from "./product.model.js";
import ProductCategories from "./junctions/product-categories.model.js";
import ProductTags from "./junctions/product-tags.model.js";
import Tag from "./tag.model.js";
import Color from "./color.model.js";
import Size from "./size.model.js";
import ProductSizes from "./junctions/product-sizes.model.js";
import ProductColors from "./junctions/product-colors.model.js";

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
};

Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
        models[modelName].associate(models);
    }
});

export default models;